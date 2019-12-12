var YamahaAPI = require("yamaha-nodejs");
var yamaha = new YamahaAPI("192.168.88.159");
yamaha.powerOn().then(function(){
    console.log("powerOn");
    yamaha.setMainInputTo("NET RADIO").then( function(){
        console.log("Switched to Net Radio");
        yamaha.selectWebRadioListItem(1).then(function(){
            console.log("Selected Favorites");
            yamaha.selectWebRadioListItem(1).then(function(){});
        });

    });
});
