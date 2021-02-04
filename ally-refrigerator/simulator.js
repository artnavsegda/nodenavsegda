require('dotenv').config()
const fs = require('fs');
const PiCamera = require('pi-camera');
const mqttLib = require('mqtt');
// const Gpio = require('onoff').Gpio;
const Gpio = require('./mocks/onoff').Gpio;
const dns = require('dns');
const axios = require('axios');
const http = require('http');
const packageJSON = require('./package.json');
const log = require('./logger').default;
const { AWS, awsParams, createAlbum } = require('./s3');

/** INITIALIZATION */
const DOOR_SENSOR_GPIO = process.env.DOOR_SENSOR_GPIO || 4;
const DOOR_LOCK_GPIO = process.env.DOOR_LOCK_GPIO || 17;
const DOOR_TIMEOUT = process.env.DOOR_TIMEOUT || 60 * 1000; // дверь должна быть открыта не более 1 минуты
const doorSensor = new Gpio(DOOR_SENSOR_GPIO, 'in',  'both', { debounceTimeout: 100 });
const doorLock = new Gpio(DOOR_LOCK_GPIO, 'out');

const PHOTOS_WEBHOOK_URL = process.env.PHOTOS_WEBHOOK_URL;
const STATE_WEBHOOK_URL = process.env.STATE_WEBHOOK_URL;
const ALERT_WEBHOOK_URL = process.env.ALERT_WEBHOOK_URL;

const DEVICE_NAME = process.env.DEVICE_NAME;
const DEVICE_ID = process.env.DEVICE_ID;
const DEVICE_PASSWD = process.env.DEVICE_PASSWD;
const MQTT_URL = process.env.MQTT_URL;
const HTTP_PORT = process.env.HTTP_PORT || 3000;

if (!(PHOTOS_WEBHOOK_URL && STATE_WEBHOOK_URL && ALERT_WEBHOOK_URL && DEVICE_NAME && DEVICE_ID && DEVICE_PASSWD && MQTT_URL)) {
  log.error('Invalid configuration');
  process.exit(1);
}

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
};

const camera = new PiCamera({
  mode: 'photo',
  output: `${ __dirname }/photo.jpg`,
  width: process.env.PHOTO_WIDTH || 640,
  height: process.env.PHOTO_HEIGHT || 480,
  nopreview: true,
  timestamp: true,
  datetime: true,
  timeout: process.env.PHOTO_HEIGHT || 1000
});

const commands = {
  OPEN: 'open',
  CLOSE: 'close',
  GET_STATE: 'get_state',
  MAKE_PHOTO: 'make_photo'
}

const deviceState = {
  simulator: true,
  door: 'closed',
  lock: 'locked'
};

/** INITIALIZATION END */

let mqttClient;
let doorTimeout;
let currentClientId;
let isShuttingDown;
let server;

/**
 * Инициализация
 */
