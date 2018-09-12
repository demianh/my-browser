
import test from 'ava';

import {CssParser} from '../js/CssParser'

test('Simple Rules', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('');
	t.is(JSON.stringify(nodes), '[]');

	nodes = parser.parse('h1 {}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h1"}]}],"declarations":[]}]');

	nodes = parser.parse('h1{   }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h1"}]}],"declarations":[]}]');

	nodes = parser.parse('h1, h2 {}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h1"}]},{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h2"}]}],"declarations":[]}]');

	nodes = parser.parse('h1 div {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,0,2],"selectors":[
			{"combinator":"root","element":"h1"},
			{"combinator":"descendant","element":"div"}
		]}],"declarations":[]}]));

	nodes = parser.parse('h1 div, h2 a custom-element {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,0,2],"selectors":
		[{"combinator":"root","element":"h1"},
		{"combinator":"descendant","element":"div"}
		]},{"specificity":[2,0,0,0,3],"selectors":
		[{"combinator":"root","element":"h2"},
		{"combinator":"descendant","element":"a"},
		{"combinator":"descendant","element":"custom-element"}
		]}],"declarations":[]}]));

});

test('Class Rules', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('.simple {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,1,0],"selectors":[
			{"combinator":"root","classes":["simple"]},
		]}],"declarations":[]}]));

	nodes = parser.parse('.simple .another-one{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,2,0],"selectors":[
			{"combinator":"root","classes":["simple"]},
			{"combinator":"descendant","classes":["another-one"]}
		]}],"declarations":[]}]));

	nodes = parser.parse('.simple.another-one{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,2,0],"selectors":[
			{"combinator":"root","classes":["simple","another-one"]}
		]}],"declarations":[]}]));

	nodes = parser.parse('h1.simple{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,1,1],"selectors":[
			{"combinator":"root","element":"h1","classes":["simple"]}
		]}],"declarations":[]}]));

	nodes = parser.parse('h1.simple .bla.blub.bla.foo{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,5,1],"selectors":[
		{"combinator":"root","element":"h1","classes":["simple"]},
		{"combinator":"descendant","classes":["bla","blub","bla","foo"]}
		]}],"declarations":[]}]));

	nodes = parser.parse('div#id.class1.class2.class1{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,1,3,1],"selectors":[
			{"combinator":"root","element":"div","ids":["id"],"classes":["class1","class2","class1"]}
		]}],"declarations":[]}]));
});


test('ID Rules', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('#simple {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,1,0,0],"selectors":[
			{"combinator":"root","ids":["simple"]}
		]}],"declarations":[]}]));

	nodes = parser.parse('#simple #another-one{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,2,0,0],"selectors":[
			{"combinator":"root","ids":["simple"]},
			{"combinator":"descendant","ids":["another-one"]}
		]}],"declarations":[]}]));

	nodes = parser.parse('h1#simple   {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,1,0,1],"selectors":[
			{"combinator":"root","element":"h1","ids":["simple"]}
		]}],"declarations":[]}]));

	nodes = parser.parse('h1#simple #bla  #blub #bla.foo{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,4,1,1],"selectors":[
		{"combinator":"root","element":"h1","ids":["simple"]},
		{"combinator":"descendant","ids":["bla"]},
		{"combinator":"descendant","ids":["blub"]},
		{"combinator":"descendant","ids":["bla"],"classes":["foo"]}
		]}],"declarations":[]}]));

});

test('Pseudo Rules', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('::any-pseudo {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[
			{"combinator":"root","pseudoElements":["any-pseudo"]}
		]}],"declarations":[]}]));

	nodes = parser.parse('input::-webkit-inner-spin-button{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,0,2],"selectors":[
			{"combinator":"root","element":"input","pseudoElements":["-webkit-inner-spin-button"]}
		]}],"declarations":[]}]));

	nodes = parser.parse(':hover   {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,1,0],"selectors":[
			{"combinator":"root","pseudoClasses":["hover"]}
		]}],"declarations":[]}]));

	nodes = parser.parse('a:hover   {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,1,1],"selectors":[
			{"combinator":"root","element":"a","pseudoClasses":["hover"]}
		]}],"declarations":[]}]));

});

