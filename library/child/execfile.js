const { execFile } = require('child_process');

execFile("/bin/ls", ['-lh', '/usr'], function (err, stdout, stderr) {
  console.log(stdout);
});
