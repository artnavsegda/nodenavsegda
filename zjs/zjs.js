const readline = require('readline');
const config = require('./config.js');

const rl = readline.createInterface(
{ input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> ',
  completer: completer
});

function completer(line) {
  const completions = 'help error exit quit q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : completions, line];
}

rl.prompt();

function interpret(line)
{
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    case 'config':
      config.readconfig();
      console.log(config.configpath);
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}

function shutdown()
{
  console.log('Have a great day!');
  process.exit(0);
}

rl.on('line', interpret);
rl.on('close', shutdown);