test('Attribute Selectors', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse("[dir='ltr'] {}");
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,1,0],"selectors":[
			{"combinator":"root","attributes":["dir=\'ltr\'"]}
		]}],"declarations":[]}]));

	nodes = parser.parse('[disabled]{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,1,0],"selectors":[
			{"combinator":"root","attributes":["disabled"]}
		]}],"declarations":[]}]));

	nodes = parser.parse('[ dir = "test" ] {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,1,0],"selectors":[
			{"combinator":"root","attributes":[" dir = \"test\" "]}
		]}],"declarations":[]}]));

	nodes = parser.parse('[ dir = test ] {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,1,0],"selectors":[
			{"combinator":"root","attributes":[" dir = test "]}
		]}],"declarations":[]}]));

	nodes = parser.parse('[dir=test] {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,1,0],"selectors":[
			{"combinator":"root","attributes":["dir=test"]}
		]}],"declarations":[]}]));

	nodes = parser.parse("._class[disabled]:not([disabled=false]){}");
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[
		{"specificity":[2,0,0,2,0],"selectors":[
			{"combinator":"root","classes":["_class"],"attributes":["disabled"],"functions":[{"name":"not","arguments":"[disabled=false]"}]}
		]}
		],"declarations":[]}]));

	nodes = parser.parse('a[href*="foo,bar"] {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,1,1],"selectors":[
			{"combinator":"root","element":"a","attributes":["href*=\"foo,bar\""]}
		]}],"declarations":[]}]));

	// more things that should be supported
	// [dir="tes'[t"] {}
	// [dir='tes[t""'] {}
});

test(':not() Selectors', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse(":not(h1) {}");
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[
		{"specificity":[2,0,0,0,0],"selectors":[
			{"combinator":"root","functions":[{"name":"not","arguments":"h1"}]}
		]}],"declarations":[]}]));

	nodes = parser.parse(":not (h1) {}");
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[
		{"specificity":[2,0,0,0,0],"selectors":[
			{"combinator":"root","functions":[{"name":"not","arguments":"h1"}]}
		]}],"declarations":[]}]));

	nodes = parser.parse(":not (h1, h2, .class,#id) {}");
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[
		{"specificity":[2,0,0,0,0],"selectors":[
			{"combinator":"root","functions":[{"name":"not","arguments":"h1, h2, .class,#id"}]}
		]}],"declarations":[]}]));

	nodes = parser.parse(":not(h1) :not(h2):not(h3) {}");
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[
		{"specificity":[2,0,0,0,0],"selectors":[
			{"combinator":"root","functions":[{"name":"not","arguments":"h1"}]},
			{"combinator":"descendant","functions":[{"name":"not","arguments":"h2"}, {"name":"not","arguments":"h3"}]}
		]}],"declarations":[]}]));

	nodes = parser.parse("h1:not(.title) {}");
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[
		{"specificity":[2,0,0,0,1],"selectors":[
			{"combinator":"root","element":"h1","functions":[{"name":"not","arguments":".title"}]}
		]}],"declarations":[]}]));

	// not yet supported
	// - fix specificity
	// - parse arguments as selectors
});

