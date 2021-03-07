const fetch = require('node-fetch');

async function full_status() {
    let response = await fetch('http://192.168.10.12:10103/v2.0/device/283B96003138/ls2');
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

async function set_temp(temp) {
    let response = await fetch('http://192.168.10.12:10103/v1.0/device/283B96003138/raw?command=temp&L1_001&' + temp);
    let data = await response.json();
    return data.rc;
}

async function get_temperature() {
    let response = await fetch('http://192.168.10.12:10103/v1.0/device/283B96003138/raw?command=ls2&L1_001');
    let data = await response.json();
    return Number(data.data[0].substr(17, 4))
}

async function get_setpoint() {
    let response = await fetch('http://192.168.10.12:10103/v1.0/device/283B96003138/raw?command=query&L1_001&h');
    let data = await response.json();
    return Number(data.data[0]);
}

async function get_mode_old() {
    let response = await fetch('http://192.168.10.12:10103/v1.0/device/283B96003138/raw?command=query&L1_001&m');
    let data = await response.json();
    return Number(data.data[0]);
}

async function set_mode(mode) {
    
    let response = await fetch('http://192.168.10.12:10103/v1.0/device/283B96003138/raw?command=heat&L1_001');
    //let response = await fetch('http://192.168.10.12:10103/v1.0/device/283B96003138/raw?command=cool&L1_001');
    let data = await response.json();
    return data.rc;
}

async function get_mode() {
    let response = await fetch('http://192.168.10.12:10103/v2.0/device/283B96003138/ls2&L1_001');
    let data = await response.json();
    if (data.onoff == "OFF")
    {
        return 0;
    }
    if (data.mode == "Heat")
    {
        return 2;
    }
    else
    {
        return 3;
    }

    return data;
}

async function coolmaster_status() {
    //console.log(JSON.stringify(await full_status()))
    //console.log(JSON.stringify(await is_on()))
    //console.log(JSON.stringify(await set_on()))
    //console.log(JSON.stringify(await set_off()))
    //console.log(JSON.stringify(await get_temperature()))
    //console.log(JSON.stringify(await get_setpoint()))
    console.log(JSON.stringify(await get_mode()))
}

coolmaster_status();