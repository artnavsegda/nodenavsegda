class myclass
{
	constructor()
	{
		console.log("Class created");
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
		super();
		this.y = 20;
	}
	printy()
	{
		console.log(this.y);
		console.log(this.i);
	}
}

myobj = new myclass();
myobj.i = 20;
myobj.printi();
myobj2 = new otherclass();
myobj2.i = 20;
myobj2.printi();
myobj2.y = 30;
myobj2.printy();
