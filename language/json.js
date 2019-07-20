let myobj = {
	i:10, 
	mystr:"hello"
};
console.log(myobj);
let mystr = JSON.stringify(myobj);
console.log(mystr);
let myobj2 = JSON.parse(mystr);
console.log(myobj2);
