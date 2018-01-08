
import test from 'ava';

import {HtmlParser} from '../js/HtmlParser'
import {CssParser} from '../js/CssParser'
import {RenderTree} from '../js/RenderTree'
import {HtmlStyleExtractor} from '../js/HtmlStyleExtractor'

/*
test('Create Tree', async t => {

	var htmlParser = new HtmlParser();
	var cssParser = new CssParser();
	var renderTree = new RenderTree();

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
			<div>
				<span>
					<p>
						<div>
							<span>
								<a>link</a>
							</span>
						</div>
					</p>
				</span>
			</div>
		</div>
	</body>
</html>`

		let css = `
			div > div > span a,
			body > div > span a,
			div, em,
			h1 p,
			div p,
			div > p,
			body > p {
				color: red;
			}
		`;

	let nodes = htmlParser.parse(html);
	let styles = cssParser.parse(css);
	let tree = renderTree.createRenderTree(nodes, styles);

	t.is('','');
});
*/
test('Match CSS: Child and Descendent', async t => {

	var htmlParser = new HtmlParser();
	var cssParser = new CssParser();
	var renderTree = new RenderTree();
	let nodes, styles, tree;

	nodes = htmlParser.parse(`<a>`);
	styles = cssParser.parse(`em { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.is(JSON.stringify([]), JSON.stringify(tree[0].styles));

	nodes = htmlParser.parse(`<em>`);
	styles = cssParser.parse(`em { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].styles));

	nodes = htmlParser.parse(`<div><p>Hello <em>world</em>!</p></div>`);
	styles = cssParser.parse(`em { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[0].children[1].styles));

	nodes = htmlParser.parse(`<div><p>`);
	styles = cssParser.parse(`div > p { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[0].styles));

	nodes = htmlParser.parse(`<div><span><p>`);
	styles = cssParser.parse(`div > p { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[0].children[0].styles));

	nodes = htmlParser.parse(`<div><span><p>`);
	styles = cssParser.parse(`div p { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[0].children[0].styles));

	nodes = htmlParser.parse(`<span><div><p>`);
	styles = cssParser.parse(`div span p { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[0].children[0].styles));

	nodes = htmlParser.parse(`<body><div><div><span><p><div><span><a>`);
	styles = cssParser.parse(`div > div > span a { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].styles));

	nodes = htmlParser.parse(`<body><div><div><span><p><div><span><a>`);
	styles = cssParser.parse(`body > div > span a { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].styles));

	nodes = htmlParser.parse(`<body><div><div><span><p><div><span><a>`);
	styles = cssParser.parse(`main div > div > span a { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].styles));

	nodes = htmlParser.parse(`<body><div><div><span><p><div><span><a>`);
	styles = cssParser.parse(`body div > div a { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].styles));

	nodes = htmlParser.parse(`<body><div><span><div><span><p><div><span><a>`);
	styles = cssParser.parse(`body > div > span a { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].styles));

	nodes = htmlParser.parse(`<body><div><span><div><span><p><div><span><a>`);
	styles = cssParser.parse(`body > div span div > span p span > a { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].styles));

});

