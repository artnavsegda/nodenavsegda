const express = require('express')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

app.post('/api/uploadPhoto', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
})

