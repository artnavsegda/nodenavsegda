const fs = require('fs');

exports.loadeveryschema = loadeveryschema;

function loadeveryschema(root, schemapath)
{
  console.log("load every schema form " + schemapath);
  console.log(fs.readdirSync('./schema'));
}

