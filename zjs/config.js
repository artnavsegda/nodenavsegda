const fs = require('fs');

var configpath = "/etc/zenith/zenithjs.json";
var config;

exports.configpath = configpath;
exports.readconfig = readconfig;

function readconfig() {
  config = JSON.parse(fs.readFileSync(configpath, 'utf8'));
  if (!config.schemapath)
    config.schemapath = "/etc/zenith/schema"
  console.log(config.schemapath);
  exports.config = config;
}

