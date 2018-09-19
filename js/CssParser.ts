/**
 * Grammar of CSS 2.1: https://www.w3.org/TR/CSS2/grammar.html
 * CSS3 Tokenization: https://www.w3.org/TR/css-syntax-3/#tokenization
 */
import {CssSpec} from "./CssSpec";

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
    value: ICSSGenericValue[];
}

export interface ICSSGenericValue {
    type: string
    value: number|string;
    unit?: string;
    arguments?: string;
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

/**
 * First Specificity Index:
 * Deklarationen im Browser-Stylesheet 						0
 * Deklarationen des Benutzers								1
 * Deklarationen des Autors									2
 * Wichtige Deklarationen (mit !important) des Autors		3
 * Wichtige Deklarationen (mit !important) des Benutzers	4
 */

export interface ICSSRule {
    specificity: [number, number,number,number,number];
    selectors: ICSSSelector[];
}

/**
 * Combinators:
 * root: first rule
 * descendant: space
 * child: >
 * adjacent sibling: + (immediate sibling after)
 * general sibling: ~ (any sibling element after)
 *
 * : pseudo-class
 * :: pseudo-element
 */
export interface ICSSSelector {
    element?: string; // tag-name or *
    ids?: string[];
    classes?: string[];
    attributes?: string[];
    pseudoElements?: string[];
    pseudoClasses?: string[];
    functions?: ICSSSelectorFunction[];
    inline?: boolean;
    combinator: 'root'|'descendant'|'child'|'adjacent'|'sibling';
}

export interface ICSSSelectorFunction {
    name: string;
    arguments?: ICSSSelector[]|string;
}

export class CssParser {

    private text = '';
    private pos = 0;
    private last_next_char_pos = 0;
    private same_pos_counter = 0;
    private baseSpecificity: number = 2;

    public parse(text: string, baseSpecificity: number = 2) {
        //console.log(text);
        this.text = text;
        this.pos = 0;
        this.baseSpecificity = baseSpecificity;
        return this.parse_STYLES();
    }

    public setText(text: string): void {
        this.text = text;
        this.pos = 0;
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

        node.declarations = this.parse_DECLARATIONS();

        // dont return empty style nodes
        if (node.rules.length == 0 && node.declarations.length == 0) {
            return null;
        } else {
            return node;
        }
    }

