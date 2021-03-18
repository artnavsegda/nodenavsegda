const express = require('express')
const multer  = require('multer')
const path = require('path')
const mqtt = require('mqtt')

// mqtt

var client  = mqtt.connect('mqtt://84.22.105.210', {
    username: "testuser",
    password: "testuser"
})

client.on('connect', function () {
    client.subscribe('/client/#', function (err) {
        //
    })
})

let coarseDB = {
    //
};

function parsePayload(payload)
{
    console.log(JSON.stringify(payload));

    if (!coarseDB[payload.client])
    {
        coarseDB[payload.client] = {
            temperature: {},
            door: false,
            lock: false
        }
    }

    if (payload.type == "hwmon" || payload.type == "wb-w1")
    {
        coarseDB[payload.client].temperature[payload.device] = payload.payload;
    }

    if (payload.type == "wb-gpio")
    {
        switch (payload.device)
        {
            case "MOD1_OUT1":
                coarseDB[payload.client].lock = parseInt(payload.payload)
            case "A2_IN":
                coarseDB[payload.client].door = parseInt(payload.payload)
            break;
        }
    }

    console.log(JSON.stringify(coarseDB));
}

client.on('message', function (topic, message) {
    let topicPath = topic.split('/')
    parsePayload({
        client: topicPath[2],
        type: topicPath[4],
        device: topicPath[6],
        payload: message.toString()
    })
})

// http

const upload = multer({ dest: 'uploads/' })
const app = express()
app.use(express.static(__dirname));

app.post('/api/vending/uploadPhoto', upload.single('vending_image'), function (req, res, next) {
    res.send(`You have uploaded this image: <hr/><img src="../${req.file.path}" width="500">`);
})

app.get('/api/vending/status', (req, res) => {
    if (coarseDB[req.query.MachineGUID])
    {
        res.send({
            Lock: coarseDB[req.query.MachineGUID].lock,
            Door: coarseDB[req.query.MachineGUID].door,
            Temperature: coarseDB[req.query.MachineGUID].temperature,
        })
    }
    else
    {
        res.send({
            Result: 1,
            ErrorMessage: "No machine ID"
        })
    }
    //res.send('Hello World!' + JSON.stringify(req.query))
})

app.listen(3000, () => console.log(`Listening on port 3000`));