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

myobj = new myclass();
myobj.i = 20;
myobj.printi();

