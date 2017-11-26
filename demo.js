
// this is a console demo to test the parsers

var HtmlParser = require('./js/HtmlParser.js');
var CssParser = require('./js/CssParser.js');

var HtmlRenderer = require('./js/HtmlRenderer.js');

var fs = require('fs');


// HTML Parser
fs.readFile( __dirname + '/resources/demo.html', function (err, data) {
  if (err) {
    throw err;
  }

  var htmlParser = new HtmlParser.HtmlParser();
  var renderer = new HtmlRenderer.HtmlRenderer();

  var content = data.toString();
  var nodes = htmlParser.parse(content);
  var html = renderer.render(nodes);

  console.log(html);
});

/*
// CSS Parser
fs.readFile( __dirname + '/resources/demo.css', function (err, data) {
  if (err) {
    throw err;
  }

  var cssParser = new CssParser.CssParser();

  var content = data.toString();
  var nodes = cssParser.parse(content);

  console.log(JSON.stringify(nodes, null, 2));
});
*/
