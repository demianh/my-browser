
import {IHtmlNode} from "./HtmlParser";
import {
    CssParser, ICSSRule, ICSSSelector, ICSSStyleDeclaration, ICSSGenericValue
} from "./CssParser";
import {CssSpec} from "./CssSpec";
import {CssShorthandExpander} from "./CssShorthandExpander";

interface Comparator<T> {
  (a: T, b: T): number
}

export interface IMatchedCSSRule {
    specificity: [number,number,number,number,number];
    selectors: ICSSSelector[];
    declarations: ICSSStyleDeclaration[];
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
    public textLines: string[];

    public styles: IMatchedCSSRule[] = [];
    public computedStyles: {[key: string]: ICSSGenericValue[]} = {};

    // added later by the layout tree
    public top: number = 0;
    public left: number = 0;
    public width: number = 0;
    public height: number = 0;

    constructor(node, parent: RenderTreeNode = null) {
        this.parent = parent;
        this.type = node.type || null;
        this.tag = node.tag || null;
        this.id = node.id || null;
        this.classNames = node.classNames || [];
        this.attributes = node.attributes || {};
        this.params = node.params || [];
        this.content = node.content || null;
        this.textLines = node.textLines || [];

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

        // console.log('-------- Render Tree ---------');

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

        tree.forEach((node, index) => {
            tree[index] = this.computeTextRecursive(node);
        })

        return tree;
    }

    private computeTextRecursive(node: RenderTreeNode): RenderTreeNode {

        if (node.content !== null) {
            node.content = node.content.replace(/\s\s+/g, ' ');
            node.content = node.content.trim();
        }

        node.children.forEach((child, index) => {
            node.children[index] = this.computeTextRecursive(child);
        })
        return node;
    }

    private matchCSSRecursive(node: RenderTreeNode) {

        node.styles = this.matchStylesForNode(node);
        node.computedStyles = this.calculateComputedStyles(node);

        for (let child of node.children) {
            this.matchCSSRecursive(child);
        }
    }

    public calculateComputedStyles(node: RenderTreeNode): {[key: string]: ICSSGenericValue[]} {
        let computed = {};
        if (node.parent) {
            computed = this.getInheritedStyleDeclarations(node.parent.computedStyles);
        } else {
            computed = this.getInheritedStyleDeclarations({});
        }
        node.styles.forEach((style) => {
            style.declarations.forEach((value) => {
                this.applyStyleDeclaration(node, computed, value);
            });
        });
        return computed;
    }

    public applyStyleDeclaration(node: RenderTreeNode, computed, value) {
        computed[value.name] = value.value;

        // handle shorthand properties
        let shorthandFunc = value.name.replace('-','');
        if (typeof CssShorthandExpander[shorthandFunc] == 'function') {
            let derived = CssShorthandExpander[shorthandFunc](value);
            derived.forEach((decl) => {
                this.applyStyleDeclaration(node, computed, decl);
            });
        }

        // handle font-sizes
        if (value.name == 'font-size') {
            let calculated = this.calculateUnitSizeInPx(node, computed, 'font-size');
            computed[value.name] = [{"type": "unit", "value": calculated, "unit": "px"}];
        }

    }

    public calculateUnitSizeInPx(node: RenderTreeNode, computed, declarationName: string): number {
        let current = computed[declarationName][0];

        if (node.parent) {
            if (current.type == 'unit') {
                if (current.unit == 'em') {
                    return <number>current.value * this.calculateUnitSizeInPx(node.parent, node.parent.computedStyles, declarationName);
                }
                if (current.unit == 'rem') {
                    // TODO: use correct size from the root element
                    return <number>current.value * 16;
                }
                // TODO: other units like % inch cm etc.
            } else if (current.type == 'keyword') {
                // <absolute-size> = xx-small | x-small | small | medium | large | x-large | xx-large
                // <relative-size> = larger | smaller
                switch (current.value) {
                    case 'xx-small':
                        return 16 * 0.5;
                    case 'x-small':
                        return 16 * 0.75;
                    case 'small':
                        return 16 * 0.875;
                    case 'large':
                        return 16 * 1.25;
                    case 'x-large':
                        return 16 * 1.5;
                    case 'xx-large':
                        return 16 * 2;
                    case 'larger':
                        return this.calculateUnitSizeInPx(node.parent, node.parent.computedStyles, declarationName) * 1.5;
                    case 'smaller':
                        return this.calculateUnitSizeInPx(node.parent, node.parent.computedStyles, declarationName) * 0.75;
                    case 'medium':
                    default:
                        return this.calculateUnitSizeInPx(node.parent, node.parent.computedStyles, declarationName);
                }
            } else {

            }
            return <number>current.value;
        }
        // fallback
        return <number>current.value;
    }

    public getInheritedStyleDeclarations(parentStyles) {
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

    public matchStylesForNode(node: RenderTreeNode): any[] {
        //console.log(this.dumpParents(node));

        let matchedRules = [];

        // handle inline styles
        if (node.attributes['style']) {
            let cssParser = new CssParser();
            cssParser.setText(node.attributes['style']);
            let inlineStyleDeclarations = cssParser.parse_DECLARATIONS();
            if (inlineStyleDeclarations.length > 0) {
                matchedRules.push({
                    specificity: [2,1,0,0,0],
                    selectors: [{inline: true}],
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
                    case 'sibling':
                        let nodeposition = this.getChildPosition(node);
                        if (nodeposition !== null) {
                            let siblingposition = 0;
                            while(siblingposition < nodeposition) {
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

        // match classes
        if (selector.classes) {
            if (selector.classes.every((cls) => { return node.classNames.indexOf(cls) >= 0})) {
                //console.log('SELECTOR MATCHES: ' + selector.classes.join(', '));
                doesMatch = true;
            } else {
                return false;
            }
        }

        // match ids
        if (selector.ids) {
            if (selector.ids.every((id) => { return node.id == id })) {
                //console.log('SELECTOR MATCHES: ' + selector.ids.join(', '));
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
            path += node.type.toUpperCase() + ': ' + (node.content ? node.content.substr(0, 20) : node.content);
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

    private sortCssRules(cssRules: IMatchedCSSRule[]): IMatchedCSSRule[] {
        return this.stableSort(cssRules, (a: IMatchedCSSRule, b: IMatchedCSSRule) => {
            if (a.specificity[0] < b.specificity[0]) return -1;
            if (a.specificity[0] > b.specificity[0]) return 1;
            if (a.specificity[1] < b.specificity[1]) return -1;
            if (a.specificity[1] > b.specificity[1]) return 1;
            if (a.specificity[2] < b.specificity[2]) return -1;
            if (a.specificity[2] > b.specificity[2]) return 1;
            if (a.specificity[3] < b.specificity[3]) return -1;
            if (a.specificity[3] > b.specificity[3]) return 1;
            if (a.specificity[4] < b.specificity[4]) return -1;
            if (a.specificity[4] > b.specificity[4]) return 1;
            return 0;
        });
    }

    private stableSort<T>(list: T[], cmp: Comparator<T>): T[] {
        let stabilized = list.map((el, index) => <[T, number]>[el, index]);
        let stableCmp: Comparator<[T, number]> = (a, b) => {
            let order = cmp(a[0], b[0]);
            if (order != 0) return order;
            return a[1] - b[1];
        };

        stabilized.sort(stableCmp);
        for (let i = 0; i < list.length; i++) {
            list[i] = stabilized[i][0];
        }

        return list;
    }
}
