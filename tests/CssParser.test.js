
import test from 'ava';

import {CssParser} from '../js/CssParser'

test('Simple Rules', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('');
	t.is(JSON.stringify(nodes), '[]');

	nodes = parser.parse('h1 {}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[]}]');

	nodes = parser.parse('h1{   }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[]}]');

	nodes = parser.parse('h1, h2 {}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]},{"specificity":[0,0,0,1],"selectors":[{"type":"element","combinator":"root","selector":"h2","arguments":[]}]}],"declarations":[]}]');

	nodes = parser.parse('h1 div {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,0,2],"selectors":[
			{"type":"element","combinator":"root","selector":"h1","arguments":[]},
			{"type":"element","combinator":"descendant","selector":"div","arguments":[]}
		]}],"declarations":[]}]));

	nodes = parser.parse('h1 div, h2 a custom-element {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,0,2],"selectors":
		[{"type":"element","combinator":"root","selector":"h1","arguments":[]},
		{"type":"element","combinator":"descendant","selector":"div","arguments":[]}
		]},{"specificity":[0,0,0,3],"selectors":
		[{"type":"element","combinator":"root","selector":"h2","arguments":[]},
		{"type":"element","combinator":"descendant","selector":"a","arguments":[]},
		{"type":"element","combinator":"descendant","selector":"custom-element","arguments":[]}
		]}],"declarations":[]}]));

});

test('Class Rules', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('.simple {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,1,0],"selectors":[
			{"type":"class","combinator":"root","selector":"simple","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('.simple .another-one{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,2,0],"selectors":[
			{"type":"class","combinator":"root","selector":"simple","arguments":[]},
			{"type":"class","combinator":"descendant","selector":"another-one","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('.simple.another-one{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,2,0],"selectors":[
			{"type":"class","combinator":"root","selector":"simple","arguments":[]},
			{"type":"class","combinator":"same","selector":"another-one","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('h1.simple{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,1,1],"selectors":[
			{"type":"element","combinator":"root","selector":"h1","arguments":[]},
			{"type":"class","combinator":"same","selector":"simple","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('h1.simple .bla.blub.bla.foo{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,5,1],"selectors":[
			{"type":"element","combinator":"root","selector":"h1","arguments":[]},
			{"type":"class","combinator":"same","selector":"simple","arguments":[]},
			{"type":"class","combinator":"descendant","selector":"bla","arguments":[]},
			{"type":"class","combinator":"same","selector":"blub","arguments":[]},
			{"type":"class","combinator":"same","selector":"bla","arguments":[]},
			{"type":"class","combinator":"same","selector":"foo","arguments":[]}
		]}],"declarations":[]}]));

	nodes = parser.parse('div#id.class1.class2.class1{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,1,3,1],"selectors":[
			{"type":"element","combinator":"root","selector":"div","arguments":[]},
			{"type":"id","combinator":"same","selector":"id","arguments":[]},
			{"type":"class","combinator":"same","selector":"class1","arguments":[]},
			{"type":"class","combinator":"same","selector":"class2","arguments":[]},
			{"type":"class","combinator":"same","selector":"class1","arguments":[]},
		]}],"declarations":[]}]));
});


test('ID Rules', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('#simple {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,1,0,0],"selectors":[
			{"type":"id","combinator":"root","selector":"simple","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('#simple #another-one{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,2,0,0],"selectors":[
			{"type":"id","combinator":"root","selector":"simple","arguments":[]},
			{"type":"id","combinator":"descendant","selector":"another-one","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('h1#simple   {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,1,0,1],"selectors":[
			{"type":"element","combinator":"root","selector":"h1","arguments":[]},
			{"type":"id","combinator":"same","selector":"simple","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('h1#simple #bla  #blub #bla.foo{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,4,1,1],"selectors":[
			{"type":"element","combinator":"root","selector":"h1","arguments":[]},
			{"type":"id","combinator":"same","selector":"simple","arguments":[]},
			{"type":"id","combinator":"descendant","selector":"bla","arguments":[]},
			{"type":"id","combinator":"descendant","selector":"blub","arguments":[]},
			{"type":"id","combinator":"descendant","selector":"bla","arguments":[]},
			{"type":"class","combinator":"same","selector":"foo","arguments":[]}
		]}],"declarations":[]}]));

});

test('Pseudo Rules', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('::any-pseudo {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[
			{"type":"pseudo-element","combinator":"root","selector":"any-pseudo","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('input::-webkit-inner-spin-button{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,0,2],"selectors":[
			{"type":"element","combinator":"root","selector":"input","arguments":[]},
			{"type":"pseudo-element","combinator":"same","selector":"-webkit-inner-spin-button","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse(':hover   {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,1,0],"selectors":[
			{"type":"pseudo-class","combinator":"root","selector":"hover","arguments":[]}
		]}],"declarations":[]}]));

	nodes = parser.parse('a:hover   {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,1,1],"selectors":[
			{"type":"element","combinator":"root","selector":"a","arguments":[]},
			{"type":"pseudo-class","combinator":"same","selector":"hover","arguments":[]},
		]}],"declarations":[]}]));

});

