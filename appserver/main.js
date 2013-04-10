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

  socket.on('got-city-list', function(data) {
    var cb = requestQueue[data.id];
    if (cb) {
      delete requestQueue[data.id];
      if (cb.doneCb) {
        cb.doneCb(data.result);
      }
    }
  });

  socket.on('disconnect', function() {
    requestQueue = {};
    connection = null;
  });

  ////////////////
  // TEST       //
  ////////////////
  getCityList(function (res) {
    for (var i = 0; i < res.length; i++) {
      console.log(">> " + res[i].station + " " + res[i].code);
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
