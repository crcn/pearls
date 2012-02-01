(function() {

  exports.plugin = function() {
    return {
      option: {
        command: 'restart :group OR restart :group :process',
        description: 'Restart group or process',
        callback: function() {
          return console.log("ADD");
        }
      }
    };
  };

}).call(this);
