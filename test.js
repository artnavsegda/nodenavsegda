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

if (testsubject(subject_element, test_element)){
  console.log("valid");
} else {
  console.log("invalid");
}