test('Function Rules', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse(':matches(div) h1 {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[
			{"combinator":"root","functions":[{"name":"matches","arguments":"div"}]},
			{"combinator":"descendant","element":"h1"}
		]}],"declarations":[]}]));

	nodes = parser.parse(':matches(div, span.class) h1 {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[
			{"combinator":"root","functions":[{"name":"matches","arguments":"div, span.class"}]},
			{"combinator":"descendant","element":"h1"}
		]}],"declarations":[]}]));

	nodes = parser.parse('p:not(:first-child, .special) {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[
			{"combinator":"root","element":"p","functions":[{"name":"not","arguments":":first-child, .special"}]}
		]}],"declarations":[]}]));

	nodes = parser.parse('tr:nth-child(even){}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[
			{"combinator":"root","element":"tr","functions":[{"name":"nth-child","arguments":"even"}]}
		]}],"declarations":[]}]));
});

test('Combinators', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('a > b {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,0,2],"selectors":[
			{"combinator":"root","element":"a"},
			{"combinator":"child","element":"b"}
		]}],"declarations":[]}]));

	nodes = parser.parse('a>b{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,0,2],"selectors":[
			{"combinator":"root","element":"a"},
			{"combinator":"child","element":"b"}
		]}],"declarations":[]}]));

	nodes = parser.parse('h1 > .yeah{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,1,1],"selectors":[
			{"combinator":"root","element":"h1"},
			{"combinator":"child","classes":["yeah"]},
		]}],"declarations":[]}]));

	nodes = parser.parse('h1 + div#yeah{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,1,0,2],"selectors":[
			{"combinator":"root","element":"h1"},
			{"combinator":"adjacent","element":"div","ids":["yeah"]}
		]}],"declarations":[]}]));

	nodes = parser.parse('my-element~.your-class{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,1,1],"selectors":[
			{"combinator":"root","element":"my-element"},
			{"combinator":"sibling","classes":["your-class"]}
		]}],"declarations":[]}]));

	nodes = parser.parse('li:first-of-type + li {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,1,2],"selectors":[
			{"combinator":"root","element":"li","pseudoClasses":["first-of-type"]},
			{"combinator":"adjacent","element":"li"}
		]}],"declarations":[]}]));

});

test('Simple Declarations', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('h1 { color: red; }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h1"}]}],"declarations":[{"name":"color","value":[{"type":"color","value":"red"}]}]}]');

	nodes = parser.parse('h1 { color : red; }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h1"}]}],"declarations":[{"name":"color","value":[{"type":"color","value":"red"}]}]}]');

	nodes = parser.parse('h1 {color:red;}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h1"}]}],"declarations":[{"name":"color","value":[{"type":"color","value":"red"}]}]}]');

	nodes = parser.parse('h1 {color:red}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h1"}]}],"declarations":[{"name":"color","value":[{"type":"color","value":"red"}]}]}]');

	nodes = parser.parse(`col {
			display: table-column;
		}`);
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"col"}]}],"declarations":[{"name":"display","value":[{"type":"keyword","value":"table-column"}]}]}]');

});

test('Multiple Declarations', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('h1 { color: red; font-family:helvetica,arial,sans-serif; }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h1"}]}],"declarations":[{"name":"color","value":[{"type":"color","value":"red"}]},{"name":"font-family","value":[{"type":"keyword","value":"helvetica,arial,sans-serif"}]}]}]');

	// duplicate rules, use latest only
	nodes = parser.parse('h1 { color: red; color: blue; }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h1"}]}],"declarations":[{"name":"color","value":[{"type":"color","value":"blue"}]}]}]');

});

