const net = require('net');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const client = net.createConnection({ port: 6666, host: "192.168.88.41"}, () => {
  //console.log('connected to server!');
  //client.write('D0001V00001');
});

function processData(data)
{
  //console.log("payload type " + data[0]);
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
  //console.log(payload);
  eventEmitter.emit('update', payload);
});

// client.on('data', (data) => {
//   console.log("second listener " + data.toString());
//   //client.end();
// });

eventEmitter.on('update', (payload) => {
  console.log('new data');
  console.log(payload);
});

function subscribeFb(joinType, join, payloadCallback)
{
  eventEmitter.on('update', (payload) => {
    if (payload.joinType == joinType && payload.join == join)
    {
      payloadCallback(payload.payloadValue);
    }
  });
}

subscribeFb("analog", 1, (payload) => {
  console.log('first analog value ' +  payload);
});
