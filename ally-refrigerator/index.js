require('dotenv').config()
const fs = require('fs');
const capturePhoto = require('./camera');
const mqttLib = require('mqtt');
const Gpio = require('onoff').Gpio;
const PiGpio = require('pigpio').Gpio;
const dns = require('dns');
const axios = require('axios');
const log = require('./logger').default;
const { AWS, awsParams, createAlbum } = require('./s3');
const packageJSON = require('./package.json');
/** INITIALIZATION */
const DOOR_SENSOR_GPIO = process.env.DOOR_SENSOR_GPIO;
const DOOR_LOCK_GPIO = process.env.DOOR_LOCK_GPIO;
const DOOR_UNLOCK_GPIO = process.env.DOOR_UNLOCK_GPIO;
const DOOR_PWM_GPIO = process.env.DOOR_PWM_GPIO;
const DOOR_TIMEOUT = process.env.DOOR_TIMEOUT || 60 * 1000; // дверь должна быть открыта не более 1 минуты
const PHOTOS_WEBHOOK_URL = process.env.PHOTOS_WEBHOOK_URL;
const STATE_WEBHOOK_URL = process.env.STATE_WEBHOOK_URL;
const ALERT_WEBHOOK_URL = process.env.ALERT_WEBHOOK_URL;
const WEBHOOK_TOKEN =  process.env.WEBHOOK_TOKEN;
const DEVICE_NAME = process.env.DEVICE_NAME;
const DEVICE_ID = process.env.DEVICE_ID;
const DEVICE_PASSWD = process.env.DEVICE_PASSWD;
const MQTT_URL = process.env.MQTT_URL;

if (!(DOOR_SENSOR_GPIO && DOOR_LOCK_GPIO && DOOR_UNLOCK_GPIO && DOOR_PWM_GPIO && WEBHOOK_TOKEN && PHOTOS_WEBHOOK_URL && STATE_WEBHOOK_URL && ALERT_WEBHOOK_URL && DEVICE_NAME && DEVICE_ID && DEVICE_PASSWD && MQTT_URL)) {
  log.error('Invalid configuration');
  process.exit(1);
}

const doorSensor = new Gpio(DOOR_SENSOR_GPIO, 'in',  'both', { debounceTimeout: 200 });
const doorLockPin = new Gpio(DOOR_LOCK_GPIO, 'out');
const doorUnlockPin = new Gpio(DOOR_UNLOCK_GPIO, 'out');
const doorPwmPin = new PiGpio(DOOR_PWM_GPIO, { mode: PiGpio.OUTPUT });

const topics = {
  EVENTS: `$devices/${DEVICE_ID}/events`,
  COMMANDS: `$devices/${DEVICE_ID}/commands`,
  STATE: `$devices/${DEVICE_ID}/state`
}

const mqttOptions = {
  clientId: DEVICE_NAME,
  rejectUnauthorized: false,
  username: DEVICE_ID,
  password: DEVICE_PASSWD,
  keepalive: 60 * 10, // https://github.com/mqttjs/MQTT.js/issues/880
  connectTimeout: 30000
  // "clean": true,
};

const commands = {
  OPEN: 'open',
  CLOSE: 'close',
  GET_STATE: 'get_state',
  MAKE_PHOTO: 'make_photo'
}

const deviceState = {
  door: 'closed',
  lock: 'locked'
};

let mqttClient;
let doorTimeout;
let currentClientId;
let isShuttingDown;
let server;

const delay = ms => new Promise(res => setTimeout(res, ms));

/**
 * Инициализация
 */
