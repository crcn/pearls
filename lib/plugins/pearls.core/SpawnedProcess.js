(function() {
  var BaseProcess, EventEmitter, spawn,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  EventEmitter = require("events").EventEmitter;

  spawn = require("child_process").spawn;

  BaseProcess = require("./BaseProcess");

  module.exports = (function(_super) {

    __extends(_Class, _super);

    function _Class() {
      _Class.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    _Class.prototype._spawn = function(callback) {
      var em, out, proc;
      em = new EventEmitter();
      proc = spawn(this.config.get("command"), this.config.get("arguments"), {
        cwd: this.config.get("directory")
      });
      out = function(type, buffer) {
        var chunk, _i, _len, _ref, _results;
        buffer = String(buffer);
        _ref = buffer.split(/\n+/g);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          chunk = _ref[_i];
          if (!chunk.match(/[^\s]+/)) continue;
          _results.push(em.emit(type, chunk));
        }
        return _results;
      };
      proc.stdout.on("data", function(buffer) {
        return out("stdout", buffer);
      });
      proc.stderr.on("data", function(buffer) {
        return out("stderr", buffer);
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
    };

    return _Class;

  })(BaseProcess);

}).call(this);
