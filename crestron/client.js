const net = require('net');
const http = require('http');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const client = net.createConnection({ port: 6666, host: "192.168.88.41"}, () => {
});

client.on('data', (data) => {
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
  eventEmitter.emit('update', {joinType: joinType, join: join, payloadValue: payloadValue});
});

function subscribeFb(joinType, join, payloadCallback)
{
  eventEmitter.on('update', (payload) => {
    if (payload.joinType == joinType && payload.join == join)
      payloadCallback(payload.payloadValue);
  });
}

subscribeFb("analog", 1, (payload) => {
  console.log('first analog value ' +  payload);
});


function pad(num, size){     return ('000000000' + num).substr(-size); }

http.request({
  host: '192.168.88.41',
  port: '7001',
  path: pad(1, 4)
}, (response) => {
  var str = '';

  //another chunk of data has been received, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been received, so we just print it out here
  response.on('end', function () {
    console.log(str);
  });
}).end();
