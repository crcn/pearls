(function() {
  var outcome, path;

  outcome = require("outcome");

  path = require("path");

  exports.plugin = function() {
    var loadCommands,
      _this = this;
    loadCommands = function(data) {
      var cmdParts, command, commands, cwd;
      commands = [];
      cmdParts = data.command.split(' ');
      command = cmdParts.shift();
      arguments = cmdParts;
      cwd = process.cwd();
      console.log(data);
      commands.push({
        name: data.name || path.basename(cwd),
        command: command,
        arguments: arguments,
        directory: cwd
      });
      return commands;
    };
    return {
      option: {
        command: 'add :group :command OR add :command OR add',
        description: 'Adds a command or path to .pls',
        optional: {
          "--name": "Name of the process to add"
        },
        callback: function(data) {
          var command, _i, _len, _ref, _results;
          if (!data.command) return;
          try {
            _ref = loadCommands(data);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              command = _ref[_i];
              _results.push(_this.plugin('pearls.core').group(data.group).processes().add(command.name, command, outcome({
                error: function(err) {
                  return console.log(err.message);
                }
              })));
            }
            return _results;
          } catch (e) {
            return console.log(e.stack);
          }
        }
      }
    };
  };

}).call(this);