async function initialize() {
  try {
    await createAlbum(DEVICE_ID) // Создаем/проверяем альбом устройства в S3

    mqttClient  = mqttLib.connect(MQTT_URL, mqttOptions);

    mqttClient.on('connect', onConnect)
    mqttClient.on('message', onMessage)
    mqttClient.on('close', () => log.warn('MQTT connection closed'))
    mqttClient.on('offline', () => log.warn('MQTT client goes offline'))
    mqttClient.on('reconnect', () => log.warn('MQTT client reconnect'))
    mqttClient.on('error', log.error)

    log.debug('Lock door after boot')
    await lockDoor();

    // WATCH DOOR SENSOR
    doorSensor.watch(doorSensorHandler);
  } catch (e) {
    log.error(e)
    log.error('Initialization failed')
    process.exit(1)
  }
}

const callWebhook = (url, data) => {
  if (!WEBHOOK_TOKEN) return Promise.reject('WEBHOOK token is null');
  if (!url) return Promise.reject('WEBHOOK URL is null');
  if (!data) return Promise.reject('WEBHOOK data is null');

  return axios({
    url,
    method: 'post',
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'token': WEBHOOK_TOKEN
    },
  })
}

/**
 * Отправка сообщения в топик
 *
 * @param {String} topic
 * @param {Object} payload
 * @param {Object} options
 */
function sendMessage(topic, payload, options) {
  if (mqttClient) {
    mqttClient.publish(
      topic,
      payload ? JSON.stringify({...payload, timestamp: new Date().toISOString() }) : null,
      options,
      err => err && console.error('MQTT PUBLISH ERROR!', topic, err)
    );
  } else {
    throw new Error('MQTT client is not exist!');
  }
}

async function makePhotos(count, interval, state='remote') {
  log.debug('Making photos...');
  log.debug('Count: ' + count);
  log.debug('Interval: ' + interval);

  let photosPath = []

  for (let i = 0; i < count; i++) {
    const time = new Date().getTime();
    const location = `${ __dirname }/photos/`;
    const filename = `${time}_${DEVICE_ID}_${currentClientId || 'unknow'}_${state}_${i}.jpg`;

    try {
      // TODO: получать опции из MQTT?
      await capturePhoto(filename, {
        width: 1280,
        height: 1024,
        location,
        title: DEVICE_NAME,
        subtitle: `clientId: ${currentClientId}`,
        info: filename,
        // jpeg: 80,
        logo: true,
        banner: true,
        gmt: false
      })

      photosPath.push(location + filename)
      log.debug(`Captured: (${i + 1}/${count})`);
    } catch (e) {
      log.error(e)
      throw (e) // прокидываем ошибку дальше
    }

    // пауза между фото
    if (i < count - 1) {
      await (new Promise(res => setTimeout(res, interval * 1000)))
    }
  }

  photosPath.forEach(path => log.debug(path))

  return await Promise.all(photosPath.map(filePath => uploadPhotoToS3(DEVICE_ID, filePath)));
}

async function uploadPhotoToS3(albumName, filePath) {
  if (!filePath) {
    return log.debug("Please choose a filePath to upload first.");
  }
  log.debug('Uploading photo to S3...')

  var fileName = filePath.split('/');
  fileName = fileName[fileName.length - 1];

  var albumPhotosKey = encodeURIComponent(albumName) + "/";

  var photoKey = albumPhotosKey + fileName;

  // Use S3 ManagedUpload class as it supports multipart uploads
  var upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: awsParams.Bucket,
      Key: photoKey,
      Body: fs.readFileSync(filePath),
      ACL: "public-read"
    }
  });

  return upload.promise();
}

// FIXME: как теперь убедиться в состоянии замка при включении?
function getLockState() {
  return deviceState.lock;
}

function getDoorState() {
  let doorState = !doorSensor.readSync() ? 'opened' : 'closed';
  deviceState.door = doorState;
  return doorState;
}

async function lockDoor() {
  doorPwmPin.pwmWrite(200);
  doorLockPin.writeSync(1);
  deviceState.lock = 'locked';
  log.debug('Door locked');

  await delay(300);
  doorPwmPin.pwmWrite(0);
  doorLockPin.writeSync(0);
}

