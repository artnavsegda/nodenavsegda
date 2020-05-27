var test_schema = {
  hidden: false,
  modificator: [
    {
      if: [{one: "raz"}],
      then: {hidden: true}
    }
  ]
}

var test_data = {
  one: "raz"
}

function testschema(schema, data)
{
  var valid = true;
  var element;

  for (condition of schema.modificator)
  {
    for (element of condition.if)
    {
      console.log(element);
      console.log(data);

      if (element == data) {
        console.log("match");
        valid = true;
      } else {
        console.log("not match");
        valid = false;
        break;
      }
    }
  }
  return valid;
}

if (testschema(test_schema, test_data)){
  console.log("valid");
} else {
  console.log("invalid");
}




////////////////





var subject_element = {
  one: "raz",
  two: "dva"
}

var test_element = {
  one: "raz",
  two: "dva",
  two: "three"
}

function testsubject(subject, test)
{
  var valid = true;
  var element;
  for (element of Object.getOwnPropertyNames(test))
  {
    if (test[element] == subject[element]){
      valid = true;
    } else {
      valid = false;
      break;
    }
  }
  return valid;
}
