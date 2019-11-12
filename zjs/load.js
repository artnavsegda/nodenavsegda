const fs = require('fs');

exports.loadeveryschema = loadeveryschema;

function loadeveryschema(root, schemapath)
{
  console.log("load every schema form " + schemapath);
  //console.log(fs.readdirSync(schemapath));
  fs.readdirSync(schemapath).forEach(function (item, index) {
      var stats = fs.statSync(schemapath + "/" + item);
      //console.log(stats);
      //console.log(schemapath + "/" + item);
      //console.log(stats.isDirectory());
      if (!stats.isDirectory())
      {
        var schema = {schema:{},data:{}};
        schema.schema = JSON.parse(fs.readFileSync(schemapath + "/" + item, 'utf8'));
        //console.log(schema.title);
        root[schema.schema.title] = schema;
      }
    }
  )
}


