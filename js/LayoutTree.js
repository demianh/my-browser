export class LayoutTree {
    constructor() {
        this.viewportWidth = 0;
        this.viewportHeight = 0;
    }
    createLayoutTree(nodes, viewportWidth, viewportHeight) {
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        for (let node of nodes) {
            this.calculateLayoutRecursive(node);
        }
        return nodes;
    }
    calculateLayoutRecursive(node) {
        let parentWidth = this.viewportWidth;
        if (node.parent) {
            node.width = this.calculateInnerWidth(node.parent);
            parentWidth = node.parent.width;
        }
        else {
            node.width = this.viewportWidth;
        }
        for (let child of node.children) {
            this.calculateLayoutRecursive(child);
        }
        let childheights = 100;
        node.height = childheights;
    }
    calculateInnerWidth(node) {
        let styles = node.computedStyles;
        let width = node.width;
        // margins
        if (styles['margin-right'][0].type == 'unit') {
            width = width - styles['margin-right'][0].value;
        }
        if (styles['margin-left'][0].type == 'unit') {
            width = width - styles['margin-left'][0].value;
        }
        // paddings
        if (styles['padding-right'][0].type == 'unit') {
            width = width - styles['padding-right'][0].value;
        }
        if (styles['padding-left'][0].type == 'unit') {
            width = width - styles['padding-left'][0].value;
        }
        // borders
        if (styles['border-right-style'][0].value != 'none' && styles['border-right-style'][0].value != 'hidden') {
            if (styles['border-right-width'][0].type == 'unit') {
                width = width - styles['border-right-width'][0].value;
            }
        }
        if (styles['border-left-style'][0].value != 'none' && styles['border-left-style'][0].value != 'hidden') {
            if (styles['border-left-width'][0].type == 'unit') {
                width = width - styles['border-left-width'][0].value;
            }
        }
        return width;
    }
}
