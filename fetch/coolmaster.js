const fetch = require('node-fetch');

async function full_status() {
    let response = await fetch('http://192.168.10.12:10103/v2.0/device/283B96003138/ls');
    let data = await response.json();
    return data;
}

async function coolmaster_status() {
    console.log(JSON.stringify(await full_status()))
}

coolmaster_status();