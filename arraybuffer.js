//"\x05\x00\x08\x00\x00\x05\x14"
//[0x05, 0x00, 0x08, 0x00, 0x00, 0x05, 0x14]

let buffer = new ArrayBuffer(11);
let view8 = new Uint8Array(buffer);
view8 = [0x05, 0x00, 0x08, 0x00, 0x00, 0x05, 0x14];

let buffer2 = new ArrayBuffer(4);
let view16 = new Uint16Array(buffer2);
view16[0] = 32;
view16[1] = 50;

view8.set(buffer2, 4);