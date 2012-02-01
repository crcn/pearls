(function() {
  var outcome, path;

  outcome = require("outcome");

  path = require("path");

  exports.plugin = function() {
    var _this = this;
    return {
      option: {
        command: 'remove :group OR remove :group :processName',
        description: 'Removes a group or process',
        callback: function(data) {
          var group;
          group = _this.plugin('pearls.core').group(data.group);
          if (!data.processName) {
            return group.remove(function() {});
          } else {
            return group.processes().remove(data.processName, function() {});
          }
        }
      }
    };
  };

}).call(this);