test('Unit Declarations', async t => {
	var parser = new CssParser();
	var nodes;

	// known units:
	// em, ex, %, px, cm, mm, in, pt, pc, ch, rem, vh, vw, vmin, vmax, vm

	nodes = parser.parse('h1 { padding: 10px; }');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[
			{"combinator":"root","element":"h1"}
		]}],"declarations":[
			{"name":"padding","value":[{"type":"unit","value":10,"unit":"px"}]}
		]}]));

	nodes = parser.parse('h1 { height: 50%; }');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[
			{"combinator":"root","element":"h1"}
		]}],"declarations":[
			{"name":"height","value":[{"type":"unit","value":50,"unit":"%"}]}
		]}]));

	nodes = parser.parse('h1 { height: -1.23px; }');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[
			{"combinator":"root","element":"h1"}
		]}],"declarations":[
			{"name":"height","value":[{"type":"unit","value":-1.23,"unit":"px"}]}
		]}]));

	nodes = parser.parse('h1 { height:.2; }');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[
			{"combinator":"root","element":"h1"}
		]}],"declarations":[
			{"name":"height","value":[{"type":"unit","value":0.2,"unit":""}]}
		]}]));

	nodes = parser.parse('h1 { height: 0; }');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[
			{"combinator":"root","element":"h1"}
		]}],"declarations":[
			{"name":"height","value":[{"type":"unit","value":0,"unit":""}]}
		]}]));

	// transition: opacity 0.5s ease-out,left 0.5s ease-out;
});

test('Keyword Declarations', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('h1 { font-size: small; }');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[
			{"combinator":"root","element":"h1"}
		]}],"declarations":[
			{"name":"font-size","value":[{"type":"keyword","value":"small"}]}
		]}]));
});

test('Invalid Declarations', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('h1 { color: red; ha- this !$ in()v@lid }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h1"}]}],"declarations":[{"name":"color","value":[{"type":"color","value":"red"}]}]}]');

});

test('Functions in Declarations', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('h1 {background: url("bla") white}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h1"}]}],"declarations":[{"name":"background","value":[{"type":"function","value":"url","arguments":"\\"bla\\""},{"type":"color","value":"white"}]}]}]');

	nodes = parser.parse('h1 {transform: scale(0, 0)}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h1"}]}],"declarations":[{"name":"transform","value":[{"type":"function","value":"scale","arguments":"0, 0"}]}]}]');

	nodes = parser.parse('h1 { background-image: -webkit-linear-gradient(top, #fff, #f8f8f8);}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h1"}]}],"declarations":[{"name":"background-image","value":[{"type":"function","value":"-webkit-linear-gradient","arguments":"top, #fff, #f8f8f8"}]}]}]');

	nodes = parser.parse('h1 { transition: box-shadow 200ms cubic-bezier(0.4, 0 , 0.2 , 1 ) }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h1"}]}],"declarations":[{"name":"transition","value":[{"type":"keyword","value":"box-shadow"},{"type":"unit","value":200,"unit":"ms"},{"type":"function","value":"cubic-bezier","arguments":"0.4, 0 , 0.2 , 1"}]}]}]');

	nodes = parser.parse('h1 { background-image: linear-gradient(top,#4d90fe,#4787ed); }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h1"}]}],"declarations":[{"name":"background-image","value":[{"type":"function","value":"linear-gradient","arguments":"top,#4d90fe,#4787ed"}]}]}]');

	//nodes = parser.parse('h1 { box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16),0 0 0 1px rgba(0,0,0,0.08)}');
	//t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"h1"}]}],"declarations":[{"name":"background-image","value":[{"type":"function","value":"-webkit-linear-gradient","arguments":"top, #fff, #f8f8f8"}]}]}]');

});

test('Comments', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('/* this is a comment */');
	t.is(JSON.stringify(nodes), '[{"type":"comment","content":" this is a comment "}]');

});

