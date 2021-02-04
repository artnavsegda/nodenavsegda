const i2c = require('i2c-bus');

const ADC_ADDR = 0x48;
const AIN0_REG = 0x41;

const wbuf = Buffer.from([AIN0_REG]);
const rbuf = Buffer.alloc(1);

const Uadc = 3.3
const bus = i2c.openSync(1);
let stop = 0;
async function start() {
  while (!stop) {
    bus.i2cWriteSync(ADC_ADDR, wbuf.length, wbuf)
    bus.i2cReadSync(ADC_ADDR, rbuf.length, rbuf)

    const termistorValue = rbuf.readUInt8();
    // const Uin = Uadc / 255 * termistorValue
    // console.log('value: ',termistorValue)
    // console.log('Uin: ',Uin)
    process.stdout.write('\rTemp. C = ' + getTemperature(termistorValue))

    await (new Promise(res => setTimeout(res, 100)))
  }
}

// Steinhart-Hart equation
function getTemperature(value) {
  const THERMISTORNOMINAL = 10000;
  const TEMPERATURENOMINAL = 25;
  // бета коэффициент термистора (обычно 3000-4000)
  const BCOEFFICIENT = 3950;

  let actualTermistorR = THERMISTORNOMINAL / (255 / value)
  let steinhart = actualTermistorR / THERMISTORNOMINAL; // (R/Ro);
  steinhart = Math.log(steinhart); // ln(R/Ro)
  steinhart /= BCOEFFICIENT; // 1/B * ln(R/Ro)
  steinhart += 1.0 / (TEMPERATURENOMINAL + 273.15); // + (1/To)
  steinhart = 1.0 / steinhart; // инвертируем
  steinhart -= 273.15; // конвертируем в градусы по Цельсию

  return steinhart.toFixed(1)
}


start()

process.on('SIGINT', () => {
  stop = 1
  bus.closeSync();
});
process.on('SIGTERM', () => {
  stop = 1
  bus.closeSync();
});

process.on('uncaughtException', (err) => {
  stop = 1
  console.log('uncaughtException')
  console.log(err)
  bus.closeSync();
});
