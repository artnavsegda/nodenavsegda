const WebSocket = require('ws');

const ws = new WebSocket('ws://192.168.88.41:8080');

ws.on('open', function open() {
  console.log("connected");
  ws.send('hello');
});

ws.on('message', function incoming(data) {
  console.log(data);
});
