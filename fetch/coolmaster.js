const fetch = require('node-fetch');

async function full_status() {
    let response = await fetch('http://192.168.10.12:10103/v2.0/device/283B96003138/ls');
    let data = await response.json();
    return data;
}

async function is_on() {
    let response = await fetch('http://192.168.10.12:10103/v1.0/device/283B96003138/raw?command=query&L1_001&o');
    let data = await response.json();
    return Number(data.data[0]);
}

async function set_on() {
    let response = await fetch('http://192.168.10.12:10103/v1.0/device/283B96003138/raw?command=on&L1_001');
    let data = await response.json();
    return data.rc;
}

async function set_off() {
    let response = await fetch('http://192.168.10.12:10103/v1.0/device/283B96003138/raw?command=off&L1_001');
    let data = await response.json();
    return data.rc;
}

async function coolmaster_status() {
    //console.log(JSON.stringify(await full_status()))
    console.log(JSON.stringify(await is_on()))
    //console.log(JSON.stringify(await set_on()))
    //console.log(JSON.stringify(await set_off()))
}

coolmaster_status();