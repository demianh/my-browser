
import {IHtmlNode} from "./HtmlParser";
import {ICSSStyleNode} from "./CssParser";

function last(array) {
    return array[array.length-1];
}

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

    private matchStylesForNode(node: RenderTreeNode): any[] {
        console.log(this.dumpParents(node));
        for (let style of this.styles) {
            for (let rule of style.rules) {

                // process rule
                //console.log(rule);
                // copy rule, so we can modify selectors
                let ruleCopy = JSON.parse(JSON.stringify(rule));
                if (this.ruleDoesMatch(node, ruleCopy)) {
                    console.log('WE HAVE A MACTH!!');
                    console.log(JSON.stringify(rule.selectors));
                }
            }
        }
        return [];
    }

    private ruleDoesMatch(node: RenderTreeNode, rule, combinator: string = 'same'): boolean {
        if (rule.selectors.length == 0) {
            console.log('no selector left!');
            return false;
        }
        if (!node) {
            console.log('no node left!');
            return false;
        }
        let selector = last(rule.selectors);
        let doesMatch = false;
        // 'element'|'class'|'id'|'universal'|'attribute'|'pseudo-element'|'pseudo-class'|'function'
        switch(selector.type) {
            case 'element':
                if (node.tag == selector.selector) {
                    doesMatch = true;
                }
                break;
            case 'id':
                break;
        }
        if (doesMatch) {
            // remove the matched rule
            rule.selectors.pop();

            // 'root'|'descendant'|'same'|'child'|'adjacent'|'sibling'
            switch(selector.combinator) {
                case 'root':
                    return true;
                case 'same':
                    return this.ruleDoesMatch(node, rule, selector.combinator);
                case 'descendant':
                case 'child':
                    return this.ruleDoesMatch(node.parent, rule, selector.combinator);
            }
        } else {
            if (combinator == 'descendant') {
                // search in next descendant
                return this.ruleDoesMatch(node.parent, rule, selector.combinator);
            }
            return false;
        }
    }

    private dumpParents(node): string {
        let path = ' > ' + node.type.toUpperCase() + ': ' + node.tag;
        if (node.parent) {
            path = this.dumpParents(node.parent) + path;
        }
        return path;
    }
}
