const fs = require('fs');

function errcall(err)
{
	if (err) throw err;
}

fs.unlink('test2.txt', errcall);

