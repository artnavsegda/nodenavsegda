var MongoClient = require('mongodb').MongoClient('mongodb://localhost:27017');

MongoClient.connect((err,db) => {
	if (err) throw err;
  console.log("Connected successfully to server");
	db.close();
  MongoClient.close();
});
