const net = require('net');

const client = net.createConnection({ port: 6666, host: "192.168.88.41"}, () => {
  //console.log('connected to server!');
  //client.write('D0001V00001');
});

function processData(data)
{
  console.log("payload type " + data[0]);
  let joinType;
  switch (data[0])
  {
    case 68:
      joinType = "digital";
    break;
    case 65:
      joinType = "analog";
    break;
  }
  let join = data.toString("utf8",1,5);
  let payloadValue = data.toString("utf8",6,11);
  //console.log("join type " + joinType);
  //console.log("join number " + join);
  //console.log("payload value " + payloadValue);
  return {joinType: joinType, join: join, payloadValue: payloadValue};
}

client.on('data', (data) => {
  //console.log("first listener " + data.toString());
  //console.log("first listener " + data);
  let payload = processData(data);
  console.log(payload);
});

// client.on('data', (data) => {
//   console.log("second listener " + data.toString());
//   //client.end();
// });

client.on('end', () => {
  //console.log('disconnected from server');
});
