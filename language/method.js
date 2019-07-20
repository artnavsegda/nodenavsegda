let myobj = {
	i:10, 
	mystr:"hello",
	printsome: function()
	{
		console.log(this.mystr + this.i);
	}
};
console.log(myobj.i);
console.log(myobj.mystr);
myobj.printsome();
