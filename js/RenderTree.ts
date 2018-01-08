
import {IHtmlNode} from "./HtmlParser";
import {ICSSRule, ICSSSelector} from "./CssParser";

export class RenderTreeNode {
    public parent: RenderTreeNode = null;
    public children: RenderTreeNode[] = [];

    public type: string;
    public tag: string;
    public id: string;
    public classNames: string[];
    public attributes: {};
    public params: string[];
    public content: string;

    public styles: any[];

    constructor(node, parent: RenderTreeNode = null) {
        this.parent = parent;
        this.type = node.type || null;
        this.tag = node.tag || null;
        this.id = node.id || null;
        this.classNames = node.classNames || [];
        this.attributes = node.attributes || {};
        this.params = node.params || [];
        this.content = node.content || null;

        if (node.children) {
            for (let child of node.children) {
                if (child.type == 'element' || child.type == 'text') {
                    this.children.push(new RenderTreeNode(child, this));
                }
            }
        }
    }
}


export class RenderTree {

    private styles = [];

    public createRenderTree(nodes: IHtmlNode[], styles: any[]): any[] {

        console.log('-------- Render Tree ---------');

        this.styles = styles;

        let tree: RenderTreeNode[] = [];

        for (let node of nodes) {
            if (node.type == 'element' || node.type == 'text') {
                tree.push(new RenderTreeNode(node));
            }
        }

        for (let node of tree) {
            this.matchCSSRecursive(node);
        }

        return tree;
    }

    private matchCSSRecursive(node: RenderTreeNode) {

        node.styles = this.matchStylesForNode(node);

        for (let child of node.children) {
            this.matchCSSRecursive(child);
        }
    }

    public matchStylesForNode(node: RenderTreeNode): any[] {
        console.log(this.dumpParents(node));

        let matchedStyles = [];
        for (let style of this.styles) {
            for (let rule of style.rules) {

                // process rule
                if (this.matchRule(node, rule)) {
                    console.log('WE HAVE A MATCH: "' + this.dumpRule(rule) + '"');
                    matchedStyles.push(style);
                }
            }
        }
        return matchedStyles;
    }

    private matchRule(node: RenderTreeNode, rule: ICSSRule): boolean {
        let position = rule.selectors.length - 1;
        return this.matchRuleDirect(node, rule, position);
    }

    private matchRuleDescendant(node: RenderTreeNode, rule: ICSSRule, position: number): boolean {
        //console.log('matchRuleDescendant() "' + this.dumpParents(node) + '", "' + this.dumpRule(rule) + '", "' + position + '"');

        if (position < 0) { return false; } // no selector left
        if (!node) { return false; } // no node left to match

        let searchnode = node;

        while (searchnode) {
            let result = this.matchRuleDirect(searchnode, rule, position);
            if (result === false) {
                searchnode = searchnode.parent;
            } else {
                return true;
            }
        }
        return false;
    }

    private matchRuleDirect(node: RenderTreeNode, rule: ICSSRule, position: number): boolean { //false|{node: RenderTreeNode; position: number} {
        //console.log('matchRuleDirect() "' + this.dumpParents(node) + '", "' + this.dumpRule(rule) + '", "' + position + '"');

        if (position < 0) { return false; } // no selector left
        if (!node) { return false; } // no node left to match

        let selector: ICSSSelector = rule.selectors[position];

        if (this.selectorDoesMatchNode(node, selector)) {
            if (position == 0) {
                // successfully matched last rule
                return true;
            } else {
                switch (selector.combinator) {
                    case 'descendant':
                        return this.matchRuleDescendant(node.parent, rule, position - 1);
                    case 'child':
                        return this.matchRuleDirect(node.parent, rule, position - 1);
                    case 'adjacent':
                        let childposition = this.getChildPosition(node);
                        if (childposition !== null) {
                            return this.matchRuleDirect(node.parent.children[childposition - 1], rule, position - 1);
                        }
                        return false;
                    default:
                        throw "unsupported combinator: " + selector.combinator;
                }
            }
        } else {
            return false;
        }
    }

    private selectorDoesMatchNode(node: RenderTreeNode, selector: ICSSSelector) {
        let doesMatch = false;

        //console.log('checking selector: ' + JSON.stringify(selector) + ' on node ' + this.dumpParents(node));

        // match element
        if (selector.element) {
            if (selector.element == node.tag) {
                //console.log('SELECTOR MATCHES: ' + selector.element);
                doesMatch = true;
            } else {
                return false;
            }
        }
        return doesMatch;
    }

    private getChildPosition(node): number {
        if (!node.parent) {
            return null;
        }
        for(let i = 0; i < node.parent.children.length; i++) {
            if (node === node.parent.children[i]) {
                return i;
            }
        }
        return null;
    }

    private dumpParents(node): string {
        //let path = ' > ' + node.type.toUpperCase() + ': ' + node.tag;
        if (!node) return '-- null node --';
        let path = ' > ';
        if (node.type == 'element') {
            path += node.tag;
        } else if (node.type == 'text') {
            path += node.type.toUpperCase() + ': ' + node.content;
        } else {
            path += node.type.toUpperCase() + ': ' + node.tag;
        }
        if (node.parent) {
            path = this.dumpParents(node.parent) + path;
        }
        return path;
    }

    private dumpRule(rule: ICSSRule): string {
        let dump = '';
        rule.selectors.forEach((selector) => {
            if (selector.combinator !== 'root') {
                dump += ' ';
            }
            if (selector.combinator == 'child') {
                dump += '> ';
            }
            if (selector.combinator == 'adjacent') {
                dump += '+ ';
            }
            if (selector.combinator == 'sibling') {
                dump += '~ ';
            }
            if (selector.element) {
                dump += selector.element;
            }
            if (selector.ids) {
                selector.ids.forEach((id) => dump += '#'+id);
            }
            if (selector.classes) {
                selector.classes.forEach((cls) => dump += '.'+cls);
            }
            if (selector.attributes) {
                selector.attributes.forEach((att) => dump += '['+att+']');
            }
            if (selector.pseudoClasses) {
                selector.pseudoClasses.forEach((cls) => dump += ':'+cls);
            }
            if (selector.pseudoElements) {
                selector.pseudoElements.forEach((el) => dump += '::'+el);
            }
            if (selector.functions) {
                selector.functions.forEach((func) => dump += ':'+func.name+'('+func.arguments+')');
            }
        });
        return dump;
    }
}
