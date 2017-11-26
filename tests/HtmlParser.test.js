
import test from 'ava';

import {HtmlParser} from '../js/HtmlParser'

test('Text only', async t => {
	var parser = new HtmlParser();
	var nodes;

	nodes = parser.parse('some text > blabla');
	t.is(JSON.stringify(nodes), '[{"type":"text","content":"some text > blabla"}]');

	nodes = parser.parse('this < should be <" text');
	t.is(JSON.stringify(nodes), '[{"type":"text","content":"this < should be <\\" text"}]');
});

test('Node', async t => {
	var parser = new HtmlParser();
	var nodes;

	nodes = parser.parse('<span></span>');
	t.is(JSON.stringify(nodes), '[{"tag":"span","type":"element","attributes":{},"children":[]}]');

	nodes = parser.parse('<span></span/>');
	t.is(JSON.stringify(nodes), '[{"tag":"span","type":"element","attributes":{},"children":[]}]');

	nodes = parser.parse('<span></span >');
	t.is(JSON.stringify(nodes), '[{"tag":"span","type":"element","attributes":{},"children":[]}]');

	nodes = parser.parse('<div>asdf</div>');
	t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{},"children":[{"type":"text","content":"asdf"}]}]');

	//nodes = parser.parse('<div>as</>df</div>');
	//t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{},"children":[{"type":"text","content":"asdf"}]}]');

	//nodes = parser.parse('<42></42>');
	//t.is(JSON.stringify(nodes), '[{"type":"text","content":"<42>"},{"type":"comment","content":"42"}]');

	nodes = parser.parse('<a42></a42>');
	t.is(JSON.stringify(nodes), '[{"tag":"a42","type":"element","attributes":{},"children":[]}]');


});

test('Nested Nodes', async t => {
	var parser = new HtmlParser();
	var nodes;

	nodes = parser.parse('<span> <div> bla <i>juhu</i></div><b></b></span>');
	t.is(JSON.stringify(nodes), '[{"tag":"span","type":"element","attributes":{},"children":[{"tag":"div","type":"element","attributes":{},"children":[{"type":"text","content":" bla "},{"tag":"i","type":"element","attributes":{},"children":[{"type":"text","content":"juhu"}]}]},{"tag":"b","type":"element","attributes":{},"children":[]}]}]');
});

// FIXME
// test('Wrong Nested Nodes', async t => {
// 	var parser = new HtmlParser();
// 	var nodes;
//
// 	nodes = parser.parse('<span><div>DIV1</span>DIV2</div></span>');
// 	t.is(JSON.stringify(nodes), '...');
//
// });

test('Attributes', async t => {
	var parser = new HtmlParser();
	var nodes;

	nodes = parser.parse('<div class=" foo barç%&/()?=-12+bar">asdf</div>');
	t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{"class":" foo barç%&/()?=-12+bar"},"children":[{"type":"text","content":"asdf"}]}]');

	nodes = parser.parse('<div class=>asdf</div>');
	t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{"class":""},"children":[{"type":"text","content":"asdf"}]}]');

	// multiple attributes
	nodes = parser.parse('<div  class="asd jwjw" id="123" foo="" ></div>');
	t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{"class":"asd jwjw","id":"123","foo":""},"children":[]}]');

	// no whitespaces between
	nodes = parser.parse('<div  class="asd jwjw"id="123"foo="" ></div>');
	t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{"class":"asd jwjw","id":"123","foo":""},"children":[]}]');

	// multiple standalone attributes
	nodes = parser.parse('<div foo="" bar=baz-baz standalone stand-alone-2 ></div>');
	t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{"foo":"","bar":"baz-baz","standalone":null,"stand-alone-2":null},"children":[]}]');

	// duplicate, use only first value
	nodes = parser.parse('<div class="first" class="second"></div>');
	t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{"class":"first"},"children":[]}]');

	// treat / as whitespace if it is not at the end
	//nodes = parser.parse('<div / id="foo"></div>');
	//t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{"id":"foo"},"children":[]}]');
});

