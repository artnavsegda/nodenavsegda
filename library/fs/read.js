const fs = require('fs');

function readcall(err, data)
{
	if (err) throw err;
	console.log(data);
}

fs.readFile('test2.txt', 'utf8', readcall);

