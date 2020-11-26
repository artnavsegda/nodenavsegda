const fs = require('fs');
const appletv = require('node-appletv-x');
const express = require('express');

const tryRead = (filename, template) => {
  try {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
  } catch(err) {
    console.log("no file " + filename);
    return template;
  }
}

let climateSchedule = tryRead('climate.json', {
  mode: "weekly",
  weekly: [
      [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
  ],
  daily: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
  });
let storeScenarios = tryRead('store.json', []);
let meetingScenarios = tryRead('meeting.json', []);

const app = express();
const port = 3000;

app.use(express.json());

// see example above for how to get the credentials string
let credentials = appletv.parseCredentials("D81ECAC1-E09C-4566-A817-8F5070FF9B2C:37636133636363362d373739312d343364362d623262352d303430396539353061313566:39316338383065312d333762622d343962392d623162652d663732613337316138656263:69e0d0c953cee59c34e638d680509271535fcdc6bdc1e7cd2ca352178bf03b04:46e579510ff094d495a43a289e76a007b99a8f6413b5e699cfe73ce3e37d608c");

appletv.scan("D81ECAC1-E09C-4566-A817-8F5070FF9B2C")
    .then(devices => {
        let device = devices[0];
        console.log("opening");
    	return device.openConnection(credentials);
    })
    .then(device => {
        console.log("connecting");
        // you're connected!

        let myinfo = {title:"", duration:"", elapsedTime:"", playbackState:""};

    	device.on('nowPlaying', (info) => {
            myinfo = info;
            console.log("Name: " + info.title);
            console.log("duration: " + info.duration);
            console.log("elapsedTime: " + info.elapsedTime);
            console.log("playbackState: " + info.playbackState);
        });

        app.get('/info', (req, res) => {
            res.send(JSON.stringify({ title: myinfo.title, duration: myinfo.duration, elapsedTime: myinfo.elapsedTime, playbackState: myinfo.playbackState }));
        });

        app.get('/menu', (req, res) => {
            res.send('menu pressed');
            device.sendKeyCommand(appletv.AppleTV.Key.Menu);
        });

        app.get('/ok', (req, res) => {
            res.send('ok pressed');
            device.sendKeyCommand(appletv.AppleTV.Key.Select);
        });

        app.get('/playpause', (req, res) => {
            res.send('playpause pressed');
            device.sendKeyCommand(appletv.AppleTV.Key.Pause);
        });

        app.get('/up', (req, res) => {
            res.send('up pressed');
            device.sendKeyCommand(appletv.AppleTV.Key.Up);
        });

        app.get('/down', (req, res) => {
            res.send('down pressed');
            device.sendKeyCommand(appletv.AppleTV.Key.Down);
        });

        app.get('/left', (req, res) => {
            res.send('left pressed');
            device.sendKeyCommand(appletv.AppleTV.Key.Left);
        });

        app.get('/right', (req, res) => {
            res.send('right pressed');
            device.sendKeyCommand(appletv.AppleTV.Key.Right);
        });

        app.post('/setScen', (req, res) => {
          console.log("data:" + JSON.stringify(req.body))
          let section = req.query.section;
          switch (section)
          {
            case "meeting":
                meetingScenarios = req.body;
                fs.writeFile('meeting.json', JSON.stringify(meetingScenarios),(error) => {});
                break;
            case "store":
                storeScenarios = req.body;
                fs.writeFile('store.json', JSON.stringify(storeScenarios),(error) => {});
                break;
            default:
          }

          res.json(req.body);
        })

        app.get('/getScen', (req, res) => {
          let section = req.query.section;
          switch (section)
          {
            case "meeting":
                res.send(meetingScenarios);
                break;
            case "store":
                res.send(storeScenarios);
                break;
            default:
                res.send("error");
          }
        })

        app.get('/getScen', (req, res) => {
            let section = req.query.section;
            switch (section)
            {
              case "meeting":
                  res.send(meetingScenarios);
                  break;
              case "store":
                  res.send(storeScenarios);
                  break;
              default:
                  res.send("error");
            }
          })
          
          app.get('/getClimate', (req, res) => {
            res.send(climateSchedule);
          })
          
          app.post('/setClimate', (req, res) => {
            console.log("data:" + JSON.stringify(req.body))
          
            climateSchedule = req.body;
            fs.writeFile('climate.json', JSON.stringify(climateSchedule),(error) => {});
          
            res.json(req.body);
          })

        app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
    })
    .catch(error => {
    	console.log(error);
    });

