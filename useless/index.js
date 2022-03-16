
const express = require('express')
const fs = require('fs');
const path = require('path');
const app = express()
const port = 3000

app.get('/', (req, res) => {
  fs.readdir('/EFF_charts_2202/', (err, files) => {
    console.log(files);
    res.send(files);
  });
})

app.get('/file', (req, res) => {
  var options = {
    root: path.join(__dirname)
  };
  
  var fileName = 'Hello.txt';

  res.sendFile(fileName, options, function (err) {
    if (err) {
        next(err);
    } else {
        console.log('Sent:', fileName);
    }
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})