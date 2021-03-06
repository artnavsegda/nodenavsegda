const readline = require('readline');
const rl = require('./main.js');
const builtin = require('./builtin.js');

exports.interpret = interpret;

function execute(argc, argv)
{
  console.log("exec");
  console.log(argv[0]);
  if (builtin.isbuiltin(argv[0]) == true)
  {
    console.log("builtin");
    builtin.builtin(argc,argv);
  }
}

function interpret (line) {
  var argv = line.split(" ");
  var argc = argv.length;
  console.log(argv);
  console.log(argc);
  execute(argc, argv);
  // switch (line.trim()) {
  //   case 'hello':
  //     console.log('world!');
  //     break;
  //   case 'config':
  //     config.readconfig();
  //     console.log(config.configpath);
  //     break;
  //   default:
  //     console.log(`Say what? I might have heard '${line.trim()}'`);
  //     break;
  // }
  rl.rl.prompt();
}
