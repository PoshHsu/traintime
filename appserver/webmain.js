var fetcher = require("./fetcher-interface.js"),
    web = require("./web.js");

fetcher.connect();

web.start([
  {
    "method": "get",
    "path": /\/trainAt\/([0-9]{4})\/([01])$/,
    "handler": function(req, resp) {
      fetcher.getTodayTrainOfStation(
        parseInt(req.params[0]),
        parseInt(req.params[1]),
        function(result) {
          resp.setHeader("content-type", "text/json; charset=utf-8");
          resp.end(JSON.stringify(result));
        },
        function() { });
    }
  },
  {
    "method": "get",
    "path": /\/train\/([0-9]{2,4})$/,
    "handler": function(req, resp) {
      fetcher.getTodayTrain(
        parseInt(req.params[0]),
        function(result) {
          resp.setHeader("content-type", "text/json; charset=utf-8");
          resp.end(JSON.stringify(result));
        },
        function() { });
    }
  },
  {
    "method": "get",
    "path": "/stations$",
    "handler": function(req, resp) {
      fetcher.getCityList(
        function(result) {
          resp.setHeader("content-type", "text/json; charset=utf-8");
          resp.end(JSON.stringify(result));
        },
        function() { });
    }
  }
], 8080);