async function unlockDoor() {
  doorPwmPin.pwmWrite(255);
  doorUnlockPin.writeSync(1);
  deviceState.lock = 'unlocked'
	log.debug('Door unlocked')

  await delay(300);
  doorPwmPin.pwmWrite(0);
  doorUnlockPin.writeSync(0);
}

async function unlock() {
  const lockState = getLockState();

  log.debug('Initiator:' + currentClientId);

  if (lockState === 'locked') {
    unlockDoor();
    sendState();

    sendMessage(topics.EVENTS, {
      hardware: 'lock',
      state: 'unlocked',
    })

    // Запускаем таймер и ждем открытие двери?
    doorTimeout = setTimeout(async () => {
      const doorState = getDoorState();
      if (doorState === 'closed') {
        // Закрываем замок, т.к. дверь не
        // открыли за отведенное время
        lockDoor()

        log.warn('DOOR LOCKED BY TIMEOUT')

        sendState({
          status: 'online',
          lock: deviceState.lock,
          door: deviceState.door
        })

        sendMessage(topics.EVENTS, {
          hardware: 'lock',
          state: 'locked',
          error: 'DOOR LOCKED BY TIMEOUT'
        });

        const data = {
          "MachineGUID": DEVICE_ID,
          "Date": new Date().toISOString(),
          "Code": 1, // ?
          "Message": `Дверь не открыли за ${DOOR_TIMEOUT / 1000} cек.`
        }

        callWebhook(ALERT_WEBHOOK_URL, data)
          .catch(e => {
            log.error('ALERT_WEBHOOK_URL Error')
            log.error(e)
          })
      } else {
        // Дверь открыта больше DOOR_TIMEOUT !
        log.warn('Door is open too long!');

        sendState({
          status: 'online',
          lock: deviceState.lock,
          door: deviceState.door
        })

        const data = {
          "MachineGUID": DEVICE_ID,
          "Date": new Date().toISOString(),
          "Code": 1, // ?
          "Message": `Дверь открыта дольше чем ${DOOR_TIMEOUT / 1000} cек.`
        }

        callWebhook(ALERT_WEBHOOK_URL, data)
          .catch(e => {
            log.error('ALERT_WEBHOOK_URL Error')
            log.error(e)
          })

        sendMessage(topics.EVENTS, {
          alert: true,
          hardware: 'door',
          state: 'opened',
          error: 'Door timeout'
        });

        makePhotos(1,1,'alert').then(() => log.debug('Alert photo uploaded to S3.')).catch(log.error)
      }


    }, DOOR_TIMEOUT);
  } else {
    // Замок уже открыт!
    log.warn('LOCK IS ALREADY OPENED!');
    sendMessage(topics.EVENTS, {
      hardware: 'lock',
      state: 'unlocked',
      error: 'Lock is already unlocked'
    })
  }
}

function sendState(state, cb) {
  if (!state) {
    state = {
      status: 'online',
      lock: getLockState(),
      door: getDoorState()
    }
  }

  // Может не обновлять?
  // deviceState.lock = state.lock;
  // deviceState.door = state.door;

  log.debug(JSON.stringify(state));

  sendMessage(topics.STATE, state, { qos: 1 });

  const data = {
    "MachineGUID": DEVICE_ID,
    "Date": new Date().toISOString(),
    "Lock": state.lock === 'locked' ? 0 : 1, // тогда locked = 0 unlocked = 1
    "Door": state.door === 'opened' ? 1 : 0, // closed = 0 opened = 1
    "Temperature": state.temperature || 0,
    "Power": true
  }

  callWebhook(STATE_WEBHOOK_URL, data)
    .catch(e => {
      log.error('STATE_WEBHOOK_URL Error')
      log.error(e)

      // shutdown case
      if (cb) {
        cb(e)
      }
    })
    .finally(cb || (() => null))
}

