//var MongoClient = require('mongodb').MongoClient('mongodb://localhost:27017');
var MongoClient = require('mongodb').MongoClient('mongodb://artnavsegda:dep7k36c@ds129051.mlab.com:29051/artnavsegda');

MongoClient.connect((err) => {
	if (err) throw err;
	const db = MongoClient.db('artnavsegda');
	db.collection('blog').find({}).toArray((err,res) => {
		if (err) throw err;
		console.log(res);
		MongoClient.close();
	});
});
