
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
test('Match CSS: Child (>) and descendent combinator (whitespace)', async t => {

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

test('Match CSS: Adjacent sibling combinator (+)', async t => {

	var htmlParser = new HtmlParser();
	var cssParser = new CssParser();
	var renderTree = new RenderTree();
	let nodes, styles, tree;

	nodes = htmlParser.parse(`<div><b></b><i></i><b></b><b></b></div>`);
	styles = cssParser.parse(`i + b { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[0].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[1].styles));
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[2].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[3].styles));

	nodes = htmlParser.parse(`<div><b></b><i></i><b></b><a></a></div>`);
	styles = cssParser.parse(`a + b { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[0].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[1].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[2].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[3].styles));

	nodes = htmlParser.parse(`<div><div></div><span><i><a></a><b></b></i></span></div>`);
	styles = cssParser.parse(`div + span a + b { color: red;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[1].children[0].children[1].styles));

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
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[0].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[1].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[2].styles));
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[3].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[4].styles));
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[5].styles));

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
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[0].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[1].styles));
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[2].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[3].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[4].styles));
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[5].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[6].styles));
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[7].styles));

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
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[0].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[1].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[2].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[3].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[4].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[5].styles));
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[6].styles));
	t.is(JSON.stringify([]), JSON.stringify(tree[0].children[7].styles));
	t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[8].styles));

});

test('Match CSS by Classes', async t => {

    var htmlParser = new HtmlParser();
    var cssParser = new CssParser();
    var renderTree = new RenderTree();
    let nodes, styles, tree;

    nodes = htmlParser.parse(`<a class="my-class">`);
    styles = cssParser.parse(`.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify(styles), JSON.stringify(tree[0].styles));

    nodes = htmlParser.parse(`<a class="  my-class ">`);
    styles = cssParser.parse(`.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify(styles), JSON.stringify(tree[0].styles));

    nodes = htmlParser.parse(`<a class="my-class your-class">`);
    styles = cssParser.parse(`.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify(styles), JSON.stringify(tree[0].styles));

    nodes = htmlParser.parse(`<a class="your-class">`);
    styles = cssParser.parse(`.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify([]), JSON.stringify(tree[0].styles));

    nodes = htmlParser.parse(`<a>`);
    styles = cssParser.parse(`.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify([]), JSON.stringify(tree[0].styles));

    nodes = htmlParser.parse(`<a class="my-class">`);
    styles = cssParser.parse(`a.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify(styles), JSON.stringify(tree[0].styles));

    nodes = htmlParser.parse(`<div><a class="my-class"></div>`);
    styles = cssParser.parse(`div a.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[0].styles));

    nodes = htmlParser.parse(`<div><a class=" my-class "></div>`);
    styles = cssParser.parse(`div.noclass a.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify([]), JSON.stringify(tree[0].children[0].styles));

    nodes = htmlParser.parse(`<div class="your-class"><a class=" my-class "></div>`);
    styles = cssParser.parse(`div.your-class a.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[0].styles));

    nodes = htmlParser.parse(`<span class="your-class"><a class=" my-class "></span>`);
    styles = cssParser.parse(`div.your-class a.my-class { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify([]), JSON.stringify(tree[0].children[0].styles));
});

test('Match CSS by ID', async t => {

    var htmlParser = new HtmlParser();
    var cssParser = new CssParser();
    var renderTree = new RenderTree();
    let nodes, styles, tree;

    nodes = htmlParser.parse(`<a id="one">`);
    styles = cssParser.parse(`#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify(styles), JSON.stringify(tree[0].styles));

    nodes = htmlParser.parse(`<a id="  one ">`);
    styles = cssParser.parse(`#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify(styles), JSON.stringify(tree[0].styles));

    nodes = htmlParser.parse(`<a class="another">`);
    styles = cssParser.parse(`#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify([]), JSON.stringify(tree[0].styles));

    nodes = htmlParser.parse(`<a>`);
    styles = cssParser.parse(`#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify([]), JSON.stringify(tree[0].styles));

    nodes = htmlParser.parse(`<a id="one">`);
    styles = cssParser.parse(`a#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify(styles), JSON.stringify(tree[0].styles));

    nodes = htmlParser.parse(`<a class="my-class" id="one">`);
    styles = cssParser.parse(`a.my-class#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify(styles), JSON.stringify(tree[0].styles));

    nodes = htmlParser.parse(`<div><a id="one"></div>`);
    styles = cssParser.parse(`div a#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[0].styles));

    nodes = htmlParser.parse(`<div><a id=" one "></div>`);
    styles = cssParser.parse(`div#noid a#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify([]), JSON.stringify(tree[0].children[0].styles));

    nodes = htmlParser.parse(`<div id="another"><a id=" one "></div>`);
    styles = cssParser.parse(`div#another a#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify(styles), JSON.stringify(tree[0].children[0].styles));

    nodes = htmlParser.parse(`<span id="another"><a id="one"></span>`);
    styles = cssParser.parse(`div#another a#one { color: red;}`);
    tree = renderTree.createRenderTree(nodes, styles);
    t.is(JSON.stringify([]), JSON.stringify(tree[0].children[0].styles));
});