
var fs = require('fs');

fs.readFile('./sampleInput.txt', 'utf8', function (err, text) {
  if (err) {
    return console.log(err);
  }
  var parser = require('./vmstatsParser');
  var data = parser(text);
  console.log(data);
});
