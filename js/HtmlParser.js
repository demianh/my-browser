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
export class HtmlParser {
    constructor() {
        // command?
        this.VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
        this.RAWTEXT_ELEMENTS = ['script', 'style'];
        this.ESCAPABLE_RAWTEXT_ELEMENTS = ['textarea', 'title'];
        this.text = '';
        this.pos = 0;
    }
    parse(text) {
        this.text = text;
        this.pos = 0;
        let nodes = this.parse_NODES();
        return nodes;
    }
    parse_NODES() {
        let nodes = [];
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
                let textnode = this.parse_TEXT_NODE();
                if (/\S/.test(textnode.content)) {
                    nodes.push(textnode);
                }
            }
        }
        return nodes;
    }
    parse_TEXT_NODE() {
        let node = {
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
    }
    parse_RAW_TEXT_NODE(closing_tag) {
        let node = {
            type: 'text',
            content: ''
        };
        // Text
        while (!this.eof() && !this.nextStringEquals('</' + closing_tag)) {
            node.content += this.nextChar();
            this.pos++;
        }
        return node;
    }
    parse_COMMENT_NODE() {
        let node = {
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
    }
    parse_DOCTYPE_NODE() {
        let node = {
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
    }
    parse_ELEMENT_NODE() {
        let node = {
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
            let att = this.parse_ATTRIBUTE();
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
    }
    parse_TAGNAME() {
        let tag = '';
        while (!this.eof() && this.isAlphaNumeric(this.nextChar())) {
            tag += this.nextChar();
            this.pos++;
        }
        return tag.toLowerCase();
    }
    parse_ATTRIBUTE() {
        let name = this.parse_ATTRIBUTENAME();
        let value = null;
        this.skipWhitespaces();
        if (this.nextChar() === '=') {
            this.parse_EQUAL();
            value = this.parse_ATTRIBUTEVALUE();
        }
        return [name, value];
    }
    parse_ATTRIBUTENAME() {
        let name = '';
        this.skipWhitespaces();
        while (!this.eof() && this.nextChar().match(/[^\t\n\f \/>"'=]/i)) {
            name += this.nextChar();
            this.pos++;
        }
        return name.toLowerCase();
    }
    parse_ATTRIBUTEVALUE() {
        let value = '';
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
    }
    parse_EQUAL() {
        this.skipWhitespaces();
        while (!this.eof() && this.nextChar() !== '=') {
            this.pos++;
        }
        this.pos++;
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
        //console.log(this.text.charAt(this.pos));
        return this.text.charAt(this.pos);
    }
    nextNChar(offset, length = 1) {
        return this.text.charAt(this.pos + (offset - 1));
    }
    nextChars(length = 1) {
        return this.text.substr(this.pos, length);
    }
    nextStringEquals(needle) {
        var found = this.text.substr(this.pos, needle.length).toLowerCase();
        return found === needle;
    }
    eof() {
        return this.pos > this.text.length;
    }
}
