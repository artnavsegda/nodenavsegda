var MongoClient = require('mongodb').MongoClient('mongodb://localhost:27017');

MongoClient.connect((err) => {
	if (err) throw err;
	const db = MongoClient.db('test');
	db.collection('blog').find({}).toArray((err,res) => {
		if (err) throw err;
		console.log(res);
		MongoClient.close();
	});
});
