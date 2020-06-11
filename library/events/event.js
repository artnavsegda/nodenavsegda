var events = require('events');
var eventEmitter = new events.EventEmitter();

//Create an event handler:
var myEventHandler = function () {
  console.log('I hear a scream!');
}

//Assign the event handler to an event:
eventEmitter.on('scream', myEventHandler);

//Assign another event handler to an event:
eventEmitter.on('scream', () => {console.log('I hear a scream too!')});

//Fire the 'scream' event:
eventEmitter.emit('scream');
