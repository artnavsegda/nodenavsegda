const readline = require('readline');
const config = require('./config.js');
const completer = require('./completer.js');
const interpreter = require('./interpreter.js');

const rl = readline.createInterface(
{ input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> ',
  completer: completer.complete
});

exports.rl = rl;

rl.on('line', interpreter.interpret);
rl.on('close', shutdown);

config.readconfig();
rl.prompt();

function shutdown()
{
  console.log('Have a great day!');
  process.exit(0);
}


