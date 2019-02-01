//var MongoClient = require('mongodb').MongoClient('mongodb://localhost:27017');
var MongoClient = require('mongodb').MongoClient('mongodb://artnavsegda:dep7k36c@ds129051.mlab.com:29051/artnavsegda');

MongoClient.connect((err) => {
	if (err) throw err;
	console.log("Connected successfully to server");
	const db = MongoClient.db('artnavsegda');
	db.collection('blog').deleteOne({ name: "hello"}, (err,res) => {
		if (err) throw err;
		console.log("1 document deleted");
		MongoClient.close();
	});
});
