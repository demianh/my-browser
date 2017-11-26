"use strict";
/**
 * Parsing Rules: https://html.spec.whatwg.org/#parsing
 * About Error handling: https://www.w3.org/TR/html5/syntax.html#the-after-head-insertion-mode
 *
 * TODO:
 * - CDATA sections
 * - Error handling (e.g. unbalanced or improperly nested tags)
 * - End Tags in Scripts
 * - encoded characters: &quot;
 */
Object.defineProperty(exports, "__esModule", { value: true });
var HtmlParser = /** @class */ (function () {
    function HtmlParser() {
        // command?
        this.VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
        this.RAWTEXT_ELEMENTS = ['script', 'style'];
        this.ESCAPABLE_RAWTEXT_ELEMENTS = ['textarea', 'title'];
        this.text = '';
        this.pos = 0;
    }
    HtmlParser.prototype.parse = function (text) {
        this.text = text;
        this.pos = 0;
        var nodes = this.parse_NODES();
        return nodes;
    };
    HtmlParser.prototype.parse_NODES = function () {
        var nodes = [];
        while (!this.eof()) {
            //console.log('parse Nodes: ', this.nextChars(16), this.pos);
            if (this.nextStringEquals('</')) {
                break;
            }
            else if (this.nextStringEquals('<!--')) {
                nodes.push(this.parse_COMMENT_NODE());
            }
            else if (this.nextStringEquals('<!')) {
                nodes.push(this.parse_DOCTYPE_NODE());
            }
            else if (this.nextChar() === '<' && this.isAlphaNumeric(this.nextNChar(2))) {
                nodes.push(this.parse_ELEMENT_NODE());
            }
            else {
                // don't add whitespace-only textnodes
                var textnode = this.parse_TEXT_NODE();
                if (/\S/.test(textnode.content)) {
                    nodes.push(textnode);
                }
            }
        }
        return nodes;
    };
    HtmlParser.prototype.parse_TEXT_NODE = function () {
        var node = {
            type: 'text',
            content: ''
        };
        // Text
        while (!this.eof()
            && !(this.nextChar() == '<' && this.isAlphaNumeric(this.nextNChar(2)))
            && !this.nextStringEquals('</')
            && !this.nextStringEquals('<!')) {
            node.content += this.nextChar();
            this.pos++;
        }
        return node;
    };
    HtmlParser.prototype.parse_RAW_TEXT_NODE = function (closing_tag) {
        var node = {
            type: 'text',
            content: ''
        };
        // Text
        while (!this.eof() && !this.nextStringEquals('</' + closing_tag)) {
            node.content += this.nextChar();
            this.pos++;
        }
        return node;
    };
    HtmlParser.prototype.parse_COMMENT_NODE = function () {
        var node = {
            type: 'comment',
            content: ''
        };
        // skip <!--
        this.pos += 4;
        // Text
        while (!this.eof() && !this.nextStringEquals('-->')) {
            node.content += this.nextChar();
            this.pos++;
        }
        // skip -->
        this.pos += 3;
        this.skipWhitespaces();
        return node;
    };
    HtmlParser.prototype.parse_DOCTYPE_NODE = function () {
        var node = {
            type: 'doctype',
            params: []
        };
        // skip <!
        this.pos += 2;
        // skip "doctype" text
        while (!this.eof() && !this.nextIsWhitespace()) {
            this.pos++;
        }
        this.skipWhitespaces();
        while (!this.eof() && this.nextChar() !== '>') {
            node.params.push(this.parse_ATTRIBUTEVALUE());
        }
        // skip >
        this.pos++;
        return node;
    };
    HtmlParser.prototype.parse_ELEMENT_NODE = function () {
        var node = {
            tag: '',
            type: 'element',
            attributes: {},
            children: []
        };
        // skip <
        this.pos++;
        // Opening Tag
        node.tag = this.parse_TAGNAME();
        while (!this.eof() && this.nextChar() !== '>') {
            this.skipWhitespaces();
            if (this.nextStringEquals('/>')) {
                // skip /
                this.pos++;
                break;
            }
            var att = this.parse_ATTRIBUTE();
            // don't override
            if (!(att[0] in node.attributes)) {
                node.attributes[att[0]] = att[1];
            }
            this.skipWhitespaces();
        }
        // skip >
        this.pos++;
        if (this.RAWTEXT_ELEMENTS.indexOf(node.tag) >= 0 || this.ESCAPABLE_RAWTEXT_ELEMENTS.indexOf(node.tag) >= 0) {
            // only match own ending tag in rawtext elements
            node.children = [this.parse_RAW_TEXT_NODE(node.tag)];
            // Go to end of closing Tag
            while (!this.eof() && this.nextChar() !== '>') {
                this.pos++;
            }
            // skip >
            this.pos++;
        }
        else if (this.VOID_ELEMENTS.indexOf(node.tag) == -1) {
            // dont parse children for void elements
            node.children = this.parse_NODES();
            // Go to end of closing Tag
            while (!this.eof() && this.nextChar() !== '>') {
                this.pos++;
            }
            // skip >
            this.pos++;
        }
        return node;
    };
    HtmlParser.prototype.parse_TAGNAME = function () {
        var tag = '';
        while (!this.eof() && this.isAlphaNumeric(this.nextChar())) {
            tag += this.nextChar();
            this.pos++;
        }
        return tag.toLowerCase();
    };
    HtmlParser.prototype.parse_ATTRIBUTE = function () {
        var name = this.parse_ATTRIBUTENAME();
        var value = null;
        this.skipWhitespaces();
        if (this.nextChar() === '=') {
            this.parse_EQUAL();
            value = this.parse_ATTRIBUTEVALUE();
        }
        return [name, value];
    };
    HtmlParser.prototype.parse_ATTRIBUTENAME = function () {
        var name = '';
        this.skipWhitespaces();
        while (!this.eof() && this.nextChar().match(/[^\t\n\f \/>"'=]/i)) {
            name += this.nextChar();
            this.pos++;
        }
        return name.toLowerCase();
    };
    HtmlParser.prototype.parse_ATTRIBUTEVALUE = function () {
        var value = '';
        this.skipWhitespaces();
        if (this.nextChar() == '"') {
            this.pos++;
            while (!this.eof() && this.nextChar() !== '"') {
                value += this.nextChar();
                this.pos++;
            }
            // skip "
            this.pos++;
        }
        else if (this.nextChar() == "'") {
            this.pos++;
            while (!this.eof() && this.nextChar() !== "'") {
                value += this.nextChar();
                this.pos++;
            }
            // skip '
            this.pos++;
        }
        else {
            while (!this.eof() && this.nextChar().match(/[^\t\n\f \/>"'=]/i)) {
                value += this.nextChar();
                this.pos++;
            }
        }
        return value;
    };
    HtmlParser.prototype.parse_EQUAL = function () {
        this.skipWhitespaces();
        while (!this.eof() && this.nextChar() !== '=') {
            this.pos++;
        }
        this.pos++;
    };
    HtmlParser.prototype.skipWhitespaces = function () {
        while (!this.eof() && this.nextIsWhitespace()) {
            this.pos++;
        }
    };
    HtmlParser.prototype.isAlphaNumeric = function (string) {
        return string.match(/[0-9a-zA-Z-]/i);
    };
    HtmlParser.prototype.isWhitespace = function (string) {
        return !/\S/.test(string);
    };
    HtmlParser.prototype.nextIsWhitespace = function () {
        return this.isWhitespace(this.nextChar());
    };
    HtmlParser.prototype.nextChar = function () {
        //console.log(this.text.charAt(this.pos));
        return this.text.charAt(this.pos);
    };
    HtmlParser.prototype.nextNChar = function (offset, length) {
        if (length === void 0) { length = 1; }
        return this.text.charAt(this.pos + (offset - 1));
    };
    HtmlParser.prototype.nextChars = function (length) {
        if (length === void 0) { length = 1; }
        return this.text.substr(this.pos, length);
    };
    HtmlParser.prototype.nextStringEquals = function (needle) {
        var found = this.text.substr(this.pos, needle.length).toLowerCase();
        return found === needle;
    };
    HtmlParser.prototype.eof = function () {
        return this.pos > this.text.length;
    };
    return HtmlParser;
}());
exports.HtmlParser = HtmlParser;
