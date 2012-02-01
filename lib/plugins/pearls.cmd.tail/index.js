(function() {

  exports.plugin = function() {
    return {
      option: {
        command: 'tail :group OR tail :group :process',
        description: 'Tails a group for logs',
        callback: function() {
          return console.log("ADD");
        }
      }
    };
  };

}).call(this);
