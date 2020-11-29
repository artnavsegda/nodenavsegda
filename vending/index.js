const readline = require('readline');
const redux = require('redux');
const fetch = require('node-fetch');

function counterReducer(prevState = {isLoading: true, isSignout: false, userToken: null}, action) {
  switch (action.type) {
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

let store = redux.createStore(counterReducer)

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
      store.dispatch({ type: 'SIGN_IN', token: args[1] });
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