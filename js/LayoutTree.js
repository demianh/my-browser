export class LayoutTree {
    constructor() {
        this.viewportWidth = 0;
        this.viewportHeight = 0;
        this.canvasContext = null;
    }
    createLayoutTree(nodes, viewportWidth, viewportHeight) {
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        for (let node of nodes) {
            this.calculateLayoutRecursive(node, 0, 0);
        }
        return nodes;
    }
    calculateLayoutRecursive(node, left, top) {
        let display = node.computedStyles.display[0].value;
        if (display != 'none') {
            node.left = left;
            node.top = top;
            switch (display) {
                case 'inline':
                    if (node.type == 'text') {
                        node.width = this.getTextWidth(node);
                    }
                    break;
                case 'block':
                default:
                    if (node.parent) {
                        // width is inner with of parent
                        node.width = this.calculateInnerWidth(node.parent);
                    }
                    else {
                        // use viewport width if it's a root element
                        node.width = this.viewportWidth;
                    }
                    break;
            }
            let selfHeight = this.calculateHeight(node);
            let leftOffset = left + this.calculateLeftOffset(node);
            let topOffset = top + this.calculateTopOffset(node);
            let childHeights = 0;
            let childWidths = 0;
            for (let child of node.children) {
                let childDisplay = child.computedStyles.display[0].value;
                if (childDisplay == 'block') {
                    this.calculateLayoutRecursive(child, leftOffset, topOffset + childHeights);
                }
                if (childDisplay == 'inline') {
                    this.calculateLayoutRecursive(child, leftOffset + childWidths, top);
                }
                childHeights += child.height;
                childWidths += child.width;
            }
            if (display == 'inline' && node.type !== 'text') {
                // add paddings
                node.width = childWidths + this.calculateHorizontalPaddings(node);
            }
            node.height = childHeights + selfHeight;
        }
    }
    calculateLeftOffset(node) {
        let left = 0;
        let rules = ['border-left-width', 'margin-left', 'padding-left'];
        rules.forEach((rule) => {
            if (node.computedStyles[rule] && node.computedStyles[rule].length > 0) {
                let style = node.computedStyles[rule][0];
                if (style.type == 'unit' && style.unit && style.unit == 'px') {
                    left = left + style.value;
                }
            }
        });
        return left;
    }
    calculateTopOffset(node) {
        let top = 0;
        let rules = ['border-top-width', 'margin-top', 'padding-top'];
        rules.forEach((rule) => {
            if (node.computedStyles[rule] && node.computedStyles[rule].length > 0) {
                let style = node.computedStyles[rule][0];
                if (style.type == 'unit' && style.unit && style.unit == 'px') {
                    top = top + style.value;
                }
            }
        });
        return top;
    }
    calculateHeight(node) {
        let height = 0;
        // add some space for the text
        if (node.type == 'text') {
            height += node.computedStyles['font-size'][0].value;
        }
        let rules = ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom', 'border-top-width', 'border-bottom-width'];
        rules.forEach((rule) => {
            if (node.computedStyles[rule] && node.computedStyles[rule].length > 0) {
                let style = node.computedStyles[rule][0];
                if (style.type == 'unit' && style.unit && style.unit == 'px') {
                    height = height + style.value;
                }
            }
        });
        return height;
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
    calculateHorizontalPaddings(node) {
        let styles = node.computedStyles;
        let width = 0;
        // paddings
        if (styles['padding-right'][0].type == 'unit') {
            width = width + styles['padding-right'][0].value;
        }
        if (styles['padding-left'][0].type == 'unit') {
            width = width + styles['padding-left'][0].value;
        }
        return width;
    }
    getTextWidth(node) {
        if (typeof document != "undefined") {
            if (this.canvasContext === null) {
                let canvas = document.createElement('canvas');
                this.canvasContext = canvas.getContext("2d");
            }
            let size = node.computedStyles['font-size'][0].value;
            let family = node.computedStyles['font-size'][0].value;
            let style = node.computedStyles['font-style'][0].value;
            let weight = node.computedStyles['font-weight'][0].value;
            this.canvasContext.font = (style == 'italic' ? 'italic ' : '')
                + (weight == 'bold' ? 'bold ' : '')
                + size + 'px "'
                + family + '"';
            return Math.ceil(this.canvasContext.measureText(node.content).width);
        }
        else {
            // return an estimated value if dom/canvas is not available
            return Math.ceil(node.content.length * node.computedStyles['font-size'][0].value / 2);
        }
    }
}
