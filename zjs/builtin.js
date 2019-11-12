exports.builtin = builtin;
exports.isbuiltin = isbuiltin;

function commandlist(argc, argv)
{
  console.log("here will be halp");
}

function builtin(argc, argv)
{
  switch (argv[0])
  {
    case "?":
      return commandlist(argc,argv);
    break;
  }
  return false;
}

function isbuiltin(builtinname)
{
  console.log("is builtin?");
  if (builtinname == "?")
  {
    console.log("yes");
    return true;
  }
  else {
    console.log("no");
    return false;
  }
}
