
import test from 'ava';

import {HtmlParser} from '../js/HtmlParser'
import {HtmlStyleExtractor} from '../js/HtmlStyleExtractor'

test('Extract', async t => {
	var parser = new HtmlParser();
	var extractor = new HtmlStyleExtractor();
	var nodes;
	var styles;

	let html = `
<html>
	<head>
		<style type="text/css">
			h1 {
				color: red;
			}
		</style>
		<link rel="stylesheet" href="demo.css"/>
		<link rel="icon" href="nope.css"/>
	</head>
	<body>
		<h1 class="title">Title</h1>
		<div id="main" class="test">
			<p>Hello <em>world</em>!</p>
			<style type="text/css">
				h2 {
					color: blue;
				}
			</style>
		</div>
		<link rel="stylesheet" href="demo2.css"/>
		<link href="nope.css"/>
	</body>
</html>`

	nodes = parser.parse(html);
	styles = extractor.extractStyles(nodes);
	t.is(JSON.stringify(styles), JSON.stringify(
		[
			{"type":"inline","css":"\n\t\t\th1 {\n\t\t\t\tcolor: red;\n\t\t\t}\n\t\t"},
			{"type":"link","href":"demo.css"},
			{"type":"inline","css":"\n\t\t\t\th2 {\n\t\t\t\t\tcolor: blue;\n\t\t\t\t}\n\t\t\t"},
			{"type":"link","href":"demo2.css"}
		]
	));
});

