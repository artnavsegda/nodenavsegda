import cipclient from 'crestron-cip';
import express from 'express';

const cip = cipclient.connect({host: "192.168.88.41", ipid: "\x03"}, () => {
    console.log('CIP connected');
})

cip.subscribe((data) => {
    console.log("type:" + data.type + " join:" + data.join + " value:" + data.value);
});

const app = express()
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/test', (req, res) => {
    //cip.aset(33,50);
    //cip.dset(210, 1);
    //cip.dset(210, 0);
    //cip.pulse(202);
    console.log("result " + cip.dget(1));
    console.log("result " + cip.aget(1));
    res.send('Hello World!');
});
app.listen(3000, () => console.log(`Example app listening at http://localhost:3000`))