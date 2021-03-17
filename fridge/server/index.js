const express = require('express')
const multer  = require('multer')
const path = require('path')

const upload = multer({ dest: 'uploads/' })

const app = express()

app.use(express.static(__dirname));

app.post('/api/uploadPhoto', upload.single('vending_image'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    res.send(`You have uploaded this image: <hr/><img src="../${req.file.path}" width="500">`);
})

app.listen(3000, () => console.log(`Listening on port 3000`));