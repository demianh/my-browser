"use strict";
/**
 * Grammar of CSS 2.1: https://www.w3.org/TR/CSS2/grammar.html
 * CSS3 Tokenization: https://www.w3.org/TR/css-syntax-3/#tokenization
 */
Object.defineProperty(exports, "__esModule", { value: true });
var CssParser = /** @class */ (function () {
    function CssParser() {
        this.text = '';
        this.pos = 0;
    }
    CssParser.prototype.parse = function (text) {
        this.text = text;
        this.pos = 0;
        var nodes = this.parse_STYLES();
        return nodes;
    };
    CssParser.prototype.parse_STYLES = function () {
        var nodes = [];
        this.skipWhitespaces();
        while (!this.eof()) {
            if (this.nextStringEquals('@')) {
                // parse media, import etc.
            }
            else if (this.nextStringEquals('/*')) {
                // parse comments
                nodes.push(this.parse_COMMENT_NODE());
            }
            else {
                var style = this.parse_STYLE_NODE();
                nodes.push(style);
            }
            this.skipWhitespaces();
        }
        return nodes;
    };
    CssParser.prototype.parse_STYLE_NODE = function () {
        var node = {
            type: 'style',
            rules: [],
            declarations: [],
        };
        while (!this.eof() && this.nextChar() !== '{') {
            this.skipWhitespaces();
            var rule = this.parse_RULE();
            node.rules.push(rule);
            this.skipWhitespaces();
        }
        // skip {
        this.pos++;
        this.skipWhitespaces();
        var _loop_1 = function () {
            var newDeclaration = this_1.parse_DECLARATION();
            // de-duplicate declarations
            node.declarations = node.declarations.filter(function (decl) {
                return decl.name !== newDeclaration.name;
            });
            node.declarations.push(newDeclaration);
            this_1.skipWhitespaces();
        };
        var this_1 = this;
        while (!this.eof() && this.nextChar() !== '}') {
            _loop_1();
        }
        // skip }
        this.pos++;
        return node;
    };
    CssParser.prototype.parse_RULE = function () {
        var rule = {
            specificity: [0, 0, 0, 0],
            selectors: []
        };
        this.skipWhitespaces();
        var hasWhitespace = false;
        // Text
        while (!this.eof() && this.nextChar() !== ',' && this.nextChar() !== '{') {
            var isFirst = (rule.selectors.length == 0);
            rule.selectors.push(this.parse_SELECTOR(isFirst, hasWhitespace));
            if (this.nextIsWhitespace()) {
                hasWhitespace = true;
                this.skipWhitespaces();
            }
            else {
                hasWhitespace = false;
            }
        }
        if (this.nextChar() === ',') {
            // skip ,
            this.pos++;
        }
        return rule;
    };
    CssParser.prototype.parse_SELECTOR = function (isFirst, hasWhitespaceBefore) {
        var selector = {
            type: 'element',
            combinator: isFirst ? 'root' : (hasWhitespaceBefore ? 'descendant' : 'same'),
            selector: '',
            arguments: []
        };
        this.skipWhitespaces();
        if (!this.eof()) {
            switch (this.nextChar()) {
                case '>': {
                    selector.combinator = 'child';
                    this.pos++;
                    this.skipWhitespaces();
                    break;
                }
                case '+': {
                    selector.combinator = 'adjacent';
                    this.pos++;
                    this.skipWhitespaces();
                    break;
                }
                case '~': {
                    selector.combinator = 'sibling';
                    this.pos++;
                    this.skipWhitespaces();
                    break;
                }
            }
        }
        if (!this.eof()) {
            switch (this.nextChar()) {
                case '.': {
                    // parse class
                    selector.type = 'class';
                    this.pos++;
                    break;
                }
                case '#': {
                    // parse id
                    selector.type = 'id';
                    this.pos++;
                    break;
                }
                case ':': {
                    // parse pseudo
                    selector.type = 'pseudo-class';
                    this.pos++;
                    if (this.nextChar() == ':') {
                        selector.type = 'pseudo-element';
                        this.pos++;
                    }
                    break;
                }
            }
        }
        // Text
        while (!this.eof() && this.nextChar().match(/[a-z0-9_\-]/i)) {
            selector.selector += this.nextChar();
            this.pos++;
        }
        return selector;
    };
    CssParser.prototype.parse_DECLARATION = function () {
        var declaration = {
            name: '',
            value: ''
        };
        declaration.name = this.parse_DECLARATION_NAME();
        this.skipWhitespaces();
        if (this.nextChar() === ':') {
            this.pos++;
            declaration.value = this.parse_DECLARATION_VALUE();
            if (this.nextChar() === ';') {
                this.pos++;
            }
        }
        return declaration;
    };
    CssParser.prototype.parse_DECLARATION_NAME = function () {
        var name = '';
        this.skipWhitespaces();
        while (!this.eof() && this.nextChar().match(/[^}:]/i)) {
            name += this.nextChar();
            this.pos++;
        }
        return name.toLowerCase().trim();
    };
    CssParser.prototype.parse_DECLARATION_VALUE = function () {
        var value = '';
        while (!this.eof() && this.nextChar().match(/[^};]/i)) {
            value += this.nextChar();
            this.pos++;
        }
        return value.trim();
    };
    CssParser.prototype.parse_COMMENT_NODE = function () {
        var node = {
            type: 'comment',
            content: ''
        };
        // skip /*
        this.pos += 2;
        // Text
        while (!this.eof() && !this.nextStringEquals('*/')) {
            node.content += this.nextChar();
            this.pos++;
        }
        // skip */
        this.pos += 2;
        return node;
    };
    CssParser.prototype.skipWhitespaces = function () {
        while (!this.eof() && this.nextIsWhitespace()) {
            this.pos++;
        }
    };
    CssParser.prototype.isAlphaNumeric = function (string) {
        return string.match(/[0-9a-zA-Z-]/i);
    };
    CssParser.prototype.isWhitespace = function (string) {
        return !/\S/.test(string);
    };
    CssParser.prototype.nextIsWhitespace = function () {
        return this.isWhitespace(this.nextChar());
    };
    CssParser.prototype.nextChar = function () {
        return this.text.charAt(this.pos);
    };
    CssParser.prototype.nextNChar = function (offset) {
        return this.text.charAt(this.pos + (offset - 1));
    };
    CssParser.prototype.nextStringEquals = function (needle) {
        var found = this.text.substr(this.pos, needle.length);
        return found === needle;
    };
    CssParser.prototype.eof = function () {
        return this.pos > this.text.length;
    };
    return CssParser;
}());
exports.CssParser = CssParser;
