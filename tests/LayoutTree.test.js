
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

	let tree = createLayoutTree('<div>Hallo</div>', '', 200, 400);
	t.is(200, tree[0].width);
	//t.is(400, tree[0].height);
	//t.is(0, tree[0].top);
	//t.is(0, tree[0].left);

});

test('Box Width', async t => {

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

});

