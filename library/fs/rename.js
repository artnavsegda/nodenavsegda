const fs = require('fs');

function errcall(err)
{
	if (err) throw err;
}

fs.rename('test.txt', 'test2.txt', errcall);

