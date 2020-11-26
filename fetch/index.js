const fetch = require('node-fetch');

const api = 'https://app.tseh85.com/DemoService/api';

const auth = api + '/AuthenticateVending';

console.log(auth);

/*
const { Headers } = require('node-fetch');

let authHeader = new Headers({'Authorization':'Bearer eyJhcGlfa2V5IjoiNzVkMzc3N2M3NWFhM2QwOTkxOWEyZTI4ZjhiM2M1YTkifQ=='})

fetch('https://api.simplecast.com/podcasts/', {headers: authHeader})
    .then(res => res.text())
    .then(body => console.log(body));
 */