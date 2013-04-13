var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    child_process = require('child_process'),
    cacheHelper = require('./cache-helper.js'),
    connection = null;

var requestQueue = {}, lastRequestId = 0, running = false;

function getTaipeiTime() {
  var now = new Date();
  var offset = now.getTimezoneOffset();
  return new Date(now + (offset + 480) * 60000);
}

exports.connect = function (doneCb, errCb) {

  server.listen(45123, '127.0.0.1');

  io.sockets.on('connection', function (socket) {
    console.log("connected");
    if (connection) {
      // We only accept 1 connection at a time.
      socket.disconnect();
      return;
    }

    connection = socket;

    function handleResult(data) {
      console.log("data: " + JSON.stringify(data));
      var cb = requestQueue[data.id];
      if (cb) {
        delete requestQueue[data.id];
        if (cb.doneCb) {
          cb.doneCb(data.result);
        }
      }
      running = false;
      maybeRunNext();
    }

    socket.on('got-city-list', handleResult);
    socket.on('got-train-of-station', handleResult);
    socket.on('got-train', handleResult);

    socket.on('disconnect', function() {
      requestQueue = {};
      connection = null;
    });
  });

  // Run the fetcher program.
  child_process.exec(__dirname + '/../xulrunner/xulrunner ' +
                     __dirname + '/../traintime/application.ini daemon http://localhost:45123',
                     null,
                     function(err) {
                       if (err) {
                         console.log("Fetch child error: " + err);
                       }
                     });

};

function pushToRequestQueue(task, data, doneCb, errCb) {
  var id = "" + (++lastRequestId);
  requestQueue[id] = {
    task: task,
    data: data,
    doneCb: doneCb,
    errCb: errCb
  };
  maybeRunNext();
}

function maybeRunNext() {
  if (running) return;
  if (Object.keys(requestQueue).length == 0) return;

  running = true;
  var nextId = Object.keys(requestQueue)[0];
  var req = requestQueue[nextId];
  connection.emit(req.task, {
    id: nextId,
    data: req.data
  });
}

function doneCallbackWrapper(cacheKey, option, doneCb) {
  return function (result) {
    cacheHelper.addEntry(cacheKey, result, option);
    doneCb(result);
  };
}

exports.getCityList = function getCityList(doneCb, errCb) {
  if (!connection) {
    return;
  }

  var cached = cacheHelper.getEntry('citylist-key');
  if (cached) {
    setTimeout(doneCb, 0, cached);
    return;
  }

  pushToRequestQueue('get-city-list',
                     {},
                     doneCallbackWrapper('citylist-key', { live: 3600000 }, doneCb),
                     errCb);
};

exports.getTodayTrainOfStation = function getTodayTrainOfStation(stationCode, direction, doneCb, errCb) {
  if (!connection) {
    return;
  }

  var date = getTaipeiTime();
  var key = "#getTodayTrainOfStation-" + date.getFullYear() + "-" +
        date.getMonth() + "-" + date.getDate() + "-" + stationCode +
        "-" + direction;
  var cached = cacheHelper.getEntry(key);
  if (cached) {
    setTimeout(doneCb, 0, cached);
    return;
  }

  pushToRequestQueue('get-train-of-station',
                     {
                       year: date.getFullYear(),
                       month: date.getMonth() + 1,
                       day: date.getDate(),
                       stationCode: stationCode,
                       direction: direction
                     },
                     doneCallbackWrapper(key, { live: 3600000 }, doneCb),
                     errCb);
};

exports.getTodayTrain = function getTodayTrain(trainCode, doneCb, errCb) {
  if (!connection) {
    return;
  }

  var date = getTaipeiTime();
  pushToRequestQueue('get-train',
                     {
                       year: date.getFullYear(),
                       month: date.getMonth() + 1,
                       day: date.getDate(),
                       trainCode: trainCode
                     },
                     doneCb,
                     errCb);
};
