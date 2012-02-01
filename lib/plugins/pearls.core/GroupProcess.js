(function() {
  var EventEmitter, GroupProcess, Processes, disposable, outcome,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Processes = require("./Processes");

  EventEmitter = require("events").EventEmitter;

  outcome = require("outcome");

  disposable = require("disposable");

  module.exports = GroupProcess = (function(_super) {

    __extends(GroupProcess, _super);

    function GroupProcess() {
      GroupProcess.__super__.constructor.apply(this, arguments);
    }

    return GroupProcess;

  })(require("./BaseProcess", {
    /*
    */
    constructor: function(name, config, parent) {
      this.parent = parent;
      constructor.__super__.constructor.call(this, name, config);
      return this._children = {};
    },
    /*
    */
    child: function(name) {
      return this._children[name] || (this._children[name] = new GroupProcess(name, this.config.get("groups:" + name), this));
    },
    /*
    */
    processes: function() {
      return this._procs || (this._procs = new Processes(this.config.get("processes"), this));
    },
    /*
    */
    _spawn: function(callback) {
      var em, listeners,
        _this = this;
      em = new EventEmitter();
      listeners = disposable();
      return this.processes().all(outcome({
        success: function(processes) {
          var control, numStarting, numStopping, onOut, onStart, process, _fn, _i, _len;
          numStopping = process.length + 1;
          numStarting = processes.length + 1;
          control = {
            on: function() {
              return em.apply(null, arguments);
            },
            kill: function() {
              var onStop, process, _i, _len;
              onStop = function() {
                if (!(--numStopping)) return em.emit("exit");
              };
              for (_i = 0, _len = processes.length; _i < _len; _i++) {
                process = processes[_i];
                process.stop(onStop);
              }
              return onStop();
            }
          };
          onStart = function() {
            if (!(--numStopping)) return callback(null, control);
          };
          onOut = function(process, type) {
            return listener.add(process.on(type, function(buffer) {
              return em.emit(type, {
                process: process,
                text: buffer
              });
            }));
          };
          _fn = function(process) {
            process.start(onStart);
            onOut(process, "stdout");
            return onOut(process, "stderr");
          };
          for (_i = 0, _len = processes.length; _i < _len; _i++) {
            process = processes[_i];
            _fn(process);
          }
          return onStart();
        }
      }));
    }
  }));

}).call(this);
