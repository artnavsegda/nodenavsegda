let ajoin = new Uint8Array([0x05, 0x00, 0x08, 0x00, 0x00, 0x05, 0x14, 0x00, 0x00, 0x00, 0x00]);
let dataView = new DataView(ajoin.buffer);
dataView.setUint16(7, 32);
dataView.setUint16(9, 50);
//console.log(ajoin);

function dsend(join,value)
{
    let djoin = new Uint8Array([0x05, 0x00, 0x06, 0x00, 0x00, 0x03, 0x27, 0x00, 0x00]);
    let dataView = new DataView(ajoin.buffer);
    if (value)
        join |= 0x80;
    console.log(join);
    dataView.setUint16(7, join);
    console.log(djoin);
}

dsend(10, 1);
dsend(10, 0);