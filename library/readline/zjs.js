const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: 'OHAI> ' });

rl.prompt();

function interpret(line)
{
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
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

rl.on('line', interpret).on('close', shutdown);

