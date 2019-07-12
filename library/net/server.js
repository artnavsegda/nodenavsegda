var net = require('net');

function listener(socket)
{
	
}

var server = net.createServer(listener);

server.listen(8888, '127.0.0.1');

