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


function condProcess(cond) {
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

        let o = this.values[k]?this.values[k]:''
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

let ss = undefined;

refProcess(ss)

if(ss["modificator"] !== undefined) {
  // {"modificator": [{"if": [{...}], "then": {...} }, {"if": [{...}], "then": {...} }]
  let i = this.condProcess(ss["modificator"])
  if(i !== -1){
    Object.assign(ss, ss["modificator"][i]["then"])
    this.refProcess(ss)
  }
}
