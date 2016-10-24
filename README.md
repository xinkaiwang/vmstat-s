# vmstat-s

Show CPU/mem detailed and summary stats on a linux machine.


# Command-line Example
[![browser support](http://xinkaiw.com/wp-content/uploads/2016/10/vmstats.gif)](http://xinkaiw.com/2016/10/vmstat-s/)

# API Example
In addition to vmstat-s shell command-line, you can also `require('vmstat-s')` from your node.js application as you wish.
``` js
var promise = require('vmstat-s')(); // this return a promise of vmstats instance
promise.then(function (vmstats) {
    console.dir(vmstats.getLastData()); // print out initial (mem usage data only)
    setTimeout(heartbeat, 2*1000); // interval 2 seconds
    function heartbeat() {
      setTimeout(heartbeat, 2*1000);
      vmstats.next()
        .then(console.dir); // print out current data (mem usage data and cpu usage data). Cpu usage is calculated from tick count diffs, thus require at least 2 measures.
    }
});
```

# How it works
This module is based on `vmstat -s` linux command. It get memory and cpu tick counters with fixed interval and print out summary info to console.

# install

With [npm](https://npmjs.org) do:

```
npm install vmstat-s -g
```

# license

MIT
