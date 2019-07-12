function mycallback()
{
	console.log('This is callback');
}

function myfunction(somecallback)
{
	somecallback();
}

myfunction(mycallback);

