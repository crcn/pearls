(function() {

  exports.plugin = function() {
    return {
      option: {
        command: 'add :group :name ***',
        description: 'Adds a command or path to .pls',
        callback: function() {
          return console.log("ADD");
        }
      }
    };
  };

}).call(this);
