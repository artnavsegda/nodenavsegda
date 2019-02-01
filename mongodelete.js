var MongoClient = require('mongodb').MongoClient('mongodb://localhost:27017');

MongoClient.connect((err) => {
	if (err) throw err;
	console.log("Connected successfully to server");
	const db = MongoClient.db('test');
	db.collection('blog').deleteOne({ name: "hello"}, (err,res) => {
		if (err) throw err;
		console.log("1 document deleted");
		MongoClient.close();
	});
});
