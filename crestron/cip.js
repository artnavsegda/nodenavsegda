const net = require('net');

//cip protocol scaffold

const client = net.createConnection({ port: 41794, host: "192.168.88.41"}, () => {
    console.log('connected to server');
});

client.on('data', (data) => {
    console.log(data.toString('hex'));
    console.log("type: 0x" + data[0].toString(16));
});

client.on('end', () => {
    console.log('disconnected from server');
});
