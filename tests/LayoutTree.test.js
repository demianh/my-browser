
import test from 'ava';

import {HtmlParser} from '../js/HtmlParser'
import {CssParser} from '../js/CssParser'
import {RenderTree} from '../js/RenderTree'
import {LayoutTree} from '../js/LayoutTree'

function createLayoutTree(html, css, width, height) {
	let htmlParser = new HtmlParser();
	let cssParser = new CssParser();
	let renderTree = new RenderTree();
	let layoutTree = new LayoutTree();

	let baseCss = 'div, p {display: block;}';

	let nodes = htmlParser.parse(html);
	let styles = cssParser.parse(baseCss + (css || ''));
	let tree = renderTree.createRenderTree(nodes, styles);
	return layoutTree.createLayoutTree(tree, width || 200, height || 400);
}

test('Create Layout Tree', async t => {

	let tree = createLayoutTree('<div>Hallo</div>', '', 200, 400);
	t.is(200, tree[0].width);
	t.is(16, tree[0].height);
	t.is(0, tree[0].top);
	t.is(0, tree[0].left);

});

test('display:block Width', async t => {

	let tree;

	tree = createLayoutTree('<div>Hallo</div>', '', 200, 400);
	t.is(200, tree[0].width);

	tree = createLayoutTree('<div><p>Paragraph</p></div>', 'div {padding: 10px;}', 200, 400);
	t.is(200, tree[0].width);
	t.is(180, tree[0].children[0].width);

	tree = createLayoutTree('<div><p>Paragraph</p></div>', 'div {padding: 10px; margin-left: 5px;}', 200, 400);
	t.is(200, tree[0].width);
	t.is(175, tree[0].children[0].width);

	tree = createLayoutTree('<div><p>Paragraph</p></div>', 'div {padding: 10px; margin-left: 5px; border: 1px solid black;}', 200, 400);
	t.is(200, tree[0].width);
	t.is(173, tree[0].children[0].width);

	tree = createLayoutTree('<div style="width: 128px">Hallo</div>', '', 200, 400);
	t.is(128, tree[0].width);

	tree = createLayoutTree('<div style="width: 80%">Hallo</div>', '', 200, 400);
	t.is(160, tree[0].width);

});

test('display:inline Width', async t => {

	let tree;

	tree = createLayoutTree('<span>Hallo</span>', '', 200, 400);
	t.is(40, tree[0].width);
	t.is(40, tree[0].children[0].width);

	tree = createLayoutTree('<span><span>Hallo</span><span>Welt</span></span>', '', 200, 400);
	t.is(72, tree[0].width);
	t.is(40, tree[0].children[0].width);
	t.is(32, tree[0].children[1].width);

	tree = createLayoutTree('<span>Hallo</span>', 'span {padding: 100px;}', 200, 400);
	t.is(240, tree[0].width);
	t.is(40, tree[0].children[0].width);

	tree = createLayoutTree('<span>Hallo<span>Hallo</span>Hallo</span>', 'span {padding: 100px;}', 200, 400);
	t.is(520, tree[0].width);
	t.is(40, tree[0].children[0].width);
	t.is(240, tree[0].children[1].width);

});

test('display:inline Position', async t => {

	let tree;

	tree = createLayoutTree('<span><span>Hallo</span><span>Welt</span></span>', '', 200, 400);
	t.is(72, tree[0].width);
	t.is(40, tree[0].children[0].width);
	t.is(0, tree[0].children[0].top);
	t.is(0, tree[0].children[0].left);
	// <span> 2 should be after first on same line
	t.is(32, tree[0].children[1].width);
	t.is(0, tree[0].children[1].top);
	t.is(40, tree[0].children[1].left);

	tree = createLayoutTree('<span>Hallo<span>Welt</span>!</span>', '', 200, 400);
	t.is(80, tree[0].width);
	t.is(40, tree[0].children[0].width);
	t.is(0, tree[0].children[0].top);
	t.is(0, tree[0].children[0].left);
	// <span> should be on the same line as "Hallo"
	t.is(32, tree[0].children[1].width);
	t.is(0, tree[0].children[1].top);
	t.is(40, tree[0].children[1].left);
	// "Welt" should be the same as the <span>
	t.is(32, tree[0].children[1].children[0].width);
	t.is(0, tree[0].children[1].children[0].top);
	t.is(40, tree[0].children[1].children[0].left);
	// "!" should be after <span>
	t.is(8, tree[0].children[2].width);
	t.is(0, tree[0].children[2].top);
	t.is(72, tree[0].children[2].left);

});

test('break text in block element', async t => {

	let tree;

	tree = createLayoutTree('<div>This text should wrap to multiple lines. We should get a few rows of text on multiple lines.</div>', '', 200, 400);
	t.is(200, tree[0].width);
	t.is(200, tree[0].children[0].width);
	t.is(
		JSON.stringify([
			'This text should wrap to',
			'multiple lines. We should',
			'get a few rows of text on',
			'multiple lines.'
		]),
		JSON.stringify(tree[0].children[0].textLines)
	);

	tree = createLayoutTree('<div>This text should wrap to multiple lines.</div>', '', 200, 400);
	t.is(200, tree[0].width);
	t.is(192, tree[0].children[0].width);
	t.is(
		JSON.stringify([
			'This text should wrap to',
			'multiple lines.'
		]),
		JSON.stringify(tree[0].children[0].textLines)
	);

});

/*
// TODO: make inline text breaking work
test('break text in inline element', async t => {

	let tree;

	tree = createLayoutTree('<span>This text should wrap to multiple lines. We should get a few rows of text on multiple lines.</span>', '', 200, 400);
	t.is(200, tree[0].width);
	t.is(200, tree[0].children[0].width);
	t.is(
		JSON.stringify([
			'This text should wrap to',
			'multiple lines. We should',
			'get a few rows of text on',
			'multiple lines.'
		]),
		JSON.stringify(tree[0].children[0].textLines)
	);

});
*/
