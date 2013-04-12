var fetcher = require("./fetcher-interface.js"),
    web = require("./web.js");

fetcher.connect();

web.start([
  {
    "method": "get",
    "path": "/trainAt/:stationId/:direction",
    "handler": function(req, resp) {
      fetcher.getTodayTrainOfStation(parseInt(req.params.stationId),
                                     parseInt(req.params.direction),
                                     function(result) {
        resp.end(JSON.stringify(result));
      }, function() { });
    }
  },
  {
    "method": "get",
    "path": "/train/:trainId",
    "handler": function(req, resp) {
      fetcher.getTodayTrain(parseInt(req.params.trainId),
                            function(result) {
        resp.end(JSON.stringify(result));
      }, function() { });
    }
  },
  {
    "method": "get",
    "path": "/stations",
    "handler": function(req, resp) {
      fetcher.getCityList(function(result) {
        resp.end(JSON.stringify(result));
      }, function() { });
    }
  }
], 8080);
