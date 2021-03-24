const fetch = require('node-fetch');


const API_PATH = 'https://app.tseh85.com/DemoService/api';

const api = {
  auth: API_PATH + '/AuthenticateVending',
  machines: API_PATH + '/vending/machines',
  invoice: API_PATH + '/vending/invoice'
}

fetch(api.machines, {headers: { token: 'EQdfJsZj412lHDX/rf9rbvspCIPdQA9iAEid95io4yCNSjlDqRIC65gCm6+5cpGs' }})
  .then(response => {
    if (response.ok)
      return response.text()
    else
      throw new Error('Network response was not ok');
  })
  .then(text => console.log(text))
  .catch(error => {
    console.log('There has been a problem with your fetch operation');
  });


/* fetch(api.invoice + '?' + new URLSearchParams({ Type: 0 }), {headers: { token: 'EQdfJsZj412lHDX/rf9rbvspCIPdQA9iAEid95io4yCNSjlDqRIC65gCm6+5cpGs' }})
  .then(response => response.text())
  .then(text => console.log(text)) */


const payload = {
    "Login": "vender1",
    "Password": "1",
}

/* fetch(api.auth, {
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
  .then(text => console.log(text+"!!!!")) */