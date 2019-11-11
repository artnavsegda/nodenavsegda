exports.loadeveryschema = loadeveryschema;

function loadeveryschema(root, schemapath)
{
  console.log("load every schema");
}

const fs = require('fs');

console.log(fs.readdirSync('./schema'));

