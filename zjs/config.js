const fs = require('fs');

exports.configpath = configpath;
exports.readconfig = readconfig;
exports.configjson = configjson;

var configpath = "/etc/zenith/zenith.json";
var configjson;

function readconfig() {
  configjson = JSON.parse(fs.readFileSync(configpath, 'utf8'));
  if (!configjson.schemapath)
    configjson.schemapath = "/etc/zenith/schema"
}




