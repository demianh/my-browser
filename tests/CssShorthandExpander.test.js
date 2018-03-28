
import test from 'ava';

import {HtmlParser} from '../js/HtmlParser'
import {CssParser} from '../js/CssParser'
import {RenderTree} from '../js/RenderTree'


test('Padding Shorthand Property', async t => {

	var htmlParser = new HtmlParser();
	var cssParser = new CssParser();
	var renderTree = new RenderTree();
	let nodes, styles, tree;

	nodes = htmlParser.parse(`<a>`);
	styles = cssParser.parse(`a { padding: 10px 0 5px;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.deepEqual([{type: 'unit', unit: 'px', value: 10}], tree[0].computedStyles['padding-top']);
	t.deepEqual([{type: 'unit', unit: '', value: 0}], tree[0].computedStyles['padding-right']);
	t.deepEqual([{type: 'unit', unit: 'px', value: 5}], tree[0].computedStyles['padding-bottom']);
	t.deepEqual([{type: 'unit', unit: '', value: 0}], tree[0].computedStyles['padding-left']);
});

test('Margin Shorthand Property', async t => {

	var htmlParser = new HtmlParser();
	var cssParser = new CssParser();
	var renderTree = new RenderTree();
	let nodes, styles, tree;

	nodes = htmlParser.parse(`<a><b></b></a>`);
	styles = cssParser.parse(`a { margin-bottom: 33px; margin: 10px 50%; margin-left: 22em;}`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.deepEqual([{type: 'unit', unit: 'px', value: 10}], tree[0].computedStyles['margin-top']);
	t.deepEqual([{type: 'unit', unit: '%', value: 50}], tree[0].computedStyles['margin-right']);
	t.deepEqual([{type: 'unit', unit: 'px', value: 10}], tree[0].computedStyles['margin-bottom']);

	// is overwritten with last rule
	t.deepEqual([{type: 'unit', unit: 'em', value: 22}], tree[0].computedStyles['margin-left']);

	// should not inherit
	t.deepEqual([{type: 'unit', unit: '', value: 0}], tree[0].children[0].computedStyles['margin-left']);
});

test('Border Shorthand Property', async t => {

	var htmlParser = new HtmlParser();
	var cssParser = new CssParser();
	var renderTree = new RenderTree();
	let nodes, styles, tree;

	nodes = htmlParser.parse(`<a><b></b></a>`);
	styles = cssParser.parse(`a { border: 1px solid red; }`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.deepEqual([{type: 'color', value: 'red'}], tree[0].computedStyles['border-color']);
	t.deepEqual([{type: 'color', value: 'red'}], tree[0].computedStyles['border-left-color']);
	t.deepEqual([{type: 'keyword', value: 'solid'}], tree[0].computedStyles['border-style']);
	t.deepEqual([{type: 'keyword', value: 'solid'}], tree[0].computedStyles['border-bottom-style']);
	t.deepEqual([{type: 'unit', unit: 'px', value: 1}], tree[0].computedStyles['border-width']);
	t.deepEqual([{type: 'unit', unit: 'px', value: 1}], tree[0].computedStyles['border-top-width']);

	nodes = htmlParser.parse(`<a><b></b></a>`);
	styles = cssParser.parse(`a { border: 1px solid red; border-bottom-color: blue; border-width: 2px 4px; border-style: dotted; }`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.deepEqual([{type: 'color', value: 'red'}], tree[0].computedStyles['border-color']);
	t.deepEqual([{type: 'color', value: 'red'}], tree[0].computedStyles['border-left-color']);
	t.deepEqual([{type: 'color', value: 'blue'}], tree[0].computedStyles['border-bottom-color']);
	t.deepEqual([{type: 'keyword', value: 'dotted'}], tree[0].computedStyles['border-style']);
	t.deepEqual([{type: 'keyword', value: 'dotted'}], tree[0].computedStyles['border-bottom-style']);
	t.deepEqual([{type: 'unit', unit: 'px', value: 2}], tree[0].computedStyles['border-top-width']);
	t.deepEqual([{type: 'unit', unit: 'px', value: 4}], tree[0].computedStyles['border-right-width']);
	t.deepEqual([{type: 'unit', unit: 'px', value: 2}, {type: 'unit', unit: 'px', value: 4}], tree[0].computedStyles['border-width']);

	nodes = htmlParser.parse(`<a><b></b></a>`);
	styles = cssParser.parse(`a { border: 1px solid red; border-top: 2px dotted blue; }`);
	tree = renderTree.createRenderTree(nodes, styles);
	t.deepEqual([{type: 'color', value: 'red'}], tree[0].computedStyles['border-color']);
	t.deepEqual([{type: 'color', value: 'red'}], tree[0].computedStyles['border-left-color']);
	t.deepEqual([{type: 'color', value: 'blue'}], tree[0].computedStyles['border-top-color']);
	t.deepEqual([{type: 'keyword', value: 'solid'}], tree[0].computedStyles['border-style']);
	t.deepEqual([{type: 'keyword', value: 'dotted'}], tree[0].computedStyles['border-top-style']);
	t.deepEqual([{type: 'unit', unit: 'px', value: 2}], tree[0].computedStyles['border-top-width']);
	t.deepEqual([{type: 'unit', unit: 'px', value: 1}], tree[0].computedStyles['border-right-width']);
});
