const readline = require('readline');
const rl = require('./zjs.js');

exports.interpret = interpret;

function interpret (line) {
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
  rl.rl.prompt();
}

