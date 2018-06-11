
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

	let nodes = htmlParser.parse(html);
	let styles = cssParser.parse(css || '');
	let tree = renderTree.createRenderTree(nodes, styles);
	return layoutTree.createLayoutTree(tree, width || 200, height || 400);
}

test('Create Layout Tree', async t => {

	let tree = createLayoutTree('<div>Hallo</div>', 'div {display: block;}', 200, 400);
	t.is(200, tree[0].width);
	//t.is(400, tree[0].height);
	//t.is(0, tree[0].top);
	//t.is(0, tree[0].left);

});

test('display:block Width', async t => {

	let tree;

	tree = createLayoutTree('<div>Hallo</div>', 'div {display: block;}', 200, 400);
	t.is(200, tree[0].width);

	tree = createLayoutTree('<div><p>Paragraph</p></div>', 'div {display: block; padding: 10px;} p {display: block;}', 200, 400);
	t.is(200, tree[0].width);
	t.is(180, tree[0].children[0].width);

	tree = createLayoutTree('<div><p>Paragraph</p></div>', 'div {display: block; padding: 10px; margin-left: 5px;} p {display: block;}', 200, 400);
	t.is(200, tree[0].width);
	t.is(175, tree[0].children[0].width);

	tree = createLayoutTree('<div><p>Paragraph</p></div>', 'div {display: block; padding: 10px; margin-left: 5px; border: 1px solid black;} p {display: block;}', 200, 400);
	t.is(200, tree[0].width);
	t.is(173, tree[0].children[0].width);

});

test('display:inline Width', async t => {

	let tree;

	tree = createLayoutTree('<span>Hallo</span>', '', 200, 400);
	t.is(40, tree[0].width);
	t.is(40, tree[0].children[0].width);

	tree = createLayoutTree('<div><span>Hallo</span><span>Welt</span></div>', '', 200, 400);
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

	tree = createLayoutTree('<div><span>Hallo</span><span>Welt</span></div>', '', 200, 400);
	t.is(72, tree[0].width);
	t.is(40, tree[0].children[0].width);
	t.is(0, tree[0].children[0].top);
	t.is(0, tree[0].children[0].left);
	// <span> 2 should be after first on same line
	t.is(32, tree[0].children[1].width);
	t.is(0, tree[0].children[1].top);
	t.is(40, tree[0].children[1].left);

	tree = createLayoutTree('<div>Hallo<span>Welt</span>!</div>', '', 200, 400);
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

