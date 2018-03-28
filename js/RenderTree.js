import { CssParser } from "./CssParser";
import { CssSpec } from "./CssSpec";
import { CssShorthandExpander } from "./CssShorthandExpander";
export class RenderTreeNode {
    constructor(node, parent = null) {
        this.parent = null;
        this.children = [];
        this.styles = [];
        this.computedStyles = {};
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
        // console.log('-------- Render Tree ---------');
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
        node.computedStyles = this.calculateComputedStyles(node);
        for (let child of node.children) {
            this.matchCSSRecursive(child);
        }
    }
    calculateComputedStyles(node) {
        let computed = {};
        if (node.parent) {
            computed = this.getInheritedStyleDeclarations(node.parent.computedStyles);
        }
        else {
            computed = this.getInheritedStyleDeclarations({});
        }
        node.styles.forEach((style) => {
            style.declarations.forEach((value) => {
                this.applyStyleDeclaration(computed, value);
            });
        });
        return computed;
    }
    applyStyleDeclaration(computed, value) {
        computed[value.name] = value.value;
        // handle shorthand properties
        let shorthandFunc = value.name.replace('-', '');
        if (typeof CssShorthandExpander[shorthandFunc] == 'function') {
            let derived = CssShorthandExpander[shorthandFunc](value);
            derived.forEach((decl) => {
                this.applyStyleDeclaration(computed, decl);
            });
        }
    }
    getInheritedStyleDeclarations(parentStyles) {
        // copy objects so we don't modify the originals
        let computed = JSON.parse(JSON.stringify(CssSpec.INITIAL_VALUES));
        parentStyles = JSON.parse(JSON.stringify(parentStyles));
        Object.keys(parentStyles).forEach((key) => {
            if (CssSpec.INHERITED_PROPS.indexOf(key) >= 0) {
                computed[key] = parentStyles[key];
            }
        });
        return computed;
    }
    matchStylesForNode(node) {
        //console.log(this.dumpParents(node));
        let matchedRules = [];
        // handle inline styles
        if (node.attributes['style']) {
            let cssParser = new CssParser();
            cssParser.setText(node.attributes['style']);
            let inlineStyleDeclarations = cssParser.parse_DECLARATIONS();
            if (inlineStyleDeclarations.length > 0) {
                matchedRules.push({
                    specificity: [2, 1, 0, 0, 0],
                    selectors: [{ inline: true }],
                    declarations: inlineStyleDeclarations
                });
            }
        }
        for (let style of this.styles) {
            // only process style rules for now, ignore @media etc.
            if (style.type == 'style') {
                for (let rule of style.rules) {
                    // process rule
                    if (this.matchRule(node, rule)) {
                        // console.log('WE HAVE A MATCH: "' + this.dumpRule(rule) + '"');
                        matchedRules.push({
                            specificity: rule.specificity,
                            selectors: rule.selectors,
                            declarations: style.declarations
                        });
                    }
                }
            }
        }
        matchedRules = this.sortCssRules(matchedRules);
        return matchedRules;
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
                    case 'sibling':
                        let nodeposition = this.getChildPosition(node);
                        if (nodeposition !== null) {
                            let siblingposition = 0;
                            while (siblingposition < nodeposition) {
                                if (this.matchRuleDirect(node.parent.children[siblingposition], rule, position - 1)) {
                                    return true;
                                }
                                siblingposition++;
                            }
                        }
                        return false;
                    default:
                        throw "unsupported combinator: " + selector.combinator;
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
        // match classes
        if (selector.classes) {
            if (selector.classes.every((cls) => { return node.classNames.indexOf(cls) >= 0; })) {
                //console.log('SELECTOR MATCHES: ' + selector.classes.join(', '));
                doesMatch = true;
            }
            else {
                return false;
            }
        }
        // match ids
        if (selector.ids) {
            if (selector.ids.every((id) => { return node.id == id; })) {
                //console.log('SELECTOR MATCHES: ' + selector.ids.join(', '));
                doesMatch = true;
            }
            else {
                return false;
            }
        }
        return doesMatch;
    }
    getChildPosition(node) {
        if (!node.parent) {
            return null;
        }
        for (let i = 0; i < node.parent.children.length; i++) {
            if (node === node.parent.children[i]) {
                return i;
            }
        }
        return null;
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
            path += node.type.toUpperCase() + ': ' + (node.content ? node.content.substr(0, 20) : node.content);
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
    sortCssRules(cssRules) {
        return this.stableSort(cssRules, (a, b) => {
            if (a.specificity[0] < b.specificity[0])
                return -1;
            if (a.specificity[0] > b.specificity[0])
                return 1;
            if (a.specificity[1] < b.specificity[1])
                return -1;
            if (a.specificity[1] > b.specificity[1])
                return 1;
            if (a.specificity[2] < b.specificity[2])
                return -1;
            if (a.specificity[2] > b.specificity[2])
                return 1;
            if (a.specificity[3] < b.specificity[3])
                return -1;
            if (a.specificity[3] > b.specificity[3])
                return 1;
            if (a.specificity[4] < b.specificity[4])
                return -1;
            if (a.specificity[4] > b.specificity[4])
                return 1;
            return 0;
        });
    }
    stableSort(list, cmp) {
        let stabilized = list.map((el, index) => [el, index]);
        let stableCmp = (a, b) => {
            let order = cmp(a[0], b[0]);
            if (order != 0)
                return order;
            return a[1] - b[1];
        };
        stabilized.sort(stableCmp);
        for (let i = 0; i < list.length; i++) {
            list[i] = stabilized[i][0];
        }
        return list;
    }
}
