const fs = require('fs');

function errcall(err)
{
	if (err) throw err;
}

fs.writeFile('test.txt', "hello world", errcall);

