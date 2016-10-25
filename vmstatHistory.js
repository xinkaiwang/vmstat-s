'use strict'

var Promise = require('bluebird').Promise;
var cmd = require('./vmstatCmd');
var parser = require('./vmstatsParser');
var sysconf = require('sysconf');
var _ = require('underscore');

var cpuTicksPerSecond = sysconf.get(sysconf._SC_CLK_TCK);

var usedCpuTicksFields = [
    'nonNiceUserCpuTicks',
    'niceUserCpuTicks',
    'systemCpuTicks',
    'ioWaitCpuTicks',
    'irqCpuTicks',
    'softIrqCpuTicks'];

function access(obj, path) {
    if(obj && obj[path]) {
        return obj[path];
    } else {
        return 0;
    }
}

// Doing 4/5 round will cause some small values tends always get round down. which causes statisticly in-correct sum values.
// So we decided to use random round up/down. the larger the value is, the higher likelyhood it going to round-up.
function round(value) {
    return Math.floor(value + Math.random());
}

// return a new object
function composeMemSummary(data) {
    var summary = {};
    summary.memTotalMB = Math.round(data.totalMemoryKB/1024.0);
    summary.memFreeMB = Math.round(data.freeMemoryKB/1024.0);
    summary.memBufferMB = Math.round((data.bufferMemoryKB + data.swapCacheKB)/1024.0);
    summary.memUsagePercent = Math.round((data.totalMemoryKB - data.freeMemoryKB - data.bufferMemoryKB - data.swapCacheKB)/data.totalMemoryKB * 100.0);
    return summary;
}

function composeCpuDetail(lastData, data) {
    var elapsedInMsSinceLastData = data.timestamp - lastData.timestamp;
    var cpuDetail = {
        elapsedInMsSinceLastData: elapsedInMsSinceLastData
    };
    var usedCpuTicks = 0;
    _.each(usedCpuTicksFields, function(field) {
        var value = access(data, field) - access(lastData, field);
        cpuDetail[field] = value;
        usedCpuTicks += value;
    });
    cpuDetail.idleCpuTicks = access(data, 'idleCpuTicks') - access(lastData, 'idleCpuTicks');
    cpuDetail.stolenCpuTicks = access(data, 'stolenCpuTicks') - access(lastData, 'stolenCpuTicks');
    cpuDetail.cpuTicksPerSecond = cpuTicksPerSecond;
    var summary = {
        upTimeInSeconds: Math.round((data.timestamp/1000.0) - data.bootTime) // bootTime is epoch in seconds, timestamp is epoch in ms
    };
    if (elapsedInMsSinceLastData) {
        var ratio = 100.0 / cpuTicksPerSecond / (elapsedInMsSinceLastData/1000.0);
        summary.cpuUsed = round(usedCpuTicks * ratio);
        summary.cpuIdle = round(cpuDetail.idleCpuTicks * ratio); // for 1 core machine, this can go up to 100.
        if (cpuDetail.stolenCpuTicks) {
            summary.cpuStolen = round(cpuDetail.stolenCpuTicks * ratio);
        }
    }
    return {
        cpuDetail: cpuDetail,
        summary: summary
    };
}
// return a promise
function createVmstatHistory() {
    var lastData = null;

    function getLastData() {
        var memSummary = composeMemSummary(lastData);
        memSummary = _.extend({upTimeInSeconds: Math.round((lastData.timestamp/1000.0) - lastData.bootTime)}, memSummary);
        return {
            lastData: lastData,
            summary: memSummary
        };
    }
    // returns a promise
    function next() {
        return cmd().then(parser).then(function newData(data) {
            data.timestamp = new Date().getTime(); // epoch time in ms
            var result = composeCpuDetail(lastData, data);
            result.lastData = data;
            var memSummary = composeMemSummary(data);
            _.extend(result.summary, memSummary);
            lastData = data;
            return result;
        });
    }
    var vmstatHistory = {
        getLastData: getLastData,
        next: next
    };

    return new Promise(function createVmstatHistoryPromiseFunc(resolve, reject) {
        cmd()
        .then(parser)
        .then(function (data) {
            data.timestamp = new Date().getTime(); // epoch time in ms
            lastData = data;
            resolve(vmstatHistory);
        })
        .catch(reject);
    });
}

module.exports = createVmstatHistory;
