const net = require('net');

const client = net.createConnection({ port: 6666, host: "192.168.88.41"}, () => {
  console.log('connected to server!');
  //client.write('D0001V00001');
});

client.on('data', (data) => {
  //console.log("first listener " + data.toString());
  console.log("first listener " + data);
  console.log("payload type " + data[0]);
  switch (data[0])
  {
    case 68:
      console.log("digital");
      var join = data.toString("utf8",1,5);
      console.log("join number " + join);
      if (join == 1)
        console.log("first join");
    break;
    case 65:
      console.log("analog");
      var join = data.toString("utf8",1,5);
      console.log("join number " + join);
      if (join == 1)
        console.log("first join");
      let payloadValue = data.toString("utf8",6,11);
      console.log("payload value " + payloadValue);
    break;
  }

});

// client.on('data', (data) => {
//   console.log("second listener " + data.toString());
//   //client.end();
// });

client.on('end', () => {
  console.log('disconnected from server');
});
