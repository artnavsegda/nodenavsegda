const { exec, spawn, execFileSync } = require('child_process');

exports.acquire = acquire;
exports.acquireall = acquireall;

function acquire(proto)
{
  //console.log(proto.schema.acquire.shell)
  //console.log(proto.schema.acquire.args)
  //console.log(String(execFileSync(proto.schema.acquire.shell, proto.schema.acquire.args)));
  //console.log(JSON.parse(execFileSync(proto.schema.acquire.shell, proto.schema.acquire.args)));
  proto.data = JSON.parse(execFileSync(proto.schema.acquire.shell, proto.schema.acquire.args));
  //console.log(proto);
}

function acquireall(directory)
{
  for (var key in directory)
  {
    console.log(key);
    acquire(directory[key]);
  }
}
