(function() {
  var EventEmitter, disposable, outcome;

  EventEmitter = require("events").EventEmitter;

  disposable = require("disposable");

  outcome = require("outcome");

  module.exports = function(processes, callback) {
    var control, em, listeners, numStarting, numStopping, onOut, onProcessStart, process, _fn, _i, _len,
      _this = this;
    em = new EventEmitter();
    listeners = disposable.create();
    numStopping = processes.length + 1;
    numStarting = processes.length + 1;
    control = {
      on: function() {
        return em.on.apply(em, arguments);
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
        listeners.dispose();
        return onStop();
      }
    };
    onProcessStart = function() {
      if (!(--numStopping)) return callback(null, control);
    };
    onOut = function(process, type) {
      return listeners.add(process.on(type, function(buffer) {
        return em.emit(type, {
          process: process,
          text: buffer
        });
      }));
    };
    _fn = function(process) {
      process.start(onProcessStart);
      onOut(process, "stdout");
      return onOut(process, "stderr");
    };
    for (_i = 0, _len = processes.length; _i < _len; _i++) {
      process = processes[_i];
      _fn(process);
    }
    return onProcessStart();
  };

}).call(this);