async function initialize() {
  try {
    await createAlbum(DEVICE_ID) // Создаем/проверяем альбом устройства в S3

    mqttClient  = mqttLib.connect(MQTT_URL, mqttOptions);

    mqttClient.on('connect', onConnect)
    mqttClient.on('message', onMessage)
    mqttClient.on('error', log.error)

    // WATCH DOOR SENSOR
    doorSensor.watch(onDoorSensor);

    server = http.createServer(httpRequestHandler);

    server.listen(HTTP_PORT, (err) => {
      if (err) {
        return log.error('Web-server error', err)
      }
      log.debug(`Web-server is listening on ${HTTP_PORT}`)
    });

  } catch (e) {
    log.error(e)
    log.error('Initialization failed')
    process.exit(1)
  }
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

  return Promise.resolve();

  let photosPath = []

  for (let i = 0; i < count; i++) {
    const time = new Date().getTime();
    const filePath = `${ __dirname }/photos/${time}_${DEVICE_ID}_${currentClientId || 'unknow'}_${state}_${i}.jpg`;

    camera.set('output', filePath)
    try {
      await camera.snap()
      photosPath.push(filePath)
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

function getLockState() {
  return doorLock.readSync() ? 'unlocked' : 'locked'
}

function getDoorState() {
  return doorSensor.readSync() ? 'opened' : 'closed'
}

async function lockDoor() {
  doorLock.write(0); // Ждать или нет?
  deviceState.lock = 'locked';
  sendState();

  axios.post(STATE_WEBHOOK_URL, {
    'deviceId' : DEVICE_ID,
    'timestamp': new Date().toISOString(),
    ...deviceState
  }).catch(e => {
    log.error('STATE_WEBHOOK_URL Error')
    log.error(e)
  })
}

async function unlockDoor() {
  doorLock.write(1); // Ждать или нет?
  deviceState.lock = 'unlocked'

  sendState();

  axios.post(STATE_WEBHOOK_URL, {
    'deviceId' : DEVICE_ID,
    'timestamp': new Date().toISOString(),
    ...deviceState
  }).catch(e => {
    log.error('STATE_WEBHOOK_URL Error')
    log.error(e)
  })
}

async function openLock() {
  // Update actual device state
  const lockState = getLockState();
  const doorState = getDoorState();

  log.debug('Initiator:' + currentClientId);

  if (lockState === 'locked') {
    unlockDoor();

    sendMessage(topics.EVENTS, {
      hardware: 'lock',
      state: 'unlocked',
    })

    setTimeout(() => {
      // имитируем открытие двери
      doorSensor.changeState(1);
      setTimeout(() => {
        // имитируем закрытие двери
        doorSensor.changeState(0);
      }, 5000);
    }, 2000);

    // Запускаем таймер и ждем открытие двери?
    doorTimeout = setTimeout(async () => {
      if (doorState === 'closed') {
        // Закрываем замок, т.к. дверь не
        // открыли за отведенное время
        lockDoor()

        log.warn('DOOR LOCKED BY TIMEOUT')

        sendMessage(topics.EVENTS, {
          hardware: 'lock',
          state: 'locked',
          error: 'DOOR LOCKED BY TIMEOUT'
        });
        sendState();
      } else {
        log.warn('Door timeout');

        sendMessage(topics.EVENTS, {
          alert: true,
          hardware: 'door',
          state: 'opened',
          error: 'Door timeout'
        });
        sendState();

        makePhotos(1,1,'alert').then(() => log.debug('Photo uploaded to S3.')).catch(log.error)
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

async function sendState(state) {
  if (!state) {
    state = {
      status: 'online',
      simulator: true,
      lock: getLockState(),
      door: getDoorState()
    }
    deviceState.lock = state.lock;
    deviceState.door = state.door;
  }

  log.debug(`Sending device state`)
  log.debug(JSON.stringify(state));
  sendMessage(topics.STATE, state, { qos: 1 });
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
        // Send links to external webhook
        axios
          .post(PHOTOS_WEBHOOK_URL, {
            'deviceId' : DEVICE_ID,
            'timestamp': new Date().toISOString(),
            'links': res.map(el => el.Location)
          })
          .then(() => log.debug('Webhook called'))
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

      log.debug('Receive command - ' + message.command);

      currentClientId = message.clientId;

      if (message.command === commands.OPEN) {
        openLock()
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

async function onDoorSensor(err, isOpen) {
  if (err) {
    log.error(err);
    return; // что делать?
  }
  console.log('Door sensor changed!');

  deviceState.door = isOpen ? 'opened' : 'closed';
  deviceState.lock = getLockState();

  // НОРМА. Дверь ОТКРЫЛИ при разблокированном замке
  if (isOpen && deviceState.lock === 'unlocked') {
    log.info('Door is opened!');
    makePhotos(1,1,'open').then(res => {
      log.debug('Photo uploaded to S3.')
      // Send links to external webhook
      axios
        .post(PHOTOS_WEBHOOK_URL, {
          'deviceId' : DEVICE_ID,
          'timestamp': new Date().toISOString(),
          'links': res.map(el => el.Location)
        })
        .then(() => log.debug('Webhook called'))
        .catch(e => log.error(e))
    }).catch(log.error)

    sendMessage(topics.EVENTS, {
      hardware: 'door',
      lock: deviceState.lock,
      door: deviceState.door
    })

    sendState({
      status: 'online',
      lock: deviceState.lock,
      door: deviceState.door
    })

    axios.post(STATE_WEBHOOK_URL, {
        'deviceId' : DEVICE_ID,
        'timestamp': new Date().toISOString(),
        ...deviceState
      }).catch(e => {
        log.error('STATE_WEBHOOK_URL Error')
        log.error(e)
      })

  // НОРМА. Дверь ЗАКРЫЛИ при разблокированном замке
  } else if (!isOpen && deviceState.lock === 'unlocked') {
    log.info('Door is closed.');
    lockDoor();
    clearTimeout(doorTimeout);

    sendMessage(topics.EVENTS, {
      hardware: 'door',
      lock: deviceState.lock,
      door: deviceState.door
    })

    axios.post(STATE_WEBHOOK_URL, {
        'deviceId' : DEVICE_ID,
        'timestamp': new Date().toISOString(),
        ...deviceState
      }).catch(e => {
        log.error('STATE_WEBHOOK_URL Error')
        log.error(e)
      })
  // ALERT. Дверь открыли при заблокированном замке!
  } else if (isOpen && deviceState.lock === 'locked') {

    axios.post(ALERT_WEBHOOK_URL, {
        'deviceId' : DEVICE_ID,
        'timestamp': new Date().toISOString(),
        ...deviceState,
        message: 'Открыли дверь при заблокированном замке'
      }).catch(e => {
        log.error('ALERT_WEBHOOK_URL Error')
        log.error(e)
      })

    log.error('ОТКРЫТА ДВЕРЬ ПРИ ЗАКРЫТОМ ЗАМКЕ!');

    sendState({
      sendState: 'online',
      hardware: 'door',
      alert: true,
      lock: deviceState.lock,
      door: deviceState.door
    })

    makePhotos(1,1,'alert').then(res => {
      log.debug('Photo uploaded to S3.')

      // Send links to external webhook
      axios
        .post(PHOTOS_WEBHOOK_URL, {
          'deviceId' : DEVICE_ID,
          'timestamp': new Date().toISOString(),
          'links': res.map(el => el.Location)
        })
        .then(() => log.debug('Webhook called'))
        .catch(e => log.error(e))
    }).catch(log.error)
  } else if (!isOpen && deviceState.lock === 'locked') {
    // ALERT. Дверь ЗАКРЫЛИ при заблокированном замке!
    // TODO: а нужно вообще это проверять?
    log.error('ЗАКРЫТА ДВЕРЬ ПРИ ЗАКРЫТОМ ЗАМКЕ!');
    sendState({
      status: 'online',
      hardware: 'door',
      alert: true,
      lock: deviceState.lock,
      door: deviceState.door
    })
  }
}

const httpRequestHandler = (request, response) => {
  log.debug(request.url);
  response.writeHead(200, {
    'Content-Type': 'application/json',
    'X-Powered-By': `Ally.Refrigirator ${packageJSON.version}`
  })

  const used = process.memoryUsage();
  const memory = {};
  for (let key in used) {
    memory[key] = `${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`;
  }

  response.write(JSON.stringify({
    deviceName: DEVICE_NAME,
    deviceId: DEVICE_ID,
    state: deviceState,
    memory,
    firmware: packageJSON.version,
    timestamp: new Date().toISOString(),
  }));
  response.end()
}

function shutDown() {
  log.debug('Shutdown...')
  isShuttingDown = true;

  sendState({
    status: 'offline',
    lock: deviceState.lock,
    door: deviceState.door
  })
  .catch((err) => {
    console.log('Last error');
    console.error(err);
  })
  .finally(() => {
    mqttClient.end();
    doorLock.unexport();
    doorSensor.unexport();
    process.exit(0);
  })
}

function isOnline() {
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
