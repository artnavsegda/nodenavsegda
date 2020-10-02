const myobject = {
    lamp1: {on: true},
    lamp2: {on: false},
    lamp3: {on: true, brightness: 100}
}



//for (const [key, value] of Object.entries(myobject)) {
    //console.log(`${key}: ${value}`);
//}

console.log(JSON.stringify(Object.entries(myobject).map((what) => {
    let some = {...what[1]}
    some.ID = what[0];
    return some;
})));

console.log(JSON.stringify(myobject));