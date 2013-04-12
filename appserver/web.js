var express = require('express');
var app = express();

exports.start = function start(handlerList, port) {
  for (var i = 0; i < handlerList.length; i++) {
    var handlerObject = handlerList[i];
    app[handlerObject.method](handlerObject.path, handlerObject.handler);
  }
  app.listen(port);
};

