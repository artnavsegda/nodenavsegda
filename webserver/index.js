const express = require('express')
const app = express()
app.use(express.json())
const port = 3000

var dictionary = ["hi","hello","cat", "dog"];

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/q', (req, res) => {
  console.log("query " + req.query.ask);
  res.send(dictionary);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
