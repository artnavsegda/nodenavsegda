const request = require('request');
const net = require('net');

setTimeout(function() {
  request({
    url: 'http://localhost:3000/status',
    method: 'GET',
    json: true
  }, function (error, response, body) {
    console.log("!GET!");
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    console.log('currentState:', body.currentState);
  });
}, 500);

setTimeout(function() {
  request({
    url: 'http://localhost:3000/command',
    body: {currentState: true},
    method: 'POST',
    json: true,
    headers: {'Content-type': 'application/json'}
  }, function (error, response, body) {
    console.log("!POST!");
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
  });
}, 1000);

setTimeout(function() {
  request({
    url: 'http://localhost:3000/status',
    method: 'GET',
    json: true
  }, function (error, response, body) {
    console.log("!GET!");
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    console.log('currentState:', body.currentState);
  });
}, 1500);

const client = net.createConnection(8888, () => {
  console.log('connected to server!');
  client.write('world!\r\n');
});

client.on('data', (data) => {
  console.log(data.toString());
  //client.end();
});

client.on('end', () => {
  console.log('disconnected from server');
});
