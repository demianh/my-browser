export class LayoutTree {
    constructor() {
        this.viewportWidth = 0;
        this.viewportHeight = 0;
        this.cachedCanvasContext = null;
    }
    get canvasContext() {
        if (this.cachedCanvasContext === null) {
            let canvas = document.createElement('canvas');
            this.cachedCanvasContext = canvas.getContext("2d");
        }
        return this.cachedCanvasContext;
    }
    createLayoutTree(nodes, viewportWidth, viewportHeight) {
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        for (let node of nodes) {
            this.calculateLayoutRecursive(node, 0, 0);
        }
        return nodes;
    }
    splitTextNodeIntoRows(node) {
        let maxTextWidth = 0;
        let maxWidth;
        if (node.parent) {
            // TODO: parent width is not yet available in this state
            // max width is with of parent (textnodes have no padding etc.)
            maxWidth = node.parent.width;
        }
        else {
            // use viewport width if it's a root element
            maxWidth = this.viewportWidth;
        }
        let words = node.content.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            let testLine = (line + ' ' + words[n]).trim();
            let width = this.getTextWidth(node, testLine);
            //console.log(testLine, width, maxWidth);
            if (width > maxWidth && n > 0) {
                node.textLines.push(line);
                line = words[n];
            }
            else {
                maxTextWidth = Math.max(maxTextWidth, width);
                line = testLine;
            }
        }
        node.textLines.push(line);
        node.width = maxTextWidth;
    }
    calculateLayoutRecursive(node, left, top) {
        let display = node.computedStyles.display[0].value;
        if (display != 'none') {
            node.left = left;
            node.top = top;
            switch (display) {
                case 'inline':
                    if (node.type == 'text') {
                        this.splitTextNodeIntoRows(node);
                        //node.width = this.getTextWidth(node, node.content);
                    }
                    break;
                case 'block':
                default:
                    let parentWidth;
                    if (node.parent) {
                        // width is inner width of parent
                        parentWidth = this.calculateInnerWidth(node.parent);
                    }
                    else {
                        // use viewport width if it's a root element
                        parentWidth = this.viewportWidth;
                    }
                    let widthFromStyles = node.computedStyles.width[0];
                    if (widthFromStyles.value !== 'auto') {
                        if (widthFromStyles.unit == 'px') {
                            node.width = parseFloat(widthFromStyles.value);
                        }
                        if (widthFromStyles.unit == '%') {
                            node.width = parentWidth / 100 * parseFloat(widthFromStyles.value);
                        }
                    }
                    else {
                        node.width = parentWidth;
                    }
                    break;
            }
            let selfHeight = this.calculateHeight(node);
            let leftOffset = left + this.calculateLeftOffset(node);
            let topOffset = top + this.calculateTopOffset(node);
            let heightOfAllChildren = 0;
            let widthOfAllChildren = 0;
            let maxWidthOfChildren = 0;
            let inlineMaxHeight = 0;
            let previousChildDisplay = null;
            for (let child of node.children) {
                let childDisplay = child.computedStyles.display[0].value;
                switch (childDisplay) {
                    case 'inline':
                        if (previousChildDisplay === 'block') {
                            // wrap to new line after block element
                            widthOfAllChildren = 0;
                        }
                        this.calculateLayoutRecursive(child, leftOffset + widthOfAllChildren, topOffset + heightOfAllChildren);
                        widthOfAllChildren += child.width;
                        inlineMaxHeight = Math.max(child.height, inlineMaxHeight);
                        break;
                    case 'block':
                    default:
                        if (previousChildDisplay === 'inline') {
                            heightOfAllChildren += inlineMaxHeight;
                            inlineMaxHeight = 0;
                        }
                        this.calculateLayoutRecursive(child, leftOffset, topOffset + heightOfAllChildren);
                        heightOfAllChildren += child.height;
                        widthOfAllChildren = child.width;
                }
                previousChildDisplay = childDisplay;
                maxWidthOfChildren = Math.max(maxWidthOfChildren, widthOfAllChildren);
            }
            heightOfAllChildren += inlineMaxHeight;
            if (display == 'inline' && node.type !== 'text') {
                // add paddings
                node.width = maxWidthOfChildren + this.calculateHorizontalPaddings(node);
            }
            node.height = heightOfAllChildren + selfHeight;
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
        // TODO: use correct line-height
        if (node.type == 'text') {
            height += node.computedStyles['font-size'][0].value * node.textLines.length;
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
    getTextWidth(node, text) {
        if (typeof document != "undefined") {
            let size = node.computedStyles['font-size'][0].value;
            let family = node.computedStyles['font-size'][0].value;
            let style = node.computedStyles['font-style'][0].value;
            let weight = node.computedStyles['font-weight'][0].value;
            this.canvasContext.font = (style == 'italic' ? 'italic ' : '')
                + (weight == 'bold' ? 'bold ' : '')
                + size + 'px "'
                + family + '"';
            return Math.ceil(this.canvasContext.measureText(text).width);
        }
        else {
            // return an estimated value if dom/canvas is not available
            return Math.ceil(text.length * node.computedStyles['font-size'][0].value / 2);
        }
    }
}
