const { exec } = require('child_process');

exec("ls", function (err, stdout, stderr) {
  console.log(stdout);
});

