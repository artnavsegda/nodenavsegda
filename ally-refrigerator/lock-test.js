const Gpio = require('onoff').Gpio;

const DOOR_LOCK_GPIO = process.env.DOOR_LOCK_GPIO;
const DOOR_UNLOCK_GPIO = process.env.DOOR_UNLOCK_GPIO;

const doorLockPin = new Gpio(DOOR_LOCK_GPIO, 'out');
const doorUnlockPin = new Gpio(DOOR_UNLOCK_GPIO, 'out');

const delay = ms => new Promise(res => setTimeout(res, ms));

// async function lockDoor() {
//   console.log('LOCK DOOR')
//   doorLockPin.writeSync(1);
//   doorUnlockPin.writeSync(1);

//   await delay(1000);
//   doorLockPin.writeSync(0);
//   doorUnlockPin.writeSync(0);
// }

// async function unlockDoor() {
//   console.log('UNLOCK DOOR')
//   doorUnlockPin.writeSync(1);
//   await delay(1000);
//   doorUnlockPin.writeSync(0);
// }


async function test(params) {
  console.log('ALL OFF')
  doorUnlockPin.writeSync(0);
  doorLockPin.writeSync(0);

  delay(1000)

  console.log('UNLOCK')
  doorUnlockPin.writeSync(1);
  doorLockPin.writeSync(0);

  delay(1000)
  doorUnlockPin.writeSync(0);

  delay(1000)
  console.log('LOCK')
  doorUnlockPin.writeSync(1);
  doorLockPin.writeSync(1);

  delay(1000)
  console.log('ALL OFF')
  doorUnlockPin.writeSync(0);
  doorLockPin.writeSync(0);
}
