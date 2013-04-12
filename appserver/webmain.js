var fetcher = require("./fetcher-interface.js"),
    web = require("./web.js");

fetcher.connect();

web.start([
  {
    "method": "get",
    "path": "/trainAt/1008/0",
    "handler": function(req, resp) {
      fetcher.getTodayTrainOfStation(1008, 0, function(result) {
        resp.end(JSON.stringify(result));
      }, function() { });
    }
  },
  {
    "method": "get",
    "path": "/trainAt/1008/1",
    "handler": function(req, resp) {
      fetcher.getTodayTrainOfStation(1008, 1, function(result) {
        resp.end(JSON.stringify(result));
      }, function() { });
    }
  }
], 8080);
