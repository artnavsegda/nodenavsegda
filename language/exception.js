function myfunc2(number)
{
	if (number == 34)
	{
		throw "Number if thirty four";
	}
	console.log(number);
}

function myfunc(number)
{
	try
	{
		myfunc2(number);
	}
	catch (msg)
	{
		console.log(msg);
	}
}

myfunc(22);
myfunc(34);

