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
        console.log('-------- Render Tree ---------');
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
                if (this.matchRule(node, rule)) {
                    console.log('WE HAVE A MATCH: "' + this.dumpRule(rule) + '"');
                    matchedStyles.push(style);
                }
            }
        }
        return matchedStyles;
    }
    matchRule(node, rule) {
        let position = rule.selectors.length - 1;
        return this.matchRuleDirect(node, rule, position);
    }
    matchRuleDescendant(node, rule, position) {
        //console.log('matchRuleDescendant() "' + this.dumpParents(node) + '", "' + this.dumpRule(rule) + '", "' + position + '"');
        if (position < 0) {
            return false;
        } // no selector left
        if (!node) {
            return false;
        } // no node left to match
        let searchnode = node;
        while (searchnode) {
            let result = this.matchRuleDirect(searchnode, rule, position);
            if (result === false) {
                searchnode = searchnode.parent;
            }
            else {
                return true;
            }
        }
        return false;
    }
    matchRuleDirect(node, rule, position) {
        //console.log('matchRuleDirect() "' + this.dumpParents(node) + '", "' + this.dumpRule(rule) + '", "' + position + '"');
        if (position < 0) {
            return false;
        } // no selector left
        if (!node) {
            return false;
        } // no node left to match
        let selector = rule.selectors[position];
        if (this.selectorDoesMatchNode(node, selector)) {
            if (position == 0) {
                // successfully matched last rule
                return true;
            }
            else {
                if (selector.combinator == 'descendant') {
                    return this.matchRuleDescendant(node.parent, rule, position - 1);
                }
                else {
                    return this.matchRuleDirect(node.parent, rule, position - 1);
                }
            }
        }
        else {
            return false;
        }
    }
    selectorDoesMatchNode(node, selector) {
        let doesMatch = false;
        //console.log('checking selector: ' + JSON.stringify(selector) + ' on node ' + this.dumpParents(node));
        // match element
        if (selector.element) {
            if (selector.element == node.tag) {
                //console.log('SELECTOR MATCHES: ' + selector.element);
                doesMatch = true;
            }
            else {
                return false;
            }
        }
        return doesMatch;
    }
    dumpParents(node) {
        //let path = ' > ' + node.type.toUpperCase() + ': ' + node.tag;
        if (!node)
            return '-- null node --';
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
