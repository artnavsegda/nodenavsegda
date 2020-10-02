const myobject = {
    lamp1: {on: true},
    lamp2: {on: false},
    lamp3: {on: true, brightness: 100}
}

//console.log(JSON.stringify(myobject));

//for (const [key, value] of Object.entries(myobject)) {
    //console.log(`${key}: ${value}`);
//}

console.log(JSON.stringify(Object.entries(myobject).map((what) => {
    what[1].ID = what[0];
    return what[1];
})));