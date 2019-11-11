const fs = require('fs');

exports.loadeveryschema = loadeveryschema;

function loadeveryschema(root, schemapath)
{
  console.log("load every schema form " + schemapath);
  console.log(fs.readdirSync(schemapath));
  var stats = fs.statSync(schemapath);
  console.log(stats);
  console.log(stats.isDirectory());
}


