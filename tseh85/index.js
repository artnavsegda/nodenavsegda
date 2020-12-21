const readline = require('readline');
const redux = require('redux');
const fetch = require('node-fetch');

const API_PATH = 'https://app.tseh85.com/DemoService/api';

const api = {
  auth: API_PATH + '/AuthenticateVending',
  machines: API_PATH + '/vending/machines',
  openlock: API_PATH + '/vending/openlock',
  status: API_PATH + '/vending/status',
  invoice: API_PATH + '/vending/invoice',
  service: API_PATH + '/vending/service',
  products: API_PATH + '/vending/products'
}

function reducer(prevState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  userName: "",
}, action) {
  switch (action.type) {
    case 'USER_NAME':
      return {
        ...prevState,
        userName: action.username,
      };
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        userToken: action.token,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
      };
    default:
      return prevState;
  }
}

let store = redux.createStore(reducer)

store.subscribe(() => console.log(store.getState()))

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> '
});

rl.prompt();

rl.on('line', (line) => {
  let args = line.split(" ");

  switch (args[0]) {
    case 'signin':
      let payload = {
        "Login": args[1],
        "Password": args[2],
      }
      fetch(api.auth, {
          method: 'POST',
          headers: { 'Content-Type': 'text/json' },
          body: JSON.stringify(payload)
      })
      .then(response => {
        if (!response.ok)
          throw new Error('Login incorrect');
        store.dispatch({ type: 'SIGN_IN', token: response.headers.get('token') });
        return response.json();
      })
      .then(json => {
        store.dispatch({ type: 'USER_NAME', username: json.Name });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    break;
    case 'signout':
      store.dispatch({ type: 'SIGN_OUT' })
    break;
    case 'machines':
      fetch(api.machines, {headers: { token: store.getState().userToken }})
      .then(response => response.text())
      .then(text => console.log(text)) 
    break;
    case 'receipt':
      fetch(api.invoice + '?' + new URLSearchParams({ Type: 0 }), {headers: { token: store.getState().userToken }})
      .then(response => response.text())
      .then(text => console.log(text)) 
    break;
    case 'writeoff':
      fetch(api.invoice + '?' + new URLSearchParams({ Type: 1 }), {headers: { token: store.getState().userToken }})
      .then(response => response.text())
      .then(text => console.log(text)) 
    break;
    case 'openlock':
      fetch(api.openlock + '?' + new URLSearchParams({ MachineGUID: args[1] }), {headers: { token: store.getState().userToken }})
      .then(response => response.text())
      .then(text => console.log(text)) 
    break;
    case 'products':
      fetch(api.products + '?' + new URLSearchParams({ MachineGUID: args[1] }), {headers: { token: store.getState().userToken }})
      .then(response => response.text())
      .then(text => console.log(text)) 
    break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
    break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});