    public parse_RULE(): ICSSRule {
        let rule: ICSSRule = {
            specificity: [this.baseSpecificity,0,0,0,0],
            selectors: []
        };

        this.skipWhitespaces();

        // Text
        while(!this.eof() && this.nextChar() !== ',' && this.nextChar() !== '{') {
            let isFirst = (rule.selectors.length == 0);
            let sel = this.parse_SELECTOR(isFirst);

            // increase specificity

            // 1 ID
            if (sel.ids && sel.ids.length) {
                rule.specificity[2] += sel.ids.length;
            }

            // 2 CLASSES
            if (sel.classes && sel.classes.length) {
                rule.specificity[3] += sel.classes.length;
            }
            if (sel.attributes && sel.attributes.length) {
                rule.specificity[3] += sel.attributes.length;
            }
            if (sel.pseudoClasses && sel.pseudoClasses.length) {
                rule.specificity[3] += sel.pseudoClasses.length;
            }

            // 3 ELEMENTS
            if (sel.element) {
                rule.specificity[4]++;
            }
            if (sel.pseudoElements && sel.pseudoElements.length) {
                rule.specificity[4] += sel.pseudoElements.length;
            }

            rule.selectors.push(sel);

            this.skipWhitespaces();
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

    public parse_SELECTOR(isFirst: boolean): ICSSSelector {
        let selector: ICSSSelector = {
            combinator: isFirst ? 'root' : 'descendant',
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

        while(!this.eof() && !this.nextIsWhitespace() && !this.nextChar().match(/[{+,>~]/i)) {
            switch (this.nextChar()) {
                case '.': {
                    // parse class
                    this.pos++;
                    if (!selector.classes) {
                        selector.classes = [];
                    }
                    selector.classes.push(this.parse_SELECTOR_TEXT());
                    break;
                }
                case '#': {
                    // parse id
                    this.pos++;
                    if (!selector.ids) {
                        selector.ids = [];
                    }
                    selector.ids.push(this.parse_SELECTOR_TEXT());
                    break;
                }
                case '[': {
                    // parse attribute
                    this.pos++;
                    if (!selector.attributes) {
                        selector.attributes = [];
                    }
                    // Match rules enclosed in brackets: [att='var']
                    selector.attributes.push(this.parse_ATTRIBUTE_SELECTOR());
                    break;
                }
                /*case '(': {
                    // parse functions
                    this.pos++;
                    if (!selector.functions) {
                        selector.functions = [];
                    }
                    this.pos++;
                    let args = this.parse_PARENTHESIS_EXPR();
                    break;
                }*/
                case ':': {
                    // parse pseudo
                    if (this.nextIsFunction()) {
                        // functions like :not(...)
                        let func: ICSSSelectorFunction = {
                            name: '',
                            arguments: ''
                        };
                        // skip :
                        this.pos++;
                        func.name = this.parse_SELECTOR_TEXT();
                        this.skipWhitespaces();
                        // skip (
                        this.pos++;
                        func.arguments = this.parse_PARENTHESIS_EXPR();
                        if (!selector.functions) {
                            selector.functions = [];
                        }
                        selector.functions.push(func);
                    } else {
                        this.pos++;
                        if (this.nextChar() == ':') {
                            // pseudo-element
                            this.pos++;
                            if (!selector.pseudoElements) {
                                selector.pseudoElements = [];
                            }
                            selector.pseudoElements.push(this.parse_SELECTOR_TEXT());
                        } else {
                            // pseudo-class
                            if (!selector.pseudoClasses) {
                                selector.pseudoClasses = [];
                            }
                            selector.pseudoClasses.push(this.parse_SELECTOR_TEXT());
                        }
                    }
                    break;
                }
                default: {
                    let element = this.parse_SELECTOR_TEXT();
                    if (!selector.element) {
                        selector.element = element;
                    }
                }
            }
        }
        return selector;
    }

    public parse_SELECTOR_TEXT(): string {
        let selector = '';
        while(!this.eof() && this.nextChar().match(/[a-z0-9_\-*%]/i)) {
            selector += this.nextChar();
            this.pos++;
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

    public parse_DECLARATIONS(): ICSSStyleDeclaration[] {
        let declarations: ICSSStyleDeclaration[] = [];
        this.skipWhitespaces();
        while(!this.eof() && this.nextChar() !== '}') {
            let newDeclaration = this.parse_DECLARATION();
            // only add non-empty declarations
            if (newDeclaration.value.length > 0) {
                // de-duplicate declarations
                declarations = declarations.filter((decl) => {
                    return decl.name !== newDeclaration.name;
                });
                declarations.push(newDeclaration);
            }
            this.skipWhitespaces();
        }
        // skip }
        this.pos++;
        return declarations;
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

                    let args = this.parse_PARENTHESIS_EXPR();
                    let type = 'function';

                    if (['rgb', 'rgba', 'hsl', 'hsla'].indexOf(value.toLowerCase()) >= 0) {
                        type = 'color';
                    }
                    // function
                    values.push({
                        type: type,
                        value: value,
                        arguments: args
                    });
                } else {
                    if (this.isColor(value)) {
                        values.push({
                            type: 'color',
                            value: value
                        });
                    } else {
                        values.push({
                            type: 'keyword',
                            value: value
                        });
                    }
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

    public isColor(value: string): boolean {
        if (CssSpec.COLOR_NAMES[value.toLowerCase()] !== undefined) {
            return true;
        }
        if (value.match(/^#(?:[0-9a-f]{3}){1,2}$/i)) {
            return true;
        }
        return false;
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

    public nextIsFunction(): boolean {
        return this.text.substr(this.pos, 100).match(/^:([a-zA-Z-]+\s*\()/i) !== null;
    }

    public nextChar(): string {
        //console.log('TEXT ' + this.text);
        //console.log('CHAR ' + this.pos + ': ' + this.text.substr(this.pos, 40));
        //console.log(this.text.charAt(this.pos));

        // try to catch infinite loops
        if (this.pos == this.last_next_char_pos) {
            this.same_pos_counter++;
            if (this.same_pos_counter > 1000) {
                this.reportParseError();
            }
        } else {
            this.same_pos_counter = 0;
            this.last_next_char_pos = this.pos;
        }
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

    public reportParseError() {
        let before = 60;
        let after = 40;
        let text_before = this.text.substr(Math.max(this.pos - before, 0), Math.min(this.pos, before));
        let wrong_char = this.text.charAt(this.pos);
        let text_after = this.text.substr(this.pos + 1, after);
        let error = "CSS Parse Error at Position " + this.pos + '/' + (this.text.length - 1);
        error += "\n";
        error += text_before + '----->' + wrong_char + '<-----' + text_after;
        throw error;
    }
}
