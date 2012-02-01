(function() {
  var EventEmitter, outcome;

  EventEmitter = require("events").EventEmitter;

  outcome = require("outcome");

  module.exports = (function() {
    /*
    */
    function _Class(name, config) {
      this.name = name;
      this.config = config;
      this._em = new EventEmitter();
    }

    /*
    */

    _Class.prototype.running = function() {
      return !!this._process;
    };

    /*
    */

    _Class.prototype.start = function(callback) {
      var _this = this;
      if (this.running()) return callback(new Error("Process is already running"));
      return this._spawn(outcome({
        success: function(proc) {
          _this._process = proc;
          proc.on("stdout", function(buffer) {
            return _this._em.emit("stdout", buffer);
          });
          proc.on("stderr", function(buffer) {
            return _this._em.emit("stderr", buffer);
          });
          proc.on("exit", function() {
            return _this._process = null;
          });
          return callback();
        }
      }));
    };

    /*
    */

    _Class.prototype.stop = function(callback) {
      if (!this.running()) return callback(new Error("Process is not running"));
      this._em.once("exit", callback);
      return this._process.kill();
    };

    /*
    */

    _Class.prototype.restart = function(callback) {
      var _this = this;
      return this.start(function() {
        return _this.stop(function() {
          return callback();
        });
      });
    };

    /*
    */

    _Class.prototype.on = function(type, callback) {
      var _this = this;
      this._em.on(type, callback);
      return {
        dispose: function() {
          return _this._em.removeListener(type, callback);
        }
      };
    };

    /*
    */

    _Class.prototype._spawn = function() {};

    return _Class;

  })();

}).call(this);
