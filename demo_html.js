
// this is a console demo to test the parsers

var HtmlParser = require('./js/HtmlParser.js');

var HtmlStyleExtractor = require('./js/HtmlStyleExtractor');

var HtmlRenderer = require('./js/HtmlRenderer.js');

var fs = require('fs');


// HTML Parser
fs.readFile( __dirname + '/resources/demo_styles.html', function (err, data) {
  if (err) {
    throw err;
  }

  var htmlParser = new HtmlParser.HtmlParser();
  var renderer = new HtmlRenderer.HtmlRenderer();
  var extractor = new HtmlStyleExtractor.HtmlStyleExtractor();

  var content = data.toString();
  var nodes = htmlParser.parse(content);
  //var html = renderer.render(nodes);
  var styles = extractor.extractStyles(nodes);


  console.log(styles);
});
