
// this is a console demo to test the parsers

var CssParser = require('./dist/js/CssParser.js');

var fs = require('fs');


// CSS Parser
fs.readFile( __dirname + '/resources/google.css', function (err, data) {
  if (err) {
    throw err;
  }

  var cssParser = new CssParser.CssParser();

  var content = data.toString();
  var nodes = cssParser.parse(content);

  console.log(JSON.stringify(nodes, null, 2));
});
