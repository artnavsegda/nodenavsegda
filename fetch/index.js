const fetch = require('node-fetch');

const api = 'https://app.tseh85.com/DemoService/api';

const auth = api + '/AuthenticateVending';

const machines = api + '/vending/machines'

/* fetch(machines)
  .then(response => response.text())
  .then(text => console.log(text)) */


const payload = {
    "Login": "vender1",
    "Password": "1",
}

fetch(auth, {
    method: 'POST',
    headers: {
        'Content-Type': 'text/json'
    },
    body: JSON.stringify(payload)
})
  .then(response => {
    console.log("Token: " + response.headers.get('token'));
    return response.text();
  })
  .then(text => console.log(text+"!!!!"))