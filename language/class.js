class myclass
{
	constructor(parameter)
	{
		console.log("Class created with " + parameter);
		this.i = 10;
	}
	printi()
	{
		console.log(this.i);
	}
}

class otherclass extends myclass
{
	constructor()
	{
		super(321);
		this.y = 20;
	}
	printy()
	{
		console.log(this.y);
		console.log(this.i);
	}
}

myobj = new myclass(123);
myobj.i = 20;
myobj.printi();
myobj2 = new otherclass();
myobj2.i = 20;
myobj2.printi();
myobj2.y = 30;
myobj2.printy();
