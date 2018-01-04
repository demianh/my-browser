export class RenderTreeNode {
    constructor(node, parent = null) {
        this.parent = null;
        this.children = [];
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
    constructor() {
        this.styles = [];
    }
    createRenderTree(nodes, styles) {
        this.styles = styles;
        let tree = [];
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
    matchCSSRecursive(node) {
        node.styles = this.matchStylesForNode(node);
        for (let child of node.children) {
            this.matchCSSRecursive(child);
        }
    }
    matchStylesForNode(node) {
        console.log(this.dumpParents(node));
        let matchedStyles = [];
        for (let style of this.styles) {
            for (let rule of style.rules) {
                // process rule
                if (this.ruleDoesMatch(node, rule)) {
                    console.log('WE HAVE A MATCH: "' + this.dumpRule(rule) + '"');
                    matchedStyles.push(style);
                }
            }
        }
        return matchedStyles;
    }
    ruleDoesMatch(node, rule, combinator = '', position = null) {
        if (position < 0) {
            //console.log('no selector left!');
            return false;
        }
        if (!node) {
            //console.log('no node left!');
            return false;
        }
        if (position === null) {
            position = rule.selectors.length - 1;
        }
        let selector = rule.selectors[position];
        let doesMatch = false;
        // match element
        if (selector.element) {
            if (selector.element == node.tag) {
                doesMatch = true;
            }
        }
        if (doesMatch) {
            // go to next rule
            position--;
            // 'root'|'descendant'|'child'|'adjacent'|'sibling'
            switch (selector.combinator) {
                case 'root':
                    return true;
                case 'descendant':
                    return this.ruleDoesMatch(node.parent, rule, selector.combinator, position);
                case 'child':
                    if (combinator == 'descendant') {
                        let searchnode = node;
                        while (searchnode.parent) {
                            let test = this.ruleDoesMatch(searchnode.parent, rule, selector.combinator, position);
                            if (test) {
                                return true;
                            }
                            else {
                                searchnode = searchnode.parent;
                            }
                        }
                        return false;
                    }
                    else {
                        return this.ruleDoesMatch(node.parent, rule, selector.combinator, position);
                    }
                case 'adjacent':
                case 'sibling':
                    // TODO: not implemented
                    return false;
            }
        }
        else {
            if (combinator == 'descendant') {
                // search in next descendant
                return this.ruleDoesMatch(node.parent, rule, selector.combinator, position);
            }
            return false;
        }
    }
    dumpParents(node) {
        //let path = ' > ' + node.type.toUpperCase() + ': ' + node.tag;
        let path = ' > ';
        if (node.type == 'element') {
            path += node.tag;
        }
        else if (node.type == 'text') {
            path += node.type.toUpperCase() + ': ' + node.content;
        }
        else {
            path += node.type.toUpperCase() + ': ' + node.tag;
        }
        if (node.parent) {
            path = this.dumpParents(node.parent) + path;
        }
        return path;
    }
    dumpRule(rule) {
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
                selector.ids.forEach((id) => dump += '#' + id);
            }
            if (selector.classes) {
                selector.classes.forEach((cls) => dump += '.' + cls);
            }
            if (selector.attributes) {
                selector.attributes.forEach((att) => dump += '[' + att + ']');
            }
            if (selector.pseudoClasses) {
                selector.pseudoClasses.forEach((cls) => dump += ':' + cls);
            }
            if (selector.pseudoElements) {
                selector.pseudoElements.forEach((el) => dump += '::' + el);
            }
            if (selector.functions) {
                selector.functions.forEach((func) => dump += ':' + func.name + '(' + func.arguments + ')');
            }
        });
        return dump;
    }
}
