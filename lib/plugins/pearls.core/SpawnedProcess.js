(function() {
  var EventEmitter, spawn,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  EventEmitter = require("events").EventEmitter;

  spawn = require("child_process").spawn;

  module.exports = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      _Class.__super__.constructor.apply(this, arguments);
    }

    return _Class;

  })(require("./BaseProcess", {
    /*
    */
    _spawn: function(callback) {
      var em, proc,
        _this = this;
      em = new EventEmitter();
      proc = spawn(this.config.get("command"), this.config.get("arguments"), {
        cwd: this.config.get("directory")
      });
      proc.stdout.on("data", function(buffer) {
        return em.emit("stdout", _this._out(buffer));
      });
      proc.stderr.on("data", function(buffer) {
        return em.emit("stderr", _this._out(buffer));
      });
      proc.on("exit", function() {
        return em.emit("exit");
      });
      return callback(null, {
        on: function() {
          return em.on.apply(em, arguments);
        },
        kill: function() {
          return proc.kill();
        }
      });
    },
    _out: function(buffer) {
      return String(buffer).replace(/\n+/g, '');
    }
  }));

}).call(this);
