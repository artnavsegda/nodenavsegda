let buffer = new Uint8Array([0x05, 0x00, 0x08, 0x00, 0x00, 0x05, 0x14, 0x00, 0x00, 0x00, 0x00]).buffer;
let dataView = new DataView(buffer);
dataView.setUint16(7, 32);
dataView.setUint16(9, 50);
console.log(buffer);