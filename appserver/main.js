var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(45123, '127.0.0.1');

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  console.log("received a connection");
  socket.emit('hello', { "val": 'world' });
  socket.on('hi', function (data) {
    console.log(data);
  });
});