test('Attributes Escaping', async t => {
	var parser = new HtmlParser();
	var nodes;

	nodes = parser.parse('<div  class="asdf"></div>');
	t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{"class":"asdf"},"children":[]}]');

	nodes = parser.parse('<div  class =   "asdf"></div>');
	t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{"class":"asdf"},"children":[]}]');

	nodes = parser.parse("<div  class='asdf'></div>");
	t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{"class":"asdf"},"children":[]}]');

	nodes = parser.parse('<div  class=asdf></div>');
	t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{"class":"asdf"},"children":[]}]');

	nodes = parser.parse('<div  class = asdf></div>');
	t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{"class":"asdf"},"children":[]}]');

	nodes = parser.parse('<div  class="asdf \'asdf\'asdf"></div>');
	t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{"class":"asdf \'asdf\'asdf"},"children":[]}]');

	nodes = parser.parse('<div  class=\'asdf "asdf"asdf\'></div>');
	t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{"class":"asdf \\"asdf\\"asdf"},"children":[]}]');

	//nodes = parser.parse('<div cl<\'"#ass="first"></div>');
	//t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{"cl<\'\\"#ass":"first"},"children":[]}]');

	// < ' " in attribute name:
	// <div foo<div> --> a single div element with a "foo<div" attribute.
	// <div id'bar'> --> a div element with the attribute "id'bar'" that has an empty value.
	// <div id"bar">

	// " ' < = ` in unquoted attribute value
	// <div foo=b'ar'> --> value of the "foo" attribute is "b'ar'"

	// missing attribute name
	// <div foo="bar" ="baz"> --> a "foo" attribute with a "bar" value and a "="baz"" attribute with an empty value.
});

test('Comments', async t => {
	var parser = new HtmlParser();
	var nodes;

	nodes = parser.parse('<div><!-- this is a comment --></div>');
	t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{},"children":[{"type":"comment","content":" this is a comment "}]}]');

	nodes = parser.parse('<!--COMMENT-->');
	t.is(JSON.stringify(nodes), '[{"type":"comment","content":"COMMENT"}]');

	nodes = parser.parse('<!---->');
	t.is(JSON.stringify(nodes), '[{"type":"comment","content":""}]');

	nodes = parser.parse('<!--Hello -- -- World-->');
	t.is(JSON.stringify(nodes), '[{"type":"comment","content":"Hello -- -- World"}]');

	nodes = parser.parse('<!--[if lt IE 9]><script src="ie.js"></script><![endif]-->');
	t.is(JSON.stringify(nodes), '[{"type":"comment","content":"[if lt IE 9]><script src=\\"ie.js\\"></script><![endif]"}]');

	nodes = parser.parse(`<head> <!--[if lt IE 9]><script src="ie.js"></script><![endif]--> </head>`);
	t.is(JSON.stringify(nodes), '[{"tag":"head","type":"element","attributes":{},"children":[{"type":"comment","content":"[if lt IE 9]><script src=\\"ie.js\\"></script><![endif]"}]}]');



	//nodes = parser.parse('<!--Hello -- -- World--!>');
	//t.is(JSON.stringify(nodes), '[{"type":"comment","content":"Hello -- -- World"}]');

	// this is also a valid comment, but ignore for now...
	//nodes = parser.parse('<!>');
	//t.is(JSON.stringify(nodes), '[{"type":"comment","content":""}]');

	//nodes = parser.parse('<! yes, this is also a comment >');
	//t.is(JSON.stringify(nodes), '[{"type":"comment","content":" yes, this is also a comment "}]');

	// nested comments
	//nodes = parser.parse('<!-- <!-- nested --> -->');
	//t.is(JSON.stringify(nodes), '[{"type":"comment","content":" <!-- nested "},{"type":"text","content":" -->"}]');

	// xml comments with <?
	//nodes = parser.parse('<?xml version="1.0" encoding="UTF-8"?>');
	//t.is(JSON.stringify(nodes), '[{"type":"comment","content":"?xml version=\"1.0\" encoding=\"UTF-8\"?"}]');

});


