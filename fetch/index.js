const fetch = require('node-fetch');

fetch('http://192.168.88.41:7001/R0001')
    .then(res => res.text())
    .then(body => console.log(body));
