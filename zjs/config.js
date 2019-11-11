const fs = require('fs');

exports.configpath = configpath;
exports.schemapath = schemapath;
exports.readconfig = readconfig;

function readconfig() {
  console.log("ha ha");
//  console.log(fs.readFileSync('test2.txt', 'utf8'));
}

var configpath = "/config/path";

var schemapath;


