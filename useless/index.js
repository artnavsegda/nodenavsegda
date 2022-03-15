
const express = require('express')
const fs = require('fs');
const app = express()
const port = 3000

app.get('/', (req, res) => {
  fs.readdir('./', (err, files) => {
    res.send(files);
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})