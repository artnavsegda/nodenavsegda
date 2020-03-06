const express = require('express')
const app = express()
app.use(express.json())
const port = 3000

var state = false;

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/status', (req, res) => {res.send({currentState: true})})

app.post('/command', (req, res) => {
  console.log("executing");
  console.log(req.body);
  res.send('complete');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
