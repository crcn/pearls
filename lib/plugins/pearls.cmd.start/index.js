(function() {
  var outcome;

  outcome = require("outcome");

  require("colors");

  exports.plugin = function() {
    var _colors, _nextColor, _procColor, _procColors,
      _this = this;
    _procColors = {};
    _colors = ['green', 'cyan', 'magenta', 'blue'];
    _nextColor = function() {
      var color;
      color = _colors.shift();
      _colors.push(color);
      return color;
    };
    _procColor = function(name) {
      return _procColors[name] || (_procColors[name] = _nextColor());
    };
    return {
      option: {
        command: 'start :group OR start :group :process',
        description: 'Start a new group of processes',
        callback: function(data) {
          var group;
          group = _this.plugin('pearls.core').group(data.group);
          return group.start(outcome({
            success: function() {
              group.on("stdout", function(source) {
                var cliColor;
                cliColor = _procColor(source.process.name);
                return console.log("%s: %s", source.process.name[cliColor].bold, source.text);
              });
              return group.on("stderr", function(source) {
                var cliColor;
                cliColor = _procColor(source.process.name);
                return console.error("%s: %s", source.process.name[cliColor].bold, source.text.red);
              });
            }
          }));
        }
      }
    };
  };

}).call(this);