async function makeRemotePhoto(options) {
  if (options) {
    // Check options
    if (options.count < 1 || options.count > 5) {
      log.warn('WARNING. Photos options:')
      log.warn('Count: ' + options.count)
      log.warn('Interval: ' + options.interval)
      sendMessage(topics.EVENTS, {
        hardware: 'camera',
        code: 1,
        error: 'Too many photos. Maximum 5'
      });
      return;
    }

    // Check options
    if (options.interval < 1 || options.interval > 10) {
      log.warn('WARNING. Photos options:')
      log.warn('Count: ' + options.count)
      log.warn('Interval: ' + options.interval)
      sendMessage(topics.EVENTS, {
        hardware: 'camera',
        code: 1,
        error: 'Invalid interval. It should be from 1 to 10 seconds'
      });
      return;
    }

    try {
      sendMessage(topics.EVENTS, {
        hardware: 'camera',
        code: 0,
        status: 'capturing'
      });
      makePhotos(options.count, options.interval).then(res => {
        log.debug('All photos uploaded to S3')
        log.debug(`Sending links to webhook ${PHOTOS_WEBHOOK_URL}`)
        console.log('res', res)

        const data = res.map(el => ({
          "MachineGUID": DEVICE_ID,
          "Date": new Date().toISOString(),
          "Path": el.Location
        }))

        callWebhook(PHOTOS_WEBHOOK_URL, data)
          .catch(e => {
            log.error('Error while calling upload webhook')
            log.error(e)
          })
      }).catch(e => {
        log.error('Error uploading to S3')
        log.error(e)
      })
    } catch (error) {
      //TODO: Что делать? Повтор?
      console.error(error)
    }
  } else {
    log.warn('INVALID REMOTE PHOTOS OPTIONS')
    log.warn('Count: ' + options.count)
    log.warn('Interval: ' + options.interval)

    sendMessage(topics.EVENTS, {
      hardware: 'camera',
      code: 1,
      error: 'Invalid options to capture photos'
    });
  }
}

function onConnect() {
  log.debug('Connected to MQTT')

  mqttClient.subscribe(topics.COMMANDS, err => err && log.error(err))

  sendState();
}

async function onMessage(topic, message) {
  if (topic == topics.COMMANDS) {
    if (message.toString() != '') {
      try {
        message = JSON.parse(message.toString())
      } catch(e) {
        log.error(e)
        return;
      }

      log.debug('Received command - ' + message.command);

      currentClientId = message.clientId;

      if (message.command === commands.OPEN) {
        unlock()
      }

      if (message.command === commands.GET_STATE) {
        sendState()
      }

      if (message.command === commands.MAKE_PHOTO) {
        makeRemotePhoto(message.options)
      }
    } else {
      log.error('Empty command payload')
    }
  } else {
    log.debug('unprocessed topic:', topic)
    log.debug(message.toString())
  }
}

