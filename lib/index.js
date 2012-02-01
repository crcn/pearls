(function() {
  var beanpoll, haba, loader, router;

  beanpoll = require("beanpoll");

  haba = require("haba");

  router = beanpoll.router();

  loader = haba.loader();

  loader.params({
    "pearls.core": {
      "dir": "/etc/pearls"
    }
  }).options(router, true).require("" + __dirname + "/plugins").load(function() {
    return router.push('init');
  });

}).call(this);
