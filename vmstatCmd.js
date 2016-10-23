'use strict'
var Promise = require('bluebird').Promise;
var exec = require('child_process').exec;

// retuen a promise(text)
function executeVmstat() {
    var cmd = 'vmstat -s';

    return new Promise(function (resolve, reject) {
        exec(cmd, function(error, stdout, stderr) {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

module.exports = executeVmstat;