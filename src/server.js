const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html ' });
  res.write(index);
  res.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1 ${port}`);

// pass in the http server into socketio and grab websocket as io
const io = socketio(app);

const onJoined = (sock) => {
  const socket = sock;

  socket.on('join', () => {
    socket.join('room1');
  });
};

const onMsg = (sock) => {
  const socket = sock;

  // create an image from data received
  socket.on('draw', (data) => {
    io.sockets.in('room1').emit('drawToCanvas', data);
  });
};

const onDisconnect = (sock) => {
  const socket = sock;

  socket.leave('room1');
};

io.sockets.on('connection', (socket) => {
  console.log('started');

  onJoined(socket);
  onMsg(socket);
  onDisconnect(socket);
});

console.log('Websocket server started');
