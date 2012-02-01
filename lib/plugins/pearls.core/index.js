(function() {
  var TreeProcess, cli, yaconfig;

  cli = require("celeri");

  TreeProcess = require("./TreeProcess");

  yaconfig = require("yaconfig");

  exports.plugin = function(router, params) {
    var root,
      _this = this;
    root = new TreeProcess("root", yaconfig.file("" + params.dir + "/processes.json"));
    return {
      init: function() {
        var plugin, _i, _len, _ref;
        _ref = _this.plugins("pearls.cmd.*");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          plugin = _ref[_i];
          cli.option(plugin.option);
        }
        return cli.parse(process.argv);
      },
      group: function(name) {
        if (name) {
          return root.child(name);
        } else {
          return root;
        }
      }
    };
  };

}).call(this);
