const readline = require('readline');
const config = require('./config.js');
const completion = require('./completion.js');
const interpreter = require('./interpreter.js');
const load = require('./load.js');
const acquire = require('./acquire.js');
const rl = readline.createInterface(
{ input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> ',
  completer: completion.complete
});
var root = {};
exports.rl = rl;

rl.on('line', interpreter.interpret);
rl.on('close', shutdown);

config.readconfig();
//console.log(config);
load.loadeveryschema(root, config.config.schemapath);
acquire.acquireall(root);
console.log(root);
rl.prompt();

function shutdown()
{
  console.log('Have a great day!');
  process.exit(0);
}
