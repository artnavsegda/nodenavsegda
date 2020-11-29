const readline = require('readline');
const redux = require('redux');
const fetch = require('node-fetch');

function counterReducer(state = { value: 0 }, action) {
    switch (action.type) {
      case 'counter/incremented':
        return { value: state.value + 1 }
      case 'counter/decremented':
        return { value: state.value - 1 }
      default:
        return state
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
  switch (line.trim()) {
    case 'inc':
        store.dispatch({ type: 'counter/incremented' })
    break;
    case 'dec':
        store.dispatch({ type: 'counter/decremented' })
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