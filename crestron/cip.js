const net = require('net');

//cip protocol scaffold

const client = net.createConnection({ port: 41794, host: "192.168.88.41"}, () => {
    console.log('connected to server');

    setInterval(()=>{
        client.write("\x0D\x00\x02\x00\x00");
    },5000);

});

client.on('data', (data) => {
    console.log(data.toString('hex'));

    let payloadType = data[0];
    console.log("type: 0x" + payloadType.toString(16));

    switch (payloadType)
    {
        case 0x0f:
            console.log("Client registration request");
            client.write("\x01\x00\x0b\x00\x00\x00\x00\x00" + "\x03" + "\x40\xff\xff\xf1\x01");
        break;
        case 0x02:
            console.log("registration ok");
            client.write("\x05\x00\x05\x00\x00\x02\x03\x00");
        break;
        case 0x05:
            console.log("data");
        break;
        case 0x0D:
        case 0x0E:
            console.log("heartbeat");
        break;
    }

});

client.on('end', () => {
    console.log('disconnected from server');
});
