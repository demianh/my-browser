
import test from 'ava';

import {HtmlParser} from '../js/HtmlParser'
import {CssParser} from '../js/CssParser'
import {RenderTree} from '../js/RenderTree'
import {HtmlStyleExtractor} from '../js/HtmlStyleExtractor'


test('Extract', async t => {
	var htmlParser = new HtmlParser();
	var cssParser = new CssParser();
	var renderTree = new RenderTree();
	/*
	let html = `
<!DOCTYPE html>
<html>
	<head>
		<style type="text/css">
			h1 {
				color: red;
			}
		</style>
		<link rel="stylesheet" href="demo.css"/>
	</head>
	<body>
		<h1 class="title">Title</h1>
		<!-- this is a comment -->
		<div id="main" class="test test--main">
			<br>
			<p>Hello <em>world</em>!</p>
		</div>
	</body>
</html>`

		let css = `
			div, em {
				color: red;
			}
			h1 p {
				color: blue;
			}
		`;

	let nodes = htmlParser.parse(html);
	let styles = cssParser.parse(css);
	let tree = renderTree.createRenderTree(nodes, styles);
*/
	t.is('','');
});

