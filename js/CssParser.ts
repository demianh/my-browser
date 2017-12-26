/**
 * Grammar of CSS 2.1: https://www.w3.org/TR/CSS2/grammar.html
 * CSS3 Tokenization: https://www.w3.org/TR/css-syntax-3/#tokenization
 */

export interface ICSSNode {
    type: 'style'|'at'|'comment'|'import';
}

export interface ICSSStyleNode extends ICSSNode {
    type: 'style'
    rules: ICSSRule[];
    declarations: ICSSStyleDeclaration[];
}

export interface ICSSAtNode extends ICSSNode {
    type: 'at'
    at: string;
    selector: string;
    styles: ICSSNode[];
}

export interface ICSSCommentNode extends ICSSNode {
    type: 'comment';
    content: string;
}

export interface ICSSStyleDeclaration {
    name: string;
    value: (ICSSKeyword|ICSSUnit|ICSSFunction)[];
}

export interface ICSSKeyword {
    type: 'keyword'
    value: string;
}

export interface ICSSUnit {
    type: string;
    value: number;
    unit: string;
}

export interface ICSSFunction {
    type: string;
    value: number;
    arguments: string;
}

export interface ICSSRule {
    specificity: [number,number,number,number];
    selectors: ICSSSelector[];
}

/**
 * Combinators:
 * root: first rule
 * descendant: space
 * same element: no space
 * child: >
 * adjacent sibling: + (immediate sibling after)
 * general sibling: ~ (any sibling element after)
 *
 * : pseudo-class
 * :: pseudo-element
 */
export interface ICSSSelector {
    type: 'element'|'class'|'id'|'universal'|'attribute'|'pseudo-element'|'pseudo-class'|'function',
    combinator: 'root'|'descendant'|'same'|'child'|'adjacent'|'sibling';
    selector: string;
    arguments: ICSSSelector[]|string;
}

export class CssParser {

    private text = '';
    private pos = 0;

    public parse(text: string) {
        this.text = text;
        this.pos = 0;
        let nodes = this.parse_STYLES();
        return nodes;
    }

    public parse_STYLES(): ICSSNode[] {
        let nodes = [];
        this.skipWhitespaces();
        while (!this.eof() && this.nextChar() != '}') {
            if (this.nextStringEquals('@')) {
                // parse media, import etc.
                nodes.push(this.parse_AT_RULE());
            } else if (this.nextStringEquals('/*')) {
                // parse comments
                nodes.push(this.parse_COMMENT_NODE());
            } else {
                let style = this.parse_STYLE_NODE();
                if (style !== null) {
                    nodes.push(style);
                }
            }
            this.skipWhitespaces();
        }
        return nodes;
    }

    public parse_STYLE_NODE(): ICSSStyleNode {
        let node: ICSSStyleNode = {
            type: 'style',
            rules: [],
            declarations: [],
        };

        while(!this.eof() && this.nextChar() !== '{') {
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
        while(!this.eof() && this.nextChar() !== '}') {
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
        } else {
            return node;
        }
    }

    public parse_RULE(): ICSSRule {
        let rule: ICSSRule = {
            specificity: [0,0,0,0],
            selectors: []
        };

        this.skipWhitespaces();
        let hasWhitespace = false;

        // Text
        while(!this.eof() && this.nextChar() !== ',' && this.nextChar() !== '{') {
            let isFirst = (rule.selectors.length == 0);
            let newSelector = this.parse_SELECTOR(isFirst, hasWhitespace);

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
            } else {
                hasWhitespace = false;
            }

            if (this.nextChar() == '(') {
                this.pos++;
                newSelector.arguments = this.parse_PARENTHESIS_EXPR();

                if (this.nextIsWhitespace()) {
                    hasWhitespace = true;
                    this.skipWhitespaces();
                } else {
                    hasWhitespace = false;
                }
            }

            rule.selectors.push(newSelector);
        }
        if (this.nextChar() === ',') {
            // skip ,
            this.pos++;
        }
        if (rule.selectors.length == 0) {
            return null;
        } else {
            return rule;
        }
    }

    public parse_SELECTOR(isFirst: boolean, hasWhitespaceBefore: boolean): ICSSSelector {
        let selector: ICSSSelector = {
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
                    // parse attribute
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
        } else {
            // Match any Text
            while(!this.eof() && this.nextChar().match(/[a-z0-9_\-%]/i)) {
                selector.selector += this.nextChar();
                this.pos++;
            }
        }
        return selector;
    }

    public parse_ATTRIBUTE_SELECTOR(): string {
        let selector = '';
        while(!this.eof() && this.nextChar() != ']') {
            selector += this.nextChar();
            this.pos++;
        }
        this.pos++;
        return selector;
    }