test('At Rules', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('@page {}');
	t.is(JSON.stringify(nodes), '[{"type":"at","at":"page","selector":"","styles":[]}]');

	nodes = parser.parse('@page :first { {}');
	t.is(JSON.stringify(nodes), '[{"type":"at","at":"page","selector":":first","styles":[]}]');

	nodes = parser.parse('@media print {}');
	t.is(JSON.stringify(nodes), '[{"type":"at","at":"media","selector":"print","styles":[]}]');

	nodes = parser.parse('@media print {.class{color:red;}}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"at","at":"media","selector":"print","styles":[
			{
				"type":"style",
				"rules":[{"specificity":[2,0,0,1,0],"selectors":[{"combinator":"root","classes":["class"]}]}],
				"declarations":[{"name":"color","value":[{"type":"color","value":"red"}]}]
			}
		]}]));

	nodes = parser.parse('@media only screen and (max-height: 650px) {}');
	t.is(JSON.stringify(nodes), '[{"type":"at","at":"media","selector":"only screen and (max-height: 650px)","styles":[]}]');

	nodes = parser.parse('@import url("fineprint.css") print;');
	t.is(JSON.stringify(nodes), '[{"type":"at","at":"import","selector":"url(\\"fineprint.css\\") print","styles":[]}]');

	nodes = parser.parse('@keyframes mymove {0% {width: 0} 50% {width: 50px}');
	t.is(JSON.stringify(nodes), JSON.stringify(
		[{"type":"at","at":"keyframes","selector":"mymove",
			"styles":[
				{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"0%"}]}],"declarations":[{"name":"width","value":[{"type":"unit","value":0,"unit":""}]}]},
				{"type":"style","rules":[{"specificity":[2,0,0,0,1],"selectors":[{"combinator":"root","element":"50%"}]}],"declarations":[{"name":"width","value":[{"type":"unit","value":50,"unit":"px"}]}]}
			]
		}]
	));

	/*
	// FIXME
	nodes = parser.parse('@media print{@page {margin:.5cm}p{orphans:3}}');
	t.is(JSON.stringify(nodes), '[{"type":"at","at":"import","selector":"url(\\"fineprint.css\\") print","styles":[]}]');
	*/

});

test('Parse Color Declarations', async t => {
	var parser = new CssParser();
	var nodes;

	parser.setText('#ffa');
	nodes = parser.parse_DECLARATION_VALUE();
	t.is(JSON.stringify(nodes), '[{"type":"color","value":"#ffa"}]');

	parser.setText('#red');
	nodes = parser.parse_DECLARATION_VALUE();
	t.is(JSON.stringify(nodes), '[{"type":"keyword","value":"#red"}]');

	parser.setText('red');
	nodes = parser.parse_DECLARATION_VALUE();
	t.is(JSON.stringify(nodes), '[{"type":"color","value":"red"}]');

	parser.setText('#09f');
	nodes = parser.parse_DECLARATION_VALUE();
	t.is(JSON.stringify(nodes), '[{"type":"color","value":"#09f"}]');

	parser.setText('#ff00');
	nodes = parser.parse_DECLARATION_VALUE();
	t.is(JSON.stringify(nodes), '[{"type":"keyword","value":"#ff00"}]');

	parser.setText('rgb(155, 0, 200)');
	nodes = parser.parse_DECLARATION_VALUE();
	t.is(JSON.stringify(nodes), '[{"type":"color","value":"rgb","arguments":"155, 0, 200"}]');

	parser.setText('hsla(155, 0, 200, 0.2)');
	nodes = parser.parse_DECLARATION_VALUE();
	t.is(JSON.stringify(nodes), '[{"type":"color","value":"hsla","arguments":"155, 0, 200, 0.2"}]');

	parser.setText('transparent');
	nodes = parser.parse_DECLARATION_VALUE();
	t.is(JSON.stringify(nodes), '[{"type":"color","value":"transparent"}]');

	parser.setText('1px solid #fa7');
	nodes = parser.parse_DECLARATION_VALUE();
	t.is(JSON.stringify(nodes), '[{"type":"unit","value":1,"unit":"px"},{"type":"keyword","value":"solid"},{"type":"color","value":"#fa7"}]');

});

test('Shorthand Declarations', async t => {
	var parser = new CssParser();
	var nodes;

	parser.setText('1px solid red');
	nodes = parser.parse_DECLARATION_VALUE();
	t.is(JSON.stringify(nodes), '[{"type":"unit","value":1,"unit":"px"},{"type":"keyword","value":"solid"},{"type":"color","value":"red"}]');

});

