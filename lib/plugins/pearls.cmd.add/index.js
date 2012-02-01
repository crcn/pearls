(function() {
  var fglob, fs, ini, outcome, path, _exists;

  outcome = require("outcome");

  path = require("path");

  fs = require("fs");

  fglob = require("fglob");

  ini = require("ini");

  _exists = function(path) {
    try {
      return !!fs.statSync(path);
    } catch (e) {
      return false;
    }
  };

  exports.plugin = function() {
    var _commandFromData, _loadCommands, _loadIni, _name, _packageName, _scanIni,
      _this = this;
    _packageName = function(data) {
      return JSON.parse(fs.readFileSync("" + data.directory + "/package.json", "utf8")).name;
    };
    _name = function(data) {
      if (data.name) return data.name;
      if (_exists("" + data.directory + "/package.json")) {
        return _packageName(data);
      }
      return path.basename(data.directory);
    };
    _commandFromData = function(data) {
      var cmdParts, command, commands, cwd;
      commands = [];
      cmdParts = data.command.split(' ');
      command = cmdParts.shift();
      arguments = cmdParts;
      cwd = process.cwd();
      return {
        name: _name(data),
        command: command,
        arguments: arguments,
        directory: cwd,
        group: data.group
      };
    };
    _loadIni = function(file, data, callback) {
      var cfg, commands, procCfg, procName;
      cfg = ini.parse(fs.readFileSync(file, 'utf8'));
      commands = [];
      for (procName in cfg) {
        procCfg = cfg[procName];
        procCfg.dir = path.dirname(file);
        procCfg.name = procName;
        procCfg.group = data.group || path.basename(file).split('.').shift();
        commands.push(_commandFromData(procCfg));
      }
      return callback(commands);
    };
    _scanIni = function(data, callback) {
      return fglob("" + data.directory + "/*.prls", function(files) {
        var allCommands, file, numRunning, _i, _len, _results;
        if (!files.length) return callback(null, []);
        numRunning = files.length;
        allCommands = [];
        _results = [];
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          _results.push((function(file) {
            return _loadIni(file, data, function(commands) {
              allCommands = allCommands.concat(commands);
              if (!(--numRunning)) return callback(null, allCommands);
            });
          })(file));
        }
        return _results;
      });
    };
    _loadCommands = function(data, callback) {
      if (!data.directory) data.directory = process.cwd();
      if (data.command) return callback(null, [_commandFromData(data)]);
      return _scanIni(data, callback);
    };
    return {
      option: {
        command: 'add :group :command OR add :command OR add',
        description: 'Adds a command or path to .pls',
        optional: {
          "--name": "Name of the process to add"
        },
        callback: function(data) {
          return _loadCommands(data, outcome({
            success: function(commands) {
              var command, _i, _len, _results;
              _results = [];
              for (_i = 0, _len = commands.length; _i < _len; _i++) {
                command = commands[_i];
                _results.push(_this.plugin('pearls.core').group(command.group).processes().add(command.name, command, outcome({
                  error: function(err) {
                    return console.log(err.message);
                  }
                })));
              }
              return _results;
            }
          }));
        }
      }
    };
  };

}).call(this);
