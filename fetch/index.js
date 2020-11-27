const fetch = require('node-fetch');

const api = 'https://app.tseh85.com/DemoService/api';

const auth = api + '/AuthenticateVending';

const machines = api + '/vending/machines'

/* fetch(machines)
  .then(response => response.text())
  .then(text => console.log(text)) */


const payload = {
    "Login": "sample string 1",
}

fetch(auth, {
    method: 'POST',
    headers: {
        'Content-Type': 'text/json'
    },
    body: JSON.stringify(payload)
})
  .then(response => response.text())
  .then(text => console.log(text+"!!!!"))