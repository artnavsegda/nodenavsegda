
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

app.get('/section', (req, res) => {
  fs.readdir('/EFF_charts_2202/' + req.query.airport + '/' + req.query.sec, (err, files) => {
    let titles = (files || ['']).map(e => e.split('.')[0]);
    let uniqTitles = new Set(titles);
    console.log([...uniqTitles]);
    res.send([...uniqTitles]);
  });
})

app.get('/file', (req, res) => {
  res.sendFile(req.query.name);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})