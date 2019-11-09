const fs = require('fs');

stats = fs.statSync('./');
console.log(stats);
console.log(stats.isDirectory());

