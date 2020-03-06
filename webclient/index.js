const request = require('request');

// console.log("!GET!");
//
// request({
//   url: 'http://localhost:3000/status',
//   method: 'GET',
//   json: true
// }, function (error, response, body) {
//   console.error('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
//   console.log('currentState:', body.currentState);
// });

console.log("!POST!");

request({
  url: 'http://localhost:3000/command',
  body: {'targetState': 'true'},
  method: 'POST',
  json: true,
  headers: {'Content-type': 'application/json'}
}, function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
