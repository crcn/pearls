(function() {

  exports.plugin = function() {
    return {
      option: {
        command: 'stop :group OR stop :group :process',
        description: 'Stop a process group or process',
        callback: function() {
          return console.log("ADD");
        }
      }
    };
  };

}).call(this);
