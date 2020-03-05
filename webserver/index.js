const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/status', (req, res) => {res.send('status')})

app.get('/command', (req, res) => {
  console.log("executing");
  res.send('complete');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
