
import test from 'ava';

import {CssParser} from '../js/CssParser'

test('Simple Rules', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('h1 {}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,0],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[]}]');

	nodes = parser.parse('h1{   }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,0],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[]}]');

	nodes = parser.parse('h1, h2 {}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,0],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]},{"specificity":[0,0,0,0],"selectors":[{"type":"element","combinator":"root","selector":"h2","arguments":[]}]}],"declarations":[]}]');

	nodes = parser.parse('h1 div, h2 a:visited {}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,0],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]},{"type":"element","combinator":"root","selector":"div","arguments":[]}]},{"specificity":[0,0,0,0],"selectors":[{"type":"element","combinator":"root","selector":"h2","arguments":[]},{"type":"element","combinator":"root","selector":"a:visited","arguments":[]}]}],"declarations":[]}]');

});
/*
test('Class Rules', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('.simple {}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[[{"type":"element","selector":"h1","arguments":[]}]],"declarations":[]}]');

});

test('Function Rules', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse(':matches(div) h1 {}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[":matches(div, span) h1"],"attributes":[]}]');

	nodes = parser.parse(':matches(div, span.class) h1 {}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[":matches(div, span) h1"],"attributes":[]}]');

	nodes = parser.parse('p:not(:first-child, .special) {}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":["p:not(:first-child, .special)"],"attributes":[]}]');

	//

});

test('Attribute Selector Rules', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('a[href*="foo,bar"] {}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":["a[href*=\\"foo,bar\\"]"],"attributes":[]}]');

});
*/

test('Simple Declarations', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('h1 { color: red; }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,0],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[{"name":"color","value":"red"}]}]');

	nodes = parser.parse('h1 { color : red; }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,0],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[{"name":"color","value":"red"}]}]');

	nodes = parser.parse('h1 {color:red;}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,0],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[{"name":"color","value":"red"}]}]');

	nodes = parser.parse('h1 {color:red}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,0],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[{"name":"color","value":"red"}]}]');

});

test('Multiple Declarations', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('h1 { color: red; font-family:helvetica,arial,sans-serif; }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,0],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[{"name":"color","value":"red"},{"name":"font-family","value":"helvetica,arial,sans-serif"}]}]');

	// duplicate rules, use latest only
	nodes = parser.parse('h1 { color: red; color: blue; }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,0],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[{"name":"color","value":"blue"}]}]');

});

test('Comments', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('/* this is a comment */');
	t.is(JSON.stringify(nodes), '[{"type":"comment","content":" this is a comment "}]');

});
