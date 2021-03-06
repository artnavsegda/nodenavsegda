const express = require('express');
const app = express();
const net = require('net');
app.use(express.json());
const port = 3000;

var state = {currentState: false};

app.get('/', (req, res) => res.send('Hello World!'));

//app.get('/status', (req, res) => {res.send({currentState: true})})
app.get('/status', (req, res) => {
  console.log("status");
  console.log(state);
  res.send(state)
});

app.post('/command', (req, res) => {
  console.log("executing");
  console.log(req.body);
  state = req.body;
  res.send('complete');
});

app.listen(port, () => console.log(`HTTP listening on port ${port}`));

const server = net.createServer((c) => {
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});

server.on('error', (err) => {
  throw err;
});

server.listen(8888, () => console.log(`Socket listening on port 8888!`));
