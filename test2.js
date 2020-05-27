function refProcess(ss) {
      if(ss["$ref"] === undefined)
        return
      let ref_str
      let ref
      ref_str = ss["$ref"]
      ref_str = ref_str.split("#")
      // TODO: get definitions from external store ref_str[0]
      ref_str = ref_str[1].split("/").filter((v) => {
        return (v)? true :false
      })
      delete ss["$ref"]
      ref = refProperty(this.definitions, ref_str)
      if(ref !== undefined)
        Object.assign(ss, ref)
}


function condProcess(cond, values) {
  // return passed condition index
  let i, j, n, c, res
  for(i=0;i<cond.length;i++){
    res = 0
    c = 1
    for(j=0;j<cond[i]["if"].length;j++){
      let keys = Object.keys(cond[i]["if"][j])
      for(n=0;n<keys.length;n++){
        let k = keys[n]
        let v = String(cond[i]["if"][j][k])
        let x
        if(["!"].indexOf( v.substr(0,1)) !== -1){
          x = v.substr(0, 1)
          v = v.substr(1, v.length)
        }

        let o = values[k]?values[k]:''
        switch(x){
          case "!":
            c &= Boolean(String(o) !== String(v))
            break
          default:
            c &= Boolean(String(o) === String(v))
            break
        }
        // console.log('cond:', this.property_name, '|', k, x, v, '][', c)
      }
    }
    res |= c
    // console.log('cond:', this.property_name, '|', Boolean(res))
    if(Boolean(res) === true)
      return i
  }
  return -1
}

//let ss = Object.assign({}, this.schema)

fs = require('fs')
fs.readFile('./test.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  main(data);
});

var my_values = {
  proto: "pppoe"
}

function main(data)
{
  console.log(data);

  let ss = JSON.parse(data);

  if(ss["modificator"] !== undefined) {
    let i = condProcess(ss["modificator"], my_values)
    console.log(i);
    if(i !== -1){
      Object.assign(ss, ss["modificator"][i]["then"])
    }
    console.log(ss);


    //tak
  }
}
