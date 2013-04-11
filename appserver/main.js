var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    connection = null;

var requestQueue = {}, lastRequestId = 0;

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
    var cb = requestQueue[data.id];
    if (cb) {
      delete requestQueue[data.id];
      if (cb.doneCb) {
        cb.doneCb(data.result);
      }
    }
  }

  socket.on('got-city-list', handleResult);
  socket.on('got-train-of-station', handleResult);

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

function getCityList(doneCb, errCb) {
  if (!connection) {
    return;
  }

  var id = ++lastRequestId;
  requestQueue[id] = {
    doneCb: doneCb,
    errCb: errCb
  };
  connection.emit('get-city-list', { id: id });
}

function getTodayTrainOfStation(stationCode, direction, doneCb, errCb) {
  if (!connection) {
    return;
  }

  var id = ++lastRequestId;
  requestQueue[id] = {
    doneCb: doneCb,
    errCb: errCb
  };

  var date = new Date();
  connection.emit('get-train-of-station', {
    id: id,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    stationCode: stationCode,
    direction: direction
  });
}
