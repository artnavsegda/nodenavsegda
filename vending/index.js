const readline = require('readline');
const redux = require('redux');
const fetch = require('node-fetch');

const api = 'https://app.tseh85.com/DemoService/api';
const auth = api + '/AuthenticateVending'



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
      fetch(auth, {
          method: 'POST',
          headers: { 'Content-Type': 'text/json' },
          body: JSON.stringify(payload)
      })
      .then(response => {
        let token = response.headers.get('token');
        store.dispatch({ type: 'SIGN_IN', token: token });
        return response.json();
      })
      .then(json => {
        store.dispatch({ type: 'USER_NAME', username: json.Name });
      })
    break;
    case 'signout':
      store.dispatch({ type: 'SIGN_OUT' })
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