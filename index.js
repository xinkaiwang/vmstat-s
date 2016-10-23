
// var fs = require('fs');

// fs.readFile('./sampleInput.txt', 'utf8', function (err, text) {
//   if (err) {
//     return console.log(err);
//   }
//   var parser = require('./vmstatsParser');
//   var data = parser(text);
//   console.log(data);
// });

var cmd = require('./vmstatCmd');
var parser = require('./vmstatsParser');

// cmd().then(parser).then(JSON.stringify).then(console.log);

var vmstatHistory  = require('./vmstatHistory');

var v = null;
vmstatHistory().then(function (history) { v = history;});

function heartbeat() {
    setTimeout(heartbeat, 2*1000);
    if (v) {
        v.next()
        .then(function(data) {
            return data.summary;
        })
        .then(JSON.stringify)
        .then(console.log);
    }
}

setTimeout(function() {
    heartbeat();
}, 2*1000);
