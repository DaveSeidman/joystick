'use strict';

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var gpio = require("gpio");


var gpios = {

    "motor-fw" : {
        "header" : 15,
        "prevent" : "bk",
        "direction" : "out",
        "mode" : "direct",
        "init" : 0
    },
    "motor-bk" : {
        "header" : 18,
        "prevent" : "fw",
        "direction" : "out",
        "mode" : "direct",
        "init" : 0
    },
    "motor-lf" : {
        "header" : 23,
        "direction" : "out",
        "mode" : "direct",
        "init" : 0
    },
    "motor-rt" : {
        "header" : 12,
        "direction" : "out",
        "mode" : "direct",
        "init" : 0
    },
    "motor-up" : {
        "header" : 16,
        "direction" : "out",
        "mode" : "direct",
        "init" : 0
    },
    "motor-dn" : {
        "header" : 20,
        "direction" : "out",
        "mode" : "direct",
        "init" : 0
    },
    "motor-cl" : {
        "header" : 21,
        "direction" : "out",
        "mode" : "direct",
        "init" : 0
    },
    "rs" : {
        "mode" : "sequence",
        "seq" : "reset"
    },
    "gr" : {
        "mode" : "sequence",
        "seq" : "grab"
    }/*,
    "switch-lf" : {
        "header" : 14,
        "direction" : "in"
    },
    "switch-bk" : {
        "header" : 15,
        "direction" : "in"
    },
    "switch-ft" : {
        "header" : 18,
        "direction" : "in"
    },
    "switch-rt" : {
        "header" : 25,
        "direction" : "in"
    },
    "switch-tp" : {
        "header" : 8,
        "direction" : "in"
    },
    "switch-bt" : {
        "header" : 7,
        "direction" : "in"
    }*/
};

var sock;
setupServer();
setupSocket();
setPinDirection();
setTimeout(setPinValue, 3000);
//setTimeout(checkSwitches, 4000);

function setupServer() {

    console.log("server running on port 80");
    server.listen(80);
    app.use(express.static('html'));

}

function setupSocket() {

    io.on('connection', function (socket) {

        console.log("incoming connection", socket.id);

        sock = socket;
        socket.emit("welcome");

        socket.on("btnpressed", function(data) {

            if(gpios[data].mode == "direct") {
                gpios[data].pin.set(1);
                socket.emit("echo", "pressed: " + data);
            }
            if(gpios[data].mode == "sequence") {

                runSequence(gpios[data].seq);
                socket.emit("echo", "starting " + gpios[data].seq + " sequence");
            }
        });

        socket.on("btnreleased", function(data) {

            if(gpios[data].mode == "direct") {
                gpios[data].pin.set(0);
                socket.emit("echo", "released: " + data);
            }
            if(gpios[data].mode == "sequence") {
                socket.emit("echo", "ignoring " + gpios[data].seq + " sequence");

            }
        });
    });
}

function runSequence(sequence) {

    switch(sequence) {

        case "reset":
            reset();
            break;

        case "grab":
            grab();
            break;
    }
}

function reset() {

    console.log("resetting");
}

function grab() {

    console.log("grabbing");
}


function setPinDirection() {

    for(var i in gpios) {

        var header = gpios[i].header;
        var direction = gpios[i].direction;

        if(header) {

            gpios[i].pin = gpio.export(header, {

                direction: direction
            });
        }
    }

    /*gpios["switch-lf"].pin.on("change", function(val) {
        sock.emit("echo", "switch-lf");
    });

    gpios["switch-bk"].pin.on("change", function(val) {
        sock.emit("echo", "switch-bk");
    });

    gpios["switch-ft"].pin.on("change", function(val) {
        sock.emit("echo", "switch-ft");
    });

    gpios["switch-rt"].pin.on("change", function(val) {
        sock.emit("echo", "switch-rt");
    });

    gpios["switch-tp"].pin.on("change", function(val) {
        sock.emit("echo", "switch-tp");
    });

    gpios["switch-bt"].pin.on("change", function(val) {
        sock.emit("echo", "switch-bt");
    });
*/
    testPin();

}

function testPin() {

//    console.log(gpios["switch-lf"].pin.value);

//    setTimeout(testPin, 1000);
}

function setPinValue() {

    for(var i in gpios) {

        if(gpios[i].init)    gpios[i].pin.set(gpios[i].init);
    }

}

function pinChanged(e, also) {

    console.log("pin changed", e, also);
}
