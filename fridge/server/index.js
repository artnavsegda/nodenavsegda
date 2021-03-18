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

client.on('message', function (topic, message) {
    console.log("Topic: " + topic.toString() + ", Message: " +  message.toString())
})




// http

/* const upload = multer({ dest: 'uploads/' })
const app = express()
app.use(express.static(__dirname));

app.post('/api/uploadPhoto', upload.single('vending_image'), function (req, res, next) {
    res.send(`You have uploaded this image: <hr/><img src="../${req.file.path}" width="500">`);
})

app.listen(3000, () => console.log(`Listening on port 3000`)); */