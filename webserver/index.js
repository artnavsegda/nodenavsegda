const express = require('express')
const multer  = require('multer')
const app = express()
const upload = multer({ dest: 'uploads/' })
app.use(express.json())
const port = 3000

var dictionary = ["hi","hello","cat", "dog", "car", "bird", "danger", "love", "computer"];

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/q', (req, res) => {
  console.log("query " + req.query.ask);
  res.send(dictionary.filter((element) => element.startsWith(req.query.ask)));
})

app.post('/upload', upload.single('image'), function (req, res) {
  res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500">`);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
