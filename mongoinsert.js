var MongoClient = require('mongodb').MongoClient('mongodb://localhost:27017');

MongoClient.connect((err,db) => {
	if (err) throw err;
	console.log("Connected successfully to server");
	db.db('test').collection('blog').insert({ name: "hello"}, (err,res) => {
		if (err) throw err;
		console.log("1 document inserted");
		db.close();
	});
	MongoClient.close();
});