    public parse_DECLARATION(): ICSSStyleDeclaration {
        let declaration: ICSSStyleDeclaration = {
            name: '',
            value: []
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

    public parse_DECLARATION_NAME(): string {
        let name = '';
        this.skipWhitespaces();
        while(!this.eof() && this.nextChar().match(/[^}:]/i)) {
            name += this.nextChar();
            this.pos++;
        }
        return name.toLowerCase().trim();
    }

    public parse_PARENTHESIS_EXPR(): string {
        let expr = '';
        this.skipWhitespaces();
        while(!this.eof() && this.nextChar() != ')') {
            expr += this.nextChar();
            this.pos++;
        }
        this.pos++;
        return expr.trim();
    }

    public parse_DECLARATION_VALUE(): (ICSSKeyword|ICSSUnit|ICSSFunction)[] {
        let values = [];
        this.skipWhitespaces();
        while(!this.eof() && this.nextChar().match(/[^};]/i)) {
            let value = '';
            if (this.nextIsNumeric()) {
                values.push(this.parse_UNIT());
            } else {
                // Match any Text
                while(!this.eof() && this.nextChar().match(/[^};(\s]/i)) {
                    value += this.nextChar();
                    this.pos++;
                }
                if (this.nextChar() == '(') {
                    // skip (
                    this.pos++;

                    // function
                    values.push({
                        type: 'function',
                        value: value,
                        arguments: this.parse_PARENTHESIS_EXPR()
                    });
                } else {
                    values.push({
                        type: 'keyword',
                        value: value
                    });
                }
            }
            this.skipWhitespaces();
        }
        return values;
    }

    public parse_UNIT(): ICSSUnit {
        let unit = {
            type: 'unit',
            value: 0,
            unit: ''
        };
        let number = '';
        while(!this.eof() && this.nextChar().match(/[0-9\-+.]/i)) {
            number += this.nextChar();
            this.pos++;
        }
        unit.value = parseFloat(number);

        // Match any Text
        while(!this.eof() && this.nextChar().match(/[a-zA-Z%]/i)) {
            unit.unit += this.nextChar();
            this.pos++;
        }
        return unit;
    }

    public parse_COMMENT_NODE(): ICSSCommentNode {
        let node: ICSSCommentNode = {
            type: 'comment',
            content: ''
        };

        // skip /*
        this.pos += 2;

        // Text
        while(!this.eof() && !this.nextStringEquals('*/')) {
            node.content += this.nextChar();
            this.pos++;
        }
        // skip */
        this.pos += 2;
        return node;
    }

    public parse_AT_RULE(): ICSSAtNode {
        let node: ICSSAtNode = {
            type: 'at',
            at: '',
            selector: '',
            styles: []
        };

        // skip @
        this.pos++;

        // Match @rule name
        while(!this.eof() && this.nextChar().match(/[a-z0-9_\-]/i)) {
            node.at += this.nextChar();
            this.pos++;
        }
        this.skipWhitespaces();

        // Match @rule selector
        while(!this.eof() && this.nextChar() != ';' && this.nextChar() != '{') {
            node.selector += this.nextChar();
            this.pos++;
        }

        node.selector = node.selector.trim();

        if (this.nextChar() == ';') {
            this.pos++;
        } else {
            this.pos++;
            this.skipWhitespaces();

            if (this.nextChar() == '}') {
                return node;
            }
            node.styles = this.parse_STYLES();
        }
        return node;
    }

    public skipWhitespaces(): void {
        while (!this.eof() && this.nextIsWhitespace()) {
            this.pos++;
        }
    }

    public isAlphaNumeric(string: string) {
        return string.match(/[0-9a-zA-Z-]/i);
    }

    public isWhitespace(string: string): boolean {
        return !/\S/.test(string);
    }

    public nextIsWhitespace(): boolean {
        return this.isWhitespace(this.nextChar());
    }

    public nextIsNumeric(): boolean {
        return this.text.substr(this.pos, 100).match(/^([+-]?[0-9]*[.]?[0-9]+)/i) !== null;
    }

    public nextChar(): string {
        //console.log('TEXT ' + this.text);
        //console.log('CHAR ' + this.pos + ': ' + this.text.substr(this.pos, 40));
        return this.text.charAt(this.pos);
    }

    public nextNChar(offset: number): string {
        return this.text.charAt(this.pos + (offset - 1));
    }

    public nextStringEquals(needle: string): boolean {
        var found = this.text.substr(this.pos, needle.length);
        return found === needle;
    }

    public eof() {
        return this.pos > this.text.length;
    }
}
