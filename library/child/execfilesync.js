const { execFileSync } = require('child_process');

console.log(String(execFileSync("/bin/ls", ['-lh', '/usr'])));
