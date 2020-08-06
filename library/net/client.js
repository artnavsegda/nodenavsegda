const net = require('net');

const client = net.createConnection(9999, "192.168.88.41", () => {
  console.log('connected to server!');
  client.write('hello');
  setTimeout(()=>client.write('again'),1000)
});

client.on('data', (data) => {
  console.log(data.toString());
  //client.end();
});

client.on('end', () => {
  console.log('disconnected from server');
});
