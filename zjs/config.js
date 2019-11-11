const fs = require('fs');

exports.configpath = configpath;
exports.readconfig = readconfig;
exports.config = config;

var configpath = "/etc/zenith/zenith.json";
var config;

function readconfig() {
  config = JSON.parse(fs.readFileSync(configpath, 'utf8'));
  if (!config.schemapath)
    config.schemapath = "/etc/zenith/schema"
  console.log(config.schemapath);
}

