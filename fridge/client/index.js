const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');

const form = new FormData();

form.append('vending_image', fs.createReadStream('image.jpg'));

fetch('http://localhost:3000/api/uploadPhoto', {
    method: 'POST',
    body: form
})