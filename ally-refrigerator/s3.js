var AWS = require('aws-sdk');
var fs = require('fs');
const log = require('./logger').default;

if (!(process.env.AWS_HOST && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)) {
  log.error('Invalid S3 configuration');
  process.exit(1);
}

const awsParams = {
  endpoint_url: process.env.AWS_HOST,
  auth: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  region: 'us-east-1',
  httpOptions: {
    timeout: 10000,
    connectTimeout: 10000
  },
  Bucket: "refrigerator",
  debug: false
};

AWS.config.update({
  endpoint: new AWS.Endpoint(awsParams.endpoint_url),
  accessKeyId: awsParams.auth.accessKeyId,
  secretAccessKey: awsParams.auth.secretAccessKey,
  region: awsParams.region,
  httpOptions: awsParams.httpOptions
});

const s3 = new AWS.S3({
  params: { Bucket: awsParams.Bucket }
});

function createAlbum(albumName) {
  return new Promise((resolve, reject) => {
    albumName = albumName.trim();
    if (!albumName) {
      return reject("Album names must contain at least one non-space character.")
    }
    if (albumName.indexOf("/") !== -1) {
      return reject("Album names cannot contain slashes.")
    }
    var albumKey = albumName;
    s3.headObject({ Key: albumKey }, function(err, data) {
      if (!err) {
        return resolve("Album already exists.")
      }
      if (err.code !== "NotFound") {
        return reject("There was an error creating your album: " + err.message)
      }
      s3.putObject({ Key: albumKey }, function(err, data) {
        if (err) {
          return reject("There was an error creating your album: " + err.message);
        }
        log.debug('Album' + albumName + 'in S3 created')
        resolve(albumName);
      });
    });
  })
}

module.exports = {
  AWS,
  awsParams,
  createAlbum
}
