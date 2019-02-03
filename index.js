//var mongo = require('mongodb').MongoClient('mongodb://localhost:27017');
const mongo = require('mongodb').MongoClient('mongodb://artnavsegda:dep7k36c@ds129051.mlab.com:29051/artnavsegda');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000



express()
	.use(express.static(path.join(__dirname, 'public')))
	.get('/hello', (req, res) => {
		mongo.connect((err) => {
			if (err) throw err;
			const db = mongo.db('artnavsegda');
			db.collection('blog').find({}).toArray((err,query) => {
				if (err) throw err;
				res.send(query);
			});
		});
	})
	.get('/clear', (req, res) => {
		mongo.connect((err) => {
			if (err) throw err;
			const db = mongo.db('artnavsegda');
			db.collection('blog').deleteOne({ name: req.query.browser}, (err,resource) => {
				if (err) throw err;
				res.send("success");
			});
		});
	})
	.listen(PORT, () => console.log(`Listening on ${ PORT }`))
