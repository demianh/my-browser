
import test from 'ava';

import {HtmlParser} from '../js/HtmlParser'
import {CssParser} from '../js/CssParser'
import {RenderTree} from '../js/RenderTree'
import {HtmlStyleExtractor} from '../js/HtmlStyleExtractor'


test('Create Render Tree', async t => {

	let html = `
<!DOCTYPE html>
<html>
	<head>
		<style type="text/css">
			h1 {
				color: red;
			}
			#main.test p, a {
				padding: 0 1px 3px .5%;
			}
			#main.test p + a.class:not(h2) > div ~ span {
				font-size: 1em;
			}
		</style>
		<style type="text/css">
			h2 {
				color: yellow;
			}
			@media only screen and (max-height: 650px) {
				span.lsbb {
					height: 17px
				}
				h2 {
					transform: scale(0, 0);
					background-image: -webkit-linear-gradient(top, #fff, #f8f8f8);
					transition: box-shadow 200ms cubic-bezier(0.4, 0 , 0.2 , 1 );
				}
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

	let htmlParser = new HtmlParser();
	let cssParser = new CssParser();
	let renderTree = new RenderTree();
	let extractor = new HtmlStyleExtractor();

	let nodes = htmlParser.parse(html);

	let styles = extractor.extractStyles(nodes);
	styles.forEach((style, index) => {
		if (style.type === 'inline') {
			styles[index].cssTree = cssParser.parse(style.css);
		}
	});

	let tree = renderTree.createRenderTree(nodes, styles[0].cssTree);

	t.deepEqual('html', tree[0].tag);
});

test('Match CSS: Child (>) and descendent combinator (whitespace)', async t => {

	var htmlParser = new HtmlParser();
	var cssParser = new CssParser();
	var renderTree = new RenderTree();
	let nodes, styles, tree;

	nodes = htmlParser.parse(`<a>`);
	styles = cssParser.parse(`em { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.deepEqual([], tree[0].styles);

	nodes = htmlParser.parse(`<em>`);
	styles = cssParser.parse(`em { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.notDeepEqual([], tree[0].styles);

	nodes = htmlParser.parse(`<div><p>Hello <em>world</em>!</p></div>`);
	styles = cssParser.parse(`em { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.notDeepEqual([], tree[0].children[0].children[1].styles);

	nodes = htmlParser.parse(`<div><p>`);
	styles = cssParser.parse(`div > p { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.notDeepEqual([], tree[0].children[0].styles);

	nodes = htmlParser.parse(`<div><span><p>`);
	styles = cssParser.parse(`div > p { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.deepEqual([], tree[0].children[0].children[0].styles);

	nodes = htmlParser.parse(`<div><span><p>`);
	styles = cssParser.parse(`div p { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.notDeepEqual([], tree[0].children[0].children[0].styles);

	nodes = htmlParser.parse(`<span><div><p>`);
	styles = cssParser.parse(`div span p { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.deepEqual([], tree[0].children[0].children[0].styles);

	nodes = htmlParser.parse(`<body><div><div><span><p><div><span><a>`);
	styles = cssParser.parse(`div > div > span a { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.notDeepEqual([], tree[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].styles);

	nodes = htmlParser.parse(`<body><div><div><span><p><div><span><a>`);
	styles = cssParser.parse(`body > div > span a { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.deepEqual([], tree[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].styles);

	nodes = htmlParser.parse(`<body><div><div><span><p><div><span><a>`);
	styles = cssParser.parse(`main div > div > span a { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.deepEqual([], tree[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].styles);

	nodes = htmlParser.parse(`<body><div><div><span><p><div><span><a>`);
	styles = cssParser.parse(`body div > div a { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.notDeepEqual([], tree[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].styles);

	nodes = htmlParser.parse(`<body><div><span><div><span><p><div><span><a>`);
	styles = cssParser.parse(`body > div > span a { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.notDeepEqual([], tree[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].styles);

	nodes = htmlParser.parse(`<body><div><span><div><span><p><div><span><a>`);
	styles = cssParser.parse(`body > div span div > span p span > a { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.notDeepEqual([], tree[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].styles);

});

test('Match CSS: Adjacent sibling combinator (+)', async t => {

	var htmlParser = new HtmlParser();
	var cssParser = new CssParser();
	var renderTree = new RenderTree();
	let nodes, styles, tree;

	nodes = htmlParser.parse(`<div><b></b><i></i><b></b><b></b></div>`);
	styles = cssParser.parse(`i + b { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.deepEqual([], tree[0].children[0].styles);
	t.deepEqual([], tree[0].children[1].styles);
	t.notDeepEqual([], tree[0].children[2].styles);
	t.deepEqual([], tree[0].children[3].styles);

	nodes = htmlParser.parse(`<div><b></b><i></i><b></b><a></a></div>`);
	styles = cssParser.parse(`a + b { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.deepEqual([], tree[0].children[0].styles);
	t.deepEqual([], tree[0].children[1].styles);
	t.deepEqual([], tree[0].children[2].styles);
	t.deepEqual([], tree[0].children[3].styles);

	nodes = htmlParser.parse(`<div><div></div><span><i><a></a><b></b></i></span></div>`);
	styles = cssParser.parse(`div + span a + b { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.notDeepEqual([], tree[0].children[1].children[0].children[1].styles);

});

test('Match CSS: General sibling combinator (~)', async t => {

	var htmlParser = new HtmlParser();
	var cssParser = new CssParser();
	var renderTree = new RenderTree();
	let nodes, styles, tree;

	nodes = htmlParser.parse(`<div>
		<span>This is not red.</span>
		<p>Here is a paragraph.</p>
		<code>Here is some code.</code>
		<span>And here is a red span!</span>
		<code>More code...</code>
		<span>And this is a red span!</span>
	</div>`);
	styles = cssParser.parse(`p ~ span { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.deepEqual([], tree[0].children[0].styles);
	t.deepEqual([], tree[0].children[1].styles);
	t.deepEqual([], tree[0].children[2].styles);
	t.notDeepEqual([], tree[0].children[3].styles);
	t.deepEqual([], tree[0].children[4].styles);
	t.notDeepEqual([], tree[0].children[5].styles);

	nodes = htmlParser.parse(`<div>
		<span>This is not red.</span>
		<p>Here is a paragraph.</p>
		<span>This is a red span.</span>
		<p>Here is a paragraph.</p>
		<code>Here is some code.</code>
		<span>And here is a red span!</span>
		<code>More code...</code>
		<span>And this is a red span!</span>
	</div>`);
	styles = cssParser.parse(`p ~ span { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.deepEqual([], tree[0].children[0].styles);
	t.deepEqual([], tree[0].children[1].styles);
	t.notDeepEqual([], tree[0].children[2].styles);
	t.deepEqual([], tree[0].children[3].styles);
	t.deepEqual([], tree[0].children[4].styles);
	t.notDeepEqual([], tree[0].children[5].styles);
	t.deepEqual([], tree[0].children[6].styles);
	t.notDeepEqual([], tree[0].children[7].styles);

	nodes = htmlParser.parse(`<div>
		<span>This is not red.</span>
		<p>Here is a paragraph.</p>
		<span>This is not red.</span>
		<a>a link</a>
		<p>Here is a paragraph.</p>
		<code>Here is some code.</code>
		<span>And here is a red span!</span>
		<code>More code...</code>
		<span>And this is a red span!</span>
	</div>`);
	styles = cssParser.parse(`a + p ~ span { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.deepEqual([], tree[0].children[0].styles);
	t.deepEqual([], tree[0].children[1].styles);
	t.deepEqual([], tree[0].children[2].styles);
	t.deepEqual([], tree[0].children[3].styles);
	t.deepEqual([], tree[0].children[4].styles);
	t.deepEqual([], tree[0].children[5].styles);
	t.notDeepEqual([], tree[0].children[6].styles);
	t.deepEqual([], tree[0].children[7].styles);
	t.notDeepEqual([], tree[0].children[8].styles);

});

test('Match CSS by Classes', async t => {

    var htmlParser = new HtmlParser();
    var cssParser = new CssParser();
    var renderTree = new RenderTree();
    let nodes, styles, tree;

    nodes = htmlParser.parse(`<a class="my-class">`);
    styles = cssParser.parse(`.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.notDeepEqual([], tree[0].styles);

    nodes = htmlParser.parse(`<a class="  my-class ">`);
    styles = cssParser.parse(`.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.notDeepEqual([], tree[0].styles);

    nodes = htmlParser.parse(`<a class="my-class your-class">`);
    styles = cssParser.parse(`.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.notDeepEqual([], tree[0].styles);

    nodes = htmlParser.parse(`<a class="your-class">`);
    styles = cssParser.parse(`.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.deepEqual([], tree[0].styles);

    nodes = htmlParser.parse(`<a>`);
    styles = cssParser.parse(`.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.deepEqual([], tree[0].styles);

    nodes = htmlParser.parse(`<a class="my-class">`);
    styles = cssParser.parse(`a.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.notDeepEqual([], tree[0].styles);

    nodes = htmlParser.parse(`<div><a class="my-class"></div>`);
    styles = cssParser.parse(`div a.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.notDeepEqual([], tree[0].children[0].styles);

    nodes = htmlParser.parse(`<div><a class=" my-class "></div>`);
    styles = cssParser.parse(`div.noclass a.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.deepEqual([], tree[0].children[0].styles);

    nodes = htmlParser.parse(`<div class="your-class"><a class=" my-class "></div>`);
    styles = cssParser.parse(`div.your-class a.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.notDeepEqual([], tree[0].children[0].styles);

    nodes = htmlParser.parse(`<span class="your-class"><a class=" my-class "></span>`);
    styles = cssParser.parse(`div.your-class a.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.deepEqual([], tree[0].children[0].styles);
});

test('Match CSS by ID', async t => {

    var htmlParser = new HtmlParser();
    var cssParser = new CssParser();
    var renderTree = new RenderTree();
    let nodes, styles, tree;

    nodes = htmlParser.parse(`<a id="one">`);
    styles = cssParser.parse(`#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.notDeepEqual([], tree[0].styles);

    nodes = htmlParser.parse(`<a id="  one ">`);
    styles = cssParser.parse(`#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.notDeepEqual([], tree[0].styles);

    nodes = htmlParser.parse(`<a class="another">`);
    styles = cssParser.parse(`#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.deepEqual([], tree[0].styles);

    nodes = htmlParser.parse(`<a>`);
    styles = cssParser.parse(`#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.deepEqual([], tree[0].styles);

    nodes = htmlParser.parse(`<a id="one">`);
    styles = cssParser.parse(`a#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.notDeepEqual([], tree[0].styles);

    nodes = htmlParser.parse(`<a class="my-class" id="one">`);
    styles = cssParser.parse(`a.my-class#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.notDeepEqual([], tree[0].styles);

    nodes = htmlParser.parse(`<div><a id="one"></div>`);
    styles = cssParser.parse(`div a#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.notDeepEqual([], tree[0].children[0].styles);

    nodes = htmlParser.parse(`<div><a id=" one "></div>`);
    styles = cssParser.parse(`div#noid a#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.deepEqual([], tree[0].children[0].styles);

    nodes = htmlParser.parse(`<div id="another"><a id=" one "></div>`);
    styles = cssParser.parse(`div#another a#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.notDeepEqual([], tree[0].children[0].styles);

    nodes = htmlParser.parse(`<span id="another"><a id="one"></span>`);
    styles = cssParser.parse(`div#another a#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.deepEqual([], tree[0].children[0].styles);
});

test('Test Inline Styles', async t => {

    var htmlParser = new HtmlParser();
    var cssParser = new CssParser();
    var renderTree = new RenderTree();
    let nodes, styles, tree;

    nodes = htmlParser.parse(`<h1 class="title" style="border: 1px solid red; padding-left: 10px">Title</h1>`);
    tree = renderTree.createRenderTree(nodes, []);
    let expectedStyles = [{"specificity":[2,1,0,0,0],"selectors":[{"inline":true}],"declarations":[{"name":"border","value":[{"type":"unit","value":1,"unit":"px"},{"type":"keyword","value":"solid"},{"type":"color","value":"red"}]},{"name":"padding-left","value":[{"type":"unit","value":10,"unit":"px"}]}]}];
    t.is(JSON.stringify(expectedStyles), JSON.stringify(tree[0].styles));

    nodes = htmlParser.parse(`<h1 style=" "></h1>`);
    tree = renderTree.createRenderTree(nodes, []);
    t.is(JSON.stringify([]), JSON.stringify(tree[0].styles));

    nodes = htmlParser.parse(`<h1 style=".we.we-=()$s"></h1>`);
    tree = renderTree.createRenderTree(nodes, []);
    t.is(JSON.stringify([]), JSON.stringify(tree[0].styles));

});