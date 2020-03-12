const dgram = require('dgram');
const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.bind(41234, function() {
    client.setBroadcast(true);
    server.setMulticastTTL(128);
    socket.setMulticastLoopback(true);
    //server.addMembership(MCAST_ADDR);
    client.send(message, 41234, '0.0.0.0', (err) => {
      client.close();
    });
});
