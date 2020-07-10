const appletv = require('node-appletv-x');
const express = require('express');

const app = express();
const port = 3000;
 
// see example above for how to get the credentials string
let credentials = appletv.parseCredentials("5AA87495-6570-4007-B058-A159CDC693CF:65353533666433632d316337322d343639302d616465312d373665323563356232653966:61383161336535312d653462622d343264332d623538362d373539373066383139343764:ae42c40a05af7e2edc41a4346bf6ad5b5ac8e537026c7a9442841fee310628db:be352c9a0f532883ac09a80eac7116b5fa7d5441cdaa45e8deef1a223964fc3f");
 
appletv.scan("5AA87495-6570-4007-B058-A159CDC693CF")
    .then(devices => {
        let device = devices[0];
        console.log("opening");
    	return device.openConnection(credentials);
    })
    .then(device => {
        console.log("connecting");
        // you're connected!    
        app.get('/menu', (req, res) => {
            res.send('menu pressed');
            device.sendKeyCommand(appletv.AppleTV.Key.Menu);
        });
        app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
    })
    .catch(error => {
    	console.log(error);
    });
