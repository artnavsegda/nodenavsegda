exports.acquire = acquire;
exports.acquireall = acquireall;

function acquire(proto)
{
  //console.log(proto);
  console.log(proto.schema.acquire.shell)
  console.log(proto.schema.acquire.args)
}

function acquireall(directory)
{
  for (var key in directory)
  {
    console.log(key);
    acquire(directory[key]);
  }
}
