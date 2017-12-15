/**
 * Grammar of CSS 2.1: https://www.w3.org/TR/CSS2/grammar.html
 * CSS3 Tokenization: https://www.w3.org/TR/css-syntax-3/#tokenization
 */

export interface INode {
    type: 'style'|'media'|'comment'|'import';
}

export interface IStyleNode extends INode {
    type: 'style'
    rules: IRule[];
    declarations: IStyleDeclaration[];
}

export interface ICommentNode extends INode {
    type: 'comment';
    content: string;
}

export interface IStyleDeclaration {
    name: string;
    value: string;
}

export interface IRule {
    specificity: [number,number,number,number];
    selectors: ISelector[];
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
export interface ISelector {
    type: 'element'|'class'|'id'|'universal'|'attribute'|'pseudo-element'|'pseudo-class',
    combinator: 'root'|'descendant'|'same'|'child'|'adjacent'|'sibling';
    selector: string;
    arguments: ISelector[];
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

    public parse_STYLES(): INode[] {
        let nodes = [];
        this.skipWhitespaces();
        while (!this.eof()) {
            if (this.nextStringEquals('@')) {
                // parse media, import etc.
            } else if (this.nextStringEquals('/*')) {
                // parse comments
                nodes.push(this.parse_COMMENT_NODE());
            } else {
                let style = this.parse_STYLE_NODE();
                nodes.push(style);
            }
            this.skipWhitespaces();
        }
        return nodes;
    }

    public parse_STYLE_NODE(): IStyleNode {
        let node: IStyleNode = {
            type: 'style',
            rules: [],
            declarations: [],
        };

        while(!this.eof() && this.nextChar() !== '{') {
            this.skipWhitespaces();
            let rule = this.parse_RULE();
            node.rules.push(rule);
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

        return node;
    }

    public parse_RULE(): IRule {
        let rule: IRule = {
            specificity: [0,0,0,0],
            selectors: []
        };

        this.skipWhitespaces();
        let hasWhitespace = false;

        // Text
        while(!this.eof() && this.nextChar() !== ',' && this.nextChar() !== '{') {
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
            } else {
                hasWhitespace = false;
            }
        }
        if (this.nextChar() === ',') {
            // skip ,
            this.pos++;
        }
        return rule;
    }

    public parse_SELECTOR(isFirst: boolean, hasWhitespaceBefore: boolean): ISelector {
        let selector: ISelector = {
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
        while(!this.eof() && this.nextChar().match(/[a-z0-9_\-]/i)) {
            selector.selector += this.nextChar();
            this.pos++;
        }
        return selector;
    }

    public parse_DECLARATION(): IStyleDeclaration {
        let declaration: IStyleDeclaration = {
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

    public parse_DECLARATION_NAME(): string {
        let name = '';
        this.skipWhitespaces();
        while(!this.eof() && this.nextChar().match(/[^}:]/i)) {
            name += this.nextChar();
            this.pos++;
        }
        return name.toLowerCase().trim();
    }

    public parse_DECLARATION_VALUE(): string {
        let value = '';
        while(!this.eof() && this.nextChar().match(/[^};]/i)) {
            value += this.nextChar();
            this.pos++;
        }
        return value.trim();
    }

    public parse_COMMENT_NODE(): ICommentNode {
        let node: ICommentNode = {
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

    public nextChar(): string {
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