test('Attribute Selectors', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse("[dir='ltr'] {}");
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,1,0],"selectors":[
			{"type":"attribute","combinator":"root","selector":"dir='ltr'","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('[disabled]{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,1,0],"selectors":[
			{"type":"attribute","combinator":"root","selector":"disabled","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('[ dir = "test" ] {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,1,0],"selectors":[
			{"type":"attribute","combinator":"root","selector":" dir = \"test\" ","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('[ dir = test ] {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,1,0],"selectors":[
			{"type":"attribute","combinator":"root","selector":" dir = test ","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('[dir=test] {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,1,0],"selectors":[
			{"type":"attribute","combinator":"root","selector":"dir=test","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse("._class[disabled]:not([disabled=false]){}");
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[
		{"specificity":[0,0,3,0],"selectors":[
			{"type":"class","combinator":"root","selector":"_class","arguments":[]},
			{"type":"attribute","combinator":"same","selector":"disabled","arguments":[]},
			{"type":"pseudo-class","combinator":"same","selector":"not","arguments":"[disabled=false]"}
		]}
		],"declarations":[]}]));

	// more things that should be supported
	// [dir="tes'[t"] {}
	// [dir='tes[t""'] {}
});

test(':not() Selectors', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse(":not(h1) {}");
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[
		{"specificity":[0,0,1,0],"selectors":[
			{"type":"pseudo-class","combinator":"root","selector":"not","arguments":"h1"}
		]}],"declarations":[]}]));

	nodes = parser.parse(":not (h1) {}");
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[
		{"specificity":[0,0,1,0],"selectors":[
			{"type":"pseudo-class","combinator":"root","selector":"not","arguments":"h1"}
		]}],"declarations":[]}]));

	nodes = parser.parse(":not (h1, h2, .class,#id) {}");
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[
		{"specificity":[0,0,1,0],"selectors":[
			{"type":"pseudo-class","combinator":"root","selector":"not","arguments":"h1, h2, .class,#id"}
		]}],"declarations":[]}]));

	nodes = parser.parse(":not(h1) :not(h2):not(h3) {}");
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[
		{"specificity":[0,0,3,0],"selectors":[
			{"type":"pseudo-class","combinator":"root","selector":"not","arguments":"h1"},
			{"type":"pseudo-class","combinator":"descendant","selector":"not","arguments":"h2"},
			{"type":"pseudo-class","combinator":"same","selector":"not","arguments":"h3"}
		]}],"declarations":[]}]));

	nodes = parser.parse("h1:not(.title) {}");
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[
		{"specificity":[0,0,1,1],"selectors":[
			{"type":"element","combinator":"root","selector":"h1","arguments":[]},
			{"type":"pseudo-class","combinator":"same","selector":"not","arguments":".title"}
		]}],"declarations":[]}]));
});

test('Combinators', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('a > b {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,0,2],"selectors":[
			{"type":"element","combinator":"root","selector":"a","arguments":[]},
			{"type":"element","combinator":"child","selector":"b","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('a>b{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,0,2],"selectors":[
			{"type":"element","combinator":"root","selector":"a","arguments":[]},
			{"type":"element","combinator":"child","selector":"b","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('h1 > .yeah{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,1,1],"selectors":[
			{"type":"element","combinator":"root","selector":"h1","arguments":[]},
			{"type":"class","combinator":"child","selector":"yeah","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('h1 + div#yeah{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,1,0,2],"selectors":[
			{"type":"element","combinator":"root","selector":"h1","arguments":[]},
			{"type":"element","combinator":"adjacent","selector":"div","arguments":[]},
			{"type":"id","combinator":"same","selector":"yeah","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('my-element~.your-class{}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,1,1],"selectors":[
			{"type":"element","combinator":"root","selector":"my-element","arguments":[]},
			{"type":"class","combinator":"sibling","selector":"your-class","arguments":[]},
		]}],"declarations":[]}]));

	nodes = parser.parse('li:first-of-type + li {}');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,1,2],"selectors":[
			{"type":"element","combinator":"root","selector":"li","arguments":[]},
			{"type":"pseudo-class","combinator":"same","selector":"first-of-type","arguments":[]},
			{"type":"element","combinator":"adjacent","selector":"li","arguments":[]},
		]}],"declarations":[]}]));

});

