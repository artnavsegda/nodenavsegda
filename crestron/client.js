const net = require('net');

const client = net.createConnection({ port: 6666, host: "192.168.88.41"}, () => {
  console.log('connected to server!');
  client.write('D0001V00001');
});

client.on('data', (data) => {
  console.log("first listener" + data.toString());


  //client.end();
});

client.on('data', (data) => {
  console.log("second listener" + data.toString());
  //client.end();
});

client.on('end', () => {
  console.log('disconnected from server');
});
