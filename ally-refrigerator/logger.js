const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const fs = require('fs');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const transportsArr = [
  new transports.Console(),
  new transports.File({ filename: 'error.log', level: 'error' }),
  new transports.File({ filename: 'controller.log' })
]

if (!(process.env.ES_NODE_1 && process.env.ES_NODE_2 && process.env.ES_TRANSPORT_PASSWORD && process.env.ES_TRANSPORT_USER)) {
  console.error('Invalid ES configuration');
  // process.exit(1);
} else {
  const esTransportOpts = {
    level: 'debug',
    clientOpts: {
      nodes: [process.env.ES_NODE_1, process.env.ES_NODE_2],
      auth: {
        username: process.env.ES_TRANSPORT_USER,
        password: process.env.ES_TRANSPORT_PASSWORD
      },
      ssl: {
        ca: fs.readFileSync('./CA.pem'),
        rejectUnauthorized: false
      }
    }
  };

  const esTransport = new ElasticsearchTransport(esTransportOpts);

  esTransport.on('warning', (error) => {
    console.error('Error caught', error);
  });

  transportsArr.push(esTransport)
}


const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'debug',
  format: combine(
    label({ label: '>' }),
    timestamp(),
    myFormat
  ),
  transports: transportsArr
});

var nullLog = function() {};
// logger.info.bind(logger)

logger.debug = logger.debug ? logger.debug.bind(logger) : nullLog;
logger.info = logger.info ? logger.info.bind(logger) : nullLog;
logger.error = logger.error ? logger.error.bind(logger) : nullLog;
logger.warn = logger.warn ? logger.warn.bind(logger) : (logger.error ? logger.error.bind(logger) : nullLog);
logger.crit = logger.crit ? logger.crit.bind(logger) : (logger.error ? logger.error.bind(logger) : nullLog);
logger.verbose = logger.verbose ? logger.verbose.bind(logger) : nullLog;
logger.silly = logger.silly ? logger.silly.bind(logger) : nullLog;
logger.blank = logger.blank ? logger.blank.bind(logger) : nullLog;

logger.on('error', (error) => {
  console.error('Error caught', error);
});


exports.default = logger;
