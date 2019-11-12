let myobj = new Object();
myobj = {
	i:10, 
	mystr:"hello"
};
console.log(myobj.i);
console.log(myobj.mystr);
console.log(myobj);
Object.assign(myobj,{a:1,b:2});
console.log(myobj);