// isOpened == 1 (HIGH на пине) -> дверь закрыта
async function doorSensorHandler(err, isOpened) {
	log.debug('Door sensor handler')
  log.debug('Pin state in callback: ' + isOpened)

  if (err) {
    log.error(err);
    return; // что делать?
  }

  const doorState = isOpened ? 'opened' : 'closed';

  // Если хендлер сработал с тем же значением пина что и так уже
  // зафиксирован в deviceState.door, значит это дребезг, глюк и т.п.
  // if (deviceState.door == doorState) {
  //   log.error('Handler was called without changing the actual pin state')
  //   return;
  // }

  deviceState.door = doorState;
  deviceState.lock = getLockState();

  // НОРМА. Дверь ОТКРЫЛИ при разблокированном замке
  if (isOpened && deviceState.lock === 'unlocked') {
    log.info('Door is opened!');

    sendState({
      status: 'online',
      lock: deviceState.lock,
      door: deviceState.door
    })

    makePhotos(1,1,'open').then(res => {
      log.debug('Photo uploaded to S3.')
      // Send links to external webhook
      const data = res.map(el => ({
        "MachineGUID": DEVICE_ID,
        "Date": new Date().toISOString(),
        "Path": el.Location
      }))

      callWebhook(PHOTOS_WEBHOOK_URL, data).catch(e => log.error(e))
    }).catch(log.error)

    sendMessage(topics.EVENTS, {
      hardware: 'door',
      lock: deviceState.lock,
      door: deviceState.door
    })
  // НОРМА. Дверь ЗАКРЫЛИ при разблокированном замке
  } else if (!isOpened && deviceState.lock === 'unlocked') {
    log.info('Door is closed.');
    clearTimeout(doorTimeout);
    lockDoor();

    // log.debug('Waiting 2 sec. and lock door...');
    // await delay(2000);

    sendMessage(topics.EVENTS, {
      hardware: 'door',
      lock: deviceState.lock,
      door: deviceState.door
    })

    sendState({
      status: 'online',
      lock: 'locked',
      door: 'closed'
    })
  // ALERT. Дверь открыли при заблокированном замке!
  } else if (isOpened && deviceState.lock === 'locked') {
    log.error('ОТКРЫТА ДВЕРЬ ПРИ ЗАКРЫТОМ ЗАМКЕ!');

    const data = {
      "MachineGUID": DEVICE_ID,
      "Date": new Date().toISOString(),
      "Code": 1, // ?
      "Message": 'Открыли дверь при заблокированном замке'
    }

    callWebhook(ALERT_WEBHOOK_URL, data)
      .catch(e => {
        log.error('ALERT_WEBHOOK_URL Error')
        log.error(e)
      })

    sendState({
      state: 'online',
      lock: deviceState.lock,
      door: deviceState.door
    })

    makePhotos(1,1,'alert').then(res => {
      log.debug('Photo uploaded to S3.')

      const data = res.map(el => ({
        "MachineGUID": DEVICE_ID,
        "Date": new Date().toISOString(),
        "Path": el.Location
      }))

      // Send links to external webhook
      callWebhook(PHOTOS_WEBHOOK_URL, data).catch(log.error)
    }).catch(log.error)

  // TODO: а это нужно вообще это проверять? Возможен ли такой кейс?
  } else if (!isOpened && deviceState.lock === 'locked') {
    // ALERT. Дверь ЗАКРЫЛИ при заблокированном замке!
    log.warn('ЗАКРЫТА ДВЕРЬ ПРИ ЗАКРЫТОМ ЗАМКЕ!');
  }
}

async function shutDown() {
  log.debug('Shutdown...')
  isShuttingDown = true;
  await lockDoor();

  sendState({
    status: 'offline',
    lock: deviceState.lock,
    door: deviceState.door
  }, err => {
    if (err) {
      console.error(err) // last error
    }

    mqttClient.end();
    doorLockPin.unexport();
    doorUnlockPin.unexport();
    doorSensor.unexport();
    process.exit(0);
  })
}

function isOnline() {
  log.info('**********************************')
  log.info('Ally.Refrigerator firmware v' + packageJSON.version)
  log.info('**********************************')

  dns.resolve('www.ya.ru', err => {
    if (err) {
      log.error('No internet! Waiting 5 sec and reconnect')
      log.error(err)
      setTimeout(() => {
        isOnline()
      }, 5000);

      return;
    }

    log.debug('Internet is ok. Starting controller script...')
    initialize();
  })
}

// Точка входа
isOnline();

process.on('exit', function() {
  console.log('EXIT');
  isShuttingDown ? process.exit(0): shutDown(); // не всегда отстанавливается через CTRL-C
});
process.on('SIGINT', () => shutDown());
process.on('SIGTERM', () => shutDown());
process.on('uncaughtException', (err) => {
  console.log('uncaughtException', err);
  log.error(err);
  shutDown();
});
