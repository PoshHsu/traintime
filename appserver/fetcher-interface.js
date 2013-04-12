var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    connection = null;

var requestQueue = {}, lastRequestId = 0, running = false;

server.listen(45123, '127.0.0.1');

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
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

  ////////////////
  // TEST       //
  ////////////////
  // getCityList(function (res) {
  //   for (var i = 0; i < res.length; i++) {
  //     console.log(">> " + res[i].station + " " + res[i].code);
  //   }
  // }, null);

  getTodayTrainOfStation(1008, 0, function (res) {
    for (var i = 0; i < res.length; i++) {
      var train = res[i];
      console.log("type: " + train.type);
      console.log("code: " + train.code.code);
      console.log("terminal: " + train.terminal);
      console.log("arrive: " + train.arrive);
      console.log("leave: " + train.leave);
    }
  }, null);
});

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

function getCityList(doneCb, errCb) {
  if (!connection) {
    return;
  }

  pushToRequestQueue('get-city-list', {}, doneCb, errCb);
}

function getTodayTrainOfStation(stationCode, direction, doneCb, errCb) {
  if (!connection) {
    return;
  }

  var date = new Date();
  pushToRequestQueue('get-train-of-station',
                     {
                       year: date.getFullYear(),
                       month: date.getMonth() + 1,
                       day: date.getDate(),
                       stationCode: stationCode,
                       direction: direction
                     },
                     doneCb,
                     errCb);
}

function getTodayTrain(trainCode, doneCb, errCb) {
  if (!connection) {
    return;
  }

  var date = new Date();
  pushToRequestQueue('get-train',
                     {
                       year: date.getFullYear(),
                       month: date.getMonth() + 1,
                       day: date.getDate(),
                       trainCode: trainCode
                     },
                     doneCb,
                     errCb);
}
