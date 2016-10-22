'use strict'
var _ = require('underscore');

var mappingTable = [
    ['K total memory', 'totalMemoryKB'],
    ['K used memory', 'usedMemoryKB'],
    ['K active memory', 'activeMemoryKB'],
    ['K inactive memory', 'inactiveMemoryKB'],
    ['K free memory', 'freeMemoryKB'],
    ['K buffer memory', 'bufferMemoryKB'],
    ['K swap cache', 'swapCacheKB'],
    ['K total swap', 'totalSwapKB'],
    ['K used swap', 'usedSwapKB'],
    ['K free swap', 'freeSwapKB'],
    ['non-nice user cpu ticks', 'nonNiceUserCpuTicks'],
    ['nice user cpu ticks', 'niceUserCpuTicks'],
    ['system cpu ticks', 'systemCpuTicks'],
    ['idle cpu ticks', 'idleCpuTicks'],
    ['IO-wait cpu ticks', 'ioWaitCpuTicks'],
    ['IRQ cpu ticks', 'irqCpuTicks'],
    ['softirq cpu ticks', 'softIrqCpuTicks'],
    ['stolen cpu ticks', 'stolenCpuTicks'],
    ['pages paged in', 'pagesPagedIn'],
    ['pages paged out', 'pagesPagedOut'],
    ['pages swapped in', 'pagesSwappedIn'],
    ['pages swapped out', 'pagesSwappedOut'],
    ['interrupts', 'interrupts'],
    ['CPU context switches', 'cpuContextSwitches'],
    ['boot time', 'bootTime'],
    ['forks','forks']
];

function parseFromText(text) {
    var data = {};
    var lines = text.split(/\r?\n/);
    _.each(lines, function(line) {
        _.each(mappingTable, function(key) {
            if (line.indexOf(key[0]) >= 0) {
                var value = line.match(/[0-9]+/)[0];
                data[key[1]] = parseInt(value, 10);
            }
        });
    });
    return data;
}

module.exports = parseFromText;