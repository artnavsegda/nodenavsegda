const net = require('net');
const http = require('http');
const fetch = require('node-fetch');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const client = new net.Socket()
var intervalConnect = false;

function connect() {
    client.connect({ port: 6666, host: "192.168.88.41"})
}

function launchIntervalConnect() {
    if(false != intervalConnect) return
    intervalConnect = setInterval(connect, 5000)
}

function clearIntervalConnect() {
    if(false == intervalConnect) return
    clearInterval(intervalConnect)
    intervalConnect = false
}

client.on('connect', () => {
    clearIntervalConnect()
    console.log('connected to server', 'TCP')
    client.write('CLIENT connected');
})

client.on('error', (err) => {
    console.log(err.code, 'TCP ERROR')
    launchIntervalConnect()
})
client.on('close', launchIntervalConnect)
client.on('end', launchIntervalConnect)

//connect()
//
//const client = net.createConnection({ port: 6666, host: "192.168.88.41"}, () => {
//});

client.on('data', (data) => {
  let parseString = data.toString("utf8")
  //console.log('INRAW: ' + parseString);
  let commands = parseString.split('X');
  commands.pop();
  commands.forEach((value) => {
    //console.log("section: " + value);
    let joinType;
    switch (value.charAt(0))
    {
      case 'D':
        joinType = "digital";
      break;
      case 'A':
        joinType = "analog";
      break;
    }
    let join = value.substr(1,4);
    let payloadValue = value.substr(6,5);
    eventEmitter.emit('update', {joinType: joinType, join: join, payloadValue: payloadValue});
  });
});

function subscribeFb(joinType, join, payloadCallback)
{
  eventEmitter.on('update', (payload) => {
    console.log(payload);
    if (payload.joinType == joinType && payload.join == join)
      payloadCallback(payload.payloadValue);
  });
}

subscribeFb("analog", 1, (payload) => {
  console.log('first analog value ' +  payload);
});

function dwrite(join)
{
  function pad(num, size){     return ('000000000' + num).substr(-size); }
  // http.request({
  //   host: '192.168.88.41',
  //   port: '7001',
  //   path: '/D' + pad(join, 4)
  // }, (response) => {
  //   var str = '';
  //   response.on('data', (chunk) => str += chunk);
  //   response.on('end', () => console.log(str));
  // }).end();

  fetch('http://192.168.88.41:7001/D' + pad(join, 4))
      .then(res => res.text())
      .then(body => console.log(body));
}

//dwrite(1);

function awrite(join, value)
{
  function pad(num, size){     return ('000000000' + num).substr(-size); }
  // http.request({
  //   host: '192.168.88.41',
  //   port: '7001',
  //   path: '/A' + pad(join, 4) + 'V' + pad(value, 5)
  // }, (response) => {
  //   var str = '';
  //   response.on('data', (chunk) => str += chunk);
  //   response.on('end', () => console.log(str));
  // }).end();

  fetch('http://192.168.88.41:7001/A' + pad(join, 4) + 'V' + pad(value, 5))
      .then(res => res.text())
      .then(body => console.log(body));

}

//awrite(1, 100);

function dread(join)
{
  function pad(num, size){     return ('000000000' + num).substr(-size); }
  // http.request({
  //   host: '192.168.88.41',
  //   port: '7001',
  //   path: '/G' + pad(join, 4)
  // }, (response) => {
  //   var str = '';
  //   response.on('data', (chunk) => str += chunk);
  //   response.on('end', () => console.log(str));
  // }).end();

  fetch('http://192.168.88.41:7001/G' + pad(join, 4))
      .then(res => res.text())
      .then(body => console.log(body));

}

console.log("digital");
dread(1);

function aread(join)
{
  function pad(num, size){     return ('000000000' + num).substr(-size); }
  // http.request({
  //   host: '192.168.88.41',
  //   port: '7001',
  //   path: '/R' + pad(join, 4)
  // }, (response) => {
  //   var str = '';
  //   response.on('data', (chunk) => str += chunk);
  //   response.on('end', () => console.log(str));
  // }).end();

  fetch('http://192.168.88.41:7001/R' + pad(join, 4))
      .then(res => res.text())
      .then(body => console.log(body));

}

console.log("analog");
aread(1);
