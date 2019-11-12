exports.acquire = acquire;
exports.acquireall = acquireall;

function acquire(proto)
{
  console.log(proto);
}

function acquireall(directory)
{
  for (var key in directory)
  {
    console.log(key);
    acquire(directory[key]);
  }
}