/*
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
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[{"name":"color","value":[{"type":"keyword","value":"red"}]}]}]');

	nodes = parser.parse('h1 { color : red; }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[{"name":"color","value":[{"type":"keyword","value":"red"}]}]}]');

	nodes = parser.parse('h1 {color:red;}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[{"name":"color","value":[{"type":"keyword","value":"red"}]}]}]');

	nodes = parser.parse('h1 {color:red}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[{"name":"color","value":[{"type":"keyword","value":"red"}]}]}]');

	nodes = parser.parse(`col {
			display: table-column;
		}`);
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[{"type":"element","combinator":"root","selector":"col","arguments":[]}]}],"declarations":[{"name":"display","value":[{"type":"keyword","value":"table-column"}]}]}]');

});

test('Multiple Declarations', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('h1 { color: red; font-family:helvetica,arial,sans-serif; }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[{"name":"color","value":[{"type":"keyword","value":"red"}]},{"name":"font-family","value":[{"type":"keyword","value":"helvetica,arial,sans-serif"}]}]}]');

	// duplicate rules, use latest only
	nodes = parser.parse('h1 { color: red; color: blue; }');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[{"name":"color","value":[{"type":"keyword","value":"blue"}]}]}]');

});

test('Unit Declarations', async t => {
	var parser = new CssParser();
	var nodes;

	// known units:
	// em, ex, %, px, cm, mm, in, pt, pc, ch, rem, vh, vw, vmin, vmax, vm

	nodes = parser.parse('h1 { padding: 10px; }');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[
			{"type":"element","combinator":"root","selector":"h1","arguments":[]}
		]}],"declarations":[
			{"name":"padding","value":[{"type":"unit","value":10,"unit":"px"}]}
		]}]));

	nodes = parser.parse('h1 { height: 50%; }');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[
			{"type":"element","combinator":"root","selector":"h1","arguments":[]}
		]}],"declarations":[
			{"name":"height","value":[{"type":"unit","value":50,"unit":"%"}]}
		]}]));

	nodes = parser.parse('h1 { height: -1.23px; }');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[
			{"type":"element","combinator":"root","selector":"h1","arguments":[]}
		]}],"declarations":[
			{"name":"height","value":[{"type":"unit","value":-1.23,"unit":"px"}]}
		]}]));

	nodes = parser.parse('h1 { height:.2; }');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[
			{"type":"element","combinator":"root","selector":"h1","arguments":[]}
		]}],"declarations":[
			{"name":"height","value":[{"type":"unit","value":0.2,"unit":""}]}
		]}]));

	nodes = parser.parse('h1 { height: 0; }');
	t.is(JSON.stringify(nodes), JSON.stringify([{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[
			{"type":"element","combinator":"root","selector":"h1","arguments":[]}
		]}],"declarations":[
			{"name":"height","value":[{"type":"unit","value":0,"unit":""}]}
		]}]));

	// background-image: -webkit-linear-gradient(top, #fff, #f8f8f8);
});

test('Functions in Declarations', async t => {
	var parser = new CssParser();
	var nodes;

	nodes = parser.parse('h1 {background: url("bla") white}');
	t.is(JSON.stringify(nodes), '[{"type":"style","rules":[{"specificity":[0,0,0,1],"selectors":[{"type":"element","combinator":"root","selector":"h1","arguments":[]}]}],"declarations":[{"name":"background","value":[{"type":"keyword","value":"url(\\"bla\\")"},{"type":"keyword","value":"white"}]}]}]');

	//nodes = parser.parse('h1 {transform: scale(0, 0)}');
	//t.is(JSON.stringify(nodes), '[{"type":"comment","content":" this is a comment "}]');

	// box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16),0 0 0 1px rgba(0,0,0,0.08);
	// transition: box-shadow 200ms cubic-bezier(0.4, 0 , 0.2 , 1 );
	// background-image: linear-gradient(top,#4d90fe,#4787ed);

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

	nodes = parser.parse('@media only screen and (max-height: 650px) {}');
	t.is(JSON.stringify(nodes), '[{"type":"at","at":"media","selector":"only screen and (max-height: 650px)","styles":[]}]');

	nodes = parser.parse('@import url("fineprint.css") print;');
	t.is(JSON.stringify(nodes), '[{"type":"at","at":"import","selector":"url(\\"fineprint.css\\") print","styles":[]}]');

	nodes = parser.parse('@keyframes mymove {0% {width: 0} 50% {width: 50px}');
	t.is(JSON.stringify(nodes), JSON.stringify(
		[
			{
				"type": "at",
				"at": "keyframes",
				"selector": "mymove",
				"styles": [
					{
						"type": "style",
						"rules": [
							{
								"specificity": [
									0,
									0,
									0,
									1
								],
								"selectors": [
									{
										"type": "element",
										"combinator": "root",
										"selector": "0%",
										"arguments": []
									}
								]
							}
						],
						"declarations": [
							{
								"name": "width",
								"value": [{"type":"unit","value":0,"unit":""}]
							}
						]
					},
					{
						"type": "style",
						"rules": [
							{
								"specificity": [
									0,
									0,
									0,
									1
								],
								"selectors": [
									{
										"type": "element",
										"combinator": "root",
										"selector": "50%",
										"arguments": []
									}
								]
							}
						],
						"declarations": [
							{
								"name": "width",
								"value": [{"type":"unit","value":50,"unit":"px"}]
							}
						]
					}
				]
			}
		]
	));

});

