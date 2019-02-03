const express = require('express')
const path = require('path')
const querystring = require('querystring');
const https = require('https');
const PORT = process.env.PORT || 5000

var MongoClient = require('mongodb').MongoClient;

function httpsget(address, callback) {
	let data = '';
	https.get(address, (res) => {
		res.on('data', (chunk) => {
			data += chunk;
		});
		res.on('end', () => {
			typeof callback === 'function' && callback (data);
	  });
	}).on('error', (e) => {
		console.error(e);
	});
}

function vkAPIcall(method, parameters, vk_callback)
{
	httpsget("https://api.vk.com/method/" + method + "?" + querystring.stringify(parameters), vk_callback);
}

function sendVKmessage(usertosend, messagetosend, my_access_token)
{
	vkAPIcall("messages.send", {access_token: my_access_token, v: 5.92, user_id: usertosend, random_id: Math.random() * 123456789, message: messagetosend});
}

function mongouse(callback)
{
	MongoClient.connect('mongodb://artnavsegda:dep7k36c@ds129051.mlab.com:29051/artnavsegda', function (err, client) {
//	MongoClient.connect('mongodb://localhost:27017', function (err, client) {
		if (err) throw err;
		var db = client.db('artnavsegda');
		callback(db);
	})
}

express()
	.use(express.static(path.join(__dirname, 'public')))
	.get('/hello', (req, res) => {
		mongouse((db) => {
			db.collection('blog').find({}).toArray((err,query) => {
				if (err) throw err;
				res.send(query);
			});
		});
	})
	.get('/clear', (req, res) => {
		mongouse((db) => {
			db.collection('blog').deleteOne({ name: req.query.browser}, (err,resource) => {
				if (err) throw err;
				res.send("success");
			});
		});
	})
	.get('/append', (req, res) => {
		mongouse((db) => {
			db.collection('blog').insertOne({ name: req.query.browser}, (err,resource) => {
				if (err) throw err;
				res.send("success");
			});
		});
	})
	.get('/sendvkmessage', (req, res) => {
		sendVKmessage(185014513, req.query.message, req.query.browser);
		res.send("success");
	})
	.listen(PORT, () => console.log(`Listening on ${ PORT }`))
