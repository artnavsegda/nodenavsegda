const CHILD_PROCESS = require('child_process');
const EXEC = CHILD_PROCESS.exec;

function capture(filename, options = {}) {
  const shArgs = {
    maxBuffer: 1024 * 10000
  };

  const {
    location = './',
    device = '/dev/video0',
    width = 640,
    height = 480,
    title = filename,
    subtitle = '',
    info = '',
    jpeg = -1,
    logo,
    banner,
    gmt,
  } = options;

  let cmd = `fswebcam -r ${width}x${height} -d ${device} --jpeg ${jpeg}`;

  if (banner) {
    cmd += ` --title "${title}" --subtitle "${subtitle}" --info "${info}" --banner-colour "#AA000000" --line-colour "#4d7cfe" --timestamp "%Y-%m-%d %H:%M:%S (%Z)"`
  } else {
    cmd += ' --no-banner '
  }

  if (logo) {
    cmd += ` --underlay ally_logo.png `
  }

  if (gmt) {
    cmd += ` --gmt `
  }

  cmd += ` ${location}${filename}`

  console.log('Capture photo...')
  console.log(cmd)

  return new Promise((resolve, reject) => {
    EXEC(cmd, shArgs, function(err, stdout, stderr) {
      if(err) {
        return reject(err);
      }
      console.log('stderr', stderr)
      console.log('stdout', stdout)

      resolve()
    })
  })
}

module.exports = capture;
