(function() {
  var SpawnedProcess, outcome;

  SpawnedProcess = require("./SpawnedProcess");

  outcome = require("outcome");

  module.exports = (function() {
    /*
    */
    function _Class(config, group) {
      this.config = config;
      this.group = group;
      this._procs = {};
    }

    /*
    */

    _Class.prototype.add = function(name, ops, callback) {
      var cfg;
      if (this.config.get(name)) {
        return callback(new Error("Process already exists"));
      }
      cfg = this.config.set(name, ops);
      return this.get(name, callback);
    };

    /*
    */

    _Class.prototype.remove = function(name, callback) {
      var _this = this;
      return self.get(name, outcome({
        success: self.stop(name(function() {
          callback();
          _this.config.set(name, void 0);
          return delete _this._procs[name];
        })),
        error: callback
      }));
    };

    /*
    */

    _Class.prototype.get = function(name, callback) {
      if (!this.config.get(name)) {
        return callback(new Error("Process does not exist"));
      }
      return callback(null, this._procs[name] || (this._procs[name] = new SpawnedProcess(name, this.config.get(name), this)));
    };

    /*
    */

    _Class.prototype.all = function(callback) {
      var all, numRunning, onProcess, proc, procs, _i, _len;
      procs = Object.keys(this.config.get());
      numRunning = procs.length + 1;
      all = [];
      onProcess = function() {
        if (!--running) return callback(null, all);
      };
      for (_i = 0, _len = procs.length; _i < _len; _i++) {
        proc = procs[_i];
        self.get(proc, function(inst) {
          all.push(inst);
          return onProcess();
        });
      }
      return onProcess();
    };

    /*
    */

    _Class.prototype.start = function(name, callback) {
      return this.get(name, outcome({
        success: function(proc) {
          return proc.start(callback);
        },
        error: callback
      }));
    };

    /*
    */

    _Class.prototype.stop = function(name, callback) {
      return this.get(name, outcome({
        success: function(proc) {
          return proc.stop(callback);
        },
        error: callback
      }));
    };

    return _Class;

  })();

}).call(this);
