(function() {

  exports.plugin = function() {
    return {
      option: {
        command: 'start :group OR start :group :process',
        description: 'Start a new group of processes',
        callback: function() {
          return console.log("ADD");
        }
      }
    };
  };

}).call(this);
