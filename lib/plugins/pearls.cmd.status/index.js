(function() {
  var outcome;

  outcome = require("outcome");

  exports.plugin = function() {
    var _this = this;
    return {
      option: {
        command: 'status OR status :group',
        description: 'Gives the status of each running process',
        callback: function(data) {
          try {
            return _this.plugin('pearls.core').group(data.group).all(outcome({
              success: function(processes) {
                var process, _i, _len, _results;
                _results = [];
                for (_i = 0, _len = processes.length; _i < _len; _i++) {
                  process = processes[_i];
                  _results.push((function(process) {})(process));
                }
                return _results;
              }
            }));
          } catch (e) {
            return console.log(e.stack);
          }
        }
      }
    };
  };

}).call(this);
