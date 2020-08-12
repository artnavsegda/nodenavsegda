const appletv = require('node-appletv-x');
const express = require('express');

let storeScenarios = JSON.parse(fs.readFileSync('store.json', 'utf8'));
let meetingScenarios = JSON.parse(fs.readFileSync('meeting.json', 'utf8'));

const app = express();
const port = 3000;

// see example above for how to get the credentials string
let credentials = appletv.parseCredentials("5AA87495-6570-4007-B058-A159CDC693CF:65353533666433632d316337322d343639302d616465312d373665323563356232653966:36633031653663642d333636302d343361632d383338622d316138626563363964343137:ae42c40a05af7e2edc41a4346bf6ad5b5ac8e537026c7a9442841fee310628db:e3a286c0194c957a6b63576e2ee830f9d4f67d4704c720ea5139d55343174da1");

appletv.scan("5AA87495-6570-4007-B058-A159CDC693CF")
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

        app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
    })
    .catch(error => {
    	console.log(error);
    });
