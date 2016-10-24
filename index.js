#!/usr/bin/node

// vmstat-s 5
// Print out cpu/mem summary info every 5 seconds interval.
var vmstatHistory  = require('./vmstatHistory');
var argv = require('minimist')(process.argv.slice(2));

console.dir(argv);
var intervalInSeconds = 2; // default 2 seconds interval
if (argv._ && argv._.length >= 1) {
    intervalInSeconds = parseInt(argv._[0],10);
}

var v = null;
vmstatHistory()
    .then(function (history) { v = history;})
    .then(function() {
        console.log(JSON.stringify(v.getLastData().summary));
    });

function heartbeat() {
    setTimeout(heartbeat, intervalInSeconds*1000);
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
}, intervalInSeconds*1000);