test('Void Elements', async t => {
	var parser = new HtmlParser();
	var nodes;

	nodes = parser.parse('<br>');
	t.is(JSON.stringify(nodes), '[{"tag":"br","type":"element","attributes":{},"children":[]}]');

	nodes = parser.parse('<br/>');
	t.is(JSON.stringify(nodes), '[{"tag":"br","type":"element","attributes":{},"children":[]}]');

	nodes = parser.parse('<br />');
	t.is(JSON.stringify(nodes), '[{"tag":"br","type":"element","attributes":{},"children":[]}]');

	nodes = parser.parse('<br>bla</br>');
	t.is(JSON.stringify(nodes), '[{"tag":"br","type":"element","attributes":{},"children":[]},{"type":"text","content":"bla"}]');

	nodes = parser.parse('<br />bla</br>');
	t.is(JSON.stringify(nodes), '[{"tag":"br","type":"element","attributes":{},"children":[]},{"type":"text","content":"bla"}]');

	nodes = parser.parse('<nonvoidelement />');
	t.is(JSON.stringify(nodes), '[{"tag":"nonvoidelement","type":"element","attributes":{},"children":[]}]');

	nodes = parser.parse('<nonvoidelement />bla</nonvoidelement>');
	t.is(JSON.stringify(nodes), '[{"tag":"nonvoidelement","type":"element","attributes":{},"children":[{"type":"text","content":"bla"}]}]');

	nodes = parser.parse('<meta name="viewport" content="width=device-width">');
	t.is(JSON.stringify(nodes), '[{"tag":"meta","type":"element","attributes":{"name":"viewport","content":"width=device-width"},"children":[]}]');

	// self close non void element
	// <div/><span></span><span></span> equals <div><span></span><span></span></div>
	nodes = parser.parse('<div/><span></span><span></span>');
	t.is(JSON.stringify(nodes), '[{"tag":"div","type":"element","attributes":{},"children":[{"tag":"span","type":"element","attributes":{},"children":[]},{"tag":"span","type":"element","attributes":{},"children":[]}]}]');
});

test('Doctype', async t => {
	var parser = new HtmlParser();
	var nodes;

	nodes = parser.parse('<!doctype html>');
	t.is(JSON.stringify(nodes), '[{"type":"doctype","params":["html"]}]');

	nodes = parser.parse('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"\n        "http://www.w3.org/TR/html4/loose.dtd">');
	t.is(JSON.stringify(nodes), '[{"type":"doctype","params":["HTML","PUBLIC","-//W3C//DTD HTML 4.01 Transitional//EN","http://www.w3.org/TR/html4/loose.dtd"]}]');
});

test('Raw Text Tags', async t => {
	var parser = new HtmlParser();
	var nodes;

	nodes = parser.parse('<script type="application/javascript">console.log("hello world")</script>');
	t.is(JSON.stringify(nodes), '[{"tag":"script","type":"element","attributes":{"type":"application/javascript"},"children":[{"type":"text","content":"console.log(\\"hello world\\")"}]}]');

	nodes = parser.parse('<script>console.log("hello</world>?")</script>');
	t.is(JSON.stringify(nodes), '[{"tag":"script","type":"element","attributes":{},"children":[{"type":"text","content":"console.log(\\"hello</world>?\\")"}]}]');

	nodes = parser.parse('<script>console.log("hello</script> world?")</script>');
	t.is(JSON.stringify(nodes), '[{"tag":"script","type":"element","attributes":{},"children":[{"type":"text","content":"console.log(\\"hello"}]},{"type":"text","content":" world?\\")"}]'); //

	nodes = parser.parse('<script><!-- comment should be text --></script>');
	t.is(JSON.stringify(nodes), '[{"tag":"script","type":"element","attributes":{},"children":[{"type":"text","content":"<!-- comment should be text -->"}]}]');

	nodes = parser.parse('<textarea id="123">this <b>should</b> be<br> text <only></only></textarea>');
	t.is(JSON.stringify(nodes), '[{"tag":"textarea","type":"element","attributes":{"id":"123"},"children":[{"type":"text","content":"this <b>should</b> be<br> text <only></only>"}]}]');
});


