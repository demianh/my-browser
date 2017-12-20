/**
 * Grammar of CSS 2.1: https://www.w3.org/TR/CSS2/grammar.html
 * CSS3 Tokenization: https://www.w3.org/TR/css-syntax-3/#tokenization
 */
export class CssParser {
    constructor() {
        this.text = '';
        this.pos = 0;
    }
    parse(text) {
        this.text = text;
        this.pos = 0;
        let nodes = this.parse_STYLES();
        return nodes;
    }
    parse_STYLES() {
        let nodes = [];
        this.skipWhitespaces();
        while (!this.eof() && this.nextChar() != '}') {
            if (this.nextStringEquals('@')) {
                // parse media, import etc.
                nodes.push(this.parse_AT_RULE());
            }
            else if (this.nextStringEquals('/*')) {
                // parse comments
                nodes.push(this.parse_COMMENT_NODE());
            }
            else {
                let style = this.parse_STYLE_NODE();
                if (style !== null) {
                    nodes.push(style);
                }
            }
            this.skipWhitespaces();
        }
        return nodes;
    }
    parse_STYLE_NODE() {
        let node = {
            type: 'style',
            rules: [],
            declarations: [],
        };
        while (!this.eof() && this.nextChar() !== '{') {
            this.skipWhitespaces();
            let rule = this.parse_RULE();
            if (rule !== null) {
                node.rules.push(rule);
            }
            this.skipWhitespaces();
        }
        // skip {
        this.pos++;
        this.skipWhitespaces();
        while (!this.eof() && this.nextChar() !== '}') {
            let newDeclaration = this.parse_DECLARATION();
            // de-duplicate declarations
            node.declarations = node.declarations.filter((decl) => {
                return decl.name !== newDeclaration.name;
            });
            node.declarations.push(newDeclaration);
            this.skipWhitespaces();
        }
        // skip }
        this.pos++;
        // dont return empty style nodes
        if (node.rules.length == 0 && node.declarations.length == 0) {
            return null;
        }
        else {
            return node;
        }
    }
    parse_RULE() {
        let rule = {
            specificity: [0, 0, 0, 0],
            selectors: []
        };
        this.skipWhitespaces();
        let hasWhitespace = false;
        // Text
        while (!this.eof() && this.nextChar() !== ',' && this.nextChar() !== '{') {
            let isFirst = (rule.selectors.length == 0);
            let newSelector = this.parse_SELECTOR(isFirst, hasWhitespace);
            rule.selectors.push(newSelector);
            // increase specificity
            switch (newSelector.type) {
                case 'id':
                    rule.specificity[1]++;
                    break;
                case 'class':
                case 'attribute':
                case 'pseudo-class':
                    rule.specificity[2]++;
                    break;
                case 'element':
                case 'pseudo-element':
                    rule.specificity[3]++;
                    break;
            }
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
        if (rule.selectors.length == 0) {
            return null;
        }
        else {
            return rule;
        }
    }
    parse_SELECTOR(isFirst, hasWhitespaceBefore) {
        let selector = {
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
                case '[': {
                    // parse id
                    selector.type = 'attribute';
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
        if (selector.type == 'attribute') {
            // Match rules enclosed in brackets: [att='var']
            selector.selector = this.parse_ATTRIBUTE_SELECTOR();
        }
        else {
            // Match any Text
            while (!this.eof() && this.nextChar().match(/[a-z0-9_\-%]/i)) {
                selector.selector += this.nextChar();
                this.pos++;
            }
        }
        return selector;
    }
    parse_ATTRIBUTE_SELECTOR() {
        let selector = '';
        while (!this.eof() && this.nextChar() != ']') {
            selector += this.nextChar();
            this.pos++;
        }
        this.pos++;
        return selector;
    }
    parse_DECLARATION() {
        let declaration = {
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
    }
    parse_DECLARATION_NAME() {
        let name = '';
        this.skipWhitespaces();
        while (!this.eof() && this.nextChar().match(/[^}:]/i)) {
            name += this.nextChar();
            this.pos++;
        }
        return name.toLowerCase().trim();
    }
    parse_DECLARATION_VALUE() {
        let value = '';
        while (!this.eof() && this.nextChar().match(/[^};]/i)) {
            value += this.nextChar();
            this.pos++;
        }
        return value.trim();
    }
    parse_COMMENT_NODE() {
        let node = {
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
    }
    parse_AT_RULE() {
        let node = {
            type: 'at',
            at: '',
            selector: '',
            styles: []
        };
        // skip @
        this.pos++;
        // Match @rule name
        while (!this.eof() && this.nextChar().match(/[a-z0-9_\-]/i)) {
            node.at += this.nextChar();
            this.pos++;
        }
        this.skipWhitespaces();
        // Match @rule selector
        while (!this.eof() && this.nextChar() != ';' && this.nextChar() != '{') {
            node.selector += this.nextChar();
            this.pos++;
        }
        node.selector = node.selector.trim();
        if (this.nextChar() == ';') {
            this.pos++;
        }
        else {
            this.pos++;
            this.skipWhitespaces();
            if (this.nextChar() == '}') {
                return node;
            }
            node.styles = this.parse_STYLES();
        }
        return node;
    }
    skipWhitespaces() {
        while (!this.eof() && this.nextIsWhitespace()) {
            this.pos++;
        }
    }
    isAlphaNumeric(string) {
        return string.match(/[0-9a-zA-Z-]/i);
    }
    isWhitespace(string) {
        return !/\S/.test(string);
    }
    nextIsWhitespace() {
        return this.isWhitespace(this.nextChar());
    }
    nextChar() {
        //console.log('TEXT ' + this.text);
        //console.log('CHAR ' + this.pos + ': ' + this.text.substr(this.pos, 40));
        return this.text.charAt(this.pos);
    }
    nextNChar(offset) {
        return this.text.charAt(this.pos + (offset - 1));
    }
    nextStringEquals(needle) {
        var found = this.text.substr(this.pos, needle.length);
        return found === needle;
    }
    eof() {
        return this.pos > this.text.length;
    }
}
