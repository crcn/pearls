(function() {

  exports.plugin = function() {
    return {
      option: {
        command: 'status OR status :group',
        description: 'Gives the status of each running process',
        callback: function() {
          return console.log("ADD");
        }
      }
    };
  };

}).call(this);
