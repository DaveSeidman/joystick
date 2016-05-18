'use strict';



var isLocal = (window.location.href.indexOf('192.168') > 0);

var motorAddress = '192.168.108.216:80';

var socket = io.connect(motorAddress, { transports: ['websocket'] });


var buttons;
var iframe;
var keymap = {

    49 : "motor-fw",
    50 : "motor-bk",
    51 : "motor-lf",
    52 : "motor-rt",
    53 : "motor-up",
    54 : "motor-dn",
    55 : "motor-cl",

    38 : "motor-fw",
    40 : "motor-bk",
    37 : "motor-lf",
    39 : "motor-rt",

    190 : "motor-dn",
    188 : "motor-up",
    191 : "motor-cl"

}

document.addEventListener("DOMContentLoaded", function() {

    document.addEventListener("keydown", onKeyPress);
    document.addEventListener("keyup", onKeyRelease);

    buttons = document.getElementById('wrap').querySelectorAll('button');
    for(var btn in buttons) {

        if(btn < buttons.length) {

            if(isMobile()) {
                buttons[btn].addEventListener('touchstart', onPress);
                buttons[btn].addEventListener('touchend', onRelease);
            }
            else {
                buttons[btn].addEventListener('mousedown', onPress);
                buttons[btn].addEventListener('mouseup', onRelease);
            }
        }
    }

});

function onPress(e) {

    console.log("sending button-down", e.target.id, "to server");
    socket.emit('btnpressed', e.target.id);
}

function onRelease(e) {

    console.log("sending button-up", e.target.id, "to server");
    socket.emit('btnreleased', e.target.id);
}

function onKeyPress(e) {

    if(keymap[e.keyCode]) {
        console.log('%c sending to server: pressed:' + keymap[e.keyCode], 'color:#DDDDDD;');
        document.querySelector('#' + keymap[e.keyCode]).classList.add('active');
        socket.emit('btnpressed', keymap[e.keyCode]);
    }
}

function onKeyRelease(e) {

    if(keymap[e.keyCode]) {
        console.log('%c sending to server: released:' + keymap[e.keyCode], 'color:#DDDDDD;');
        document.querySelector('#' + keymap[e.keyCode]).classList.remove('active');
        socket.emit('btnreleased', keymap[e.keyCode]);
    }


}

socket.on('welcome', function() {

    console.log("connected");
});

socket.on('echo', function(data) {

    console.log('%c received from server: ' + data, 'color:#EE8080');
});

function isMobile() {
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}
