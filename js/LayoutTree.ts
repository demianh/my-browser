import {RenderTreeNode} from "./RenderTree";


export class LayoutTree {

    private viewportWidth: number = 0;
    private viewportHeight: number = 0;

    public createLayoutTree(nodes: RenderTreeNode[], viewportWidth: number, viewportHeight: number): RenderTreeNode[] {

        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;

        for (let node of nodes) {
            this.calculateLayoutRecursive(node, 0, 0);
        }

        return nodes;
    }

    public calculateLayoutRecursive(node: RenderTreeNode, left: number, top: number) {
        let display = node.computedStyles.display[0].value;

        if (display != 'none') {
            node.left = left;
            node.top = top;

            if (node.parent) {
                node.width = this.calculateInnerWidth(node.parent);
            } else {
                node.width = this.viewportWidth;
            }

            let selfHeight = this.calculateHeight(node);

            let leftOffset = left + this.calculateLeftOffset(node);
            let topOffset = top + this.calculateTopOffset(node);

            let childHeights = 0;
            for (let child of node.children) {
                this.calculateLayoutRecursive(child, leftOffset, topOffset + childHeights);
                childHeights += child.height;
            }

            node.height = childHeights + selfHeight;
        }


    }

    private calculateLeftOffset(node: RenderTreeNode): number {
        let left = 0;
        let rules = ['border-left-width', 'margin-left', 'padding-left'];
        rules.forEach((rule) => {
            if (node.computedStyles[rule] && node.computedStyles[rule].length > 0) {
                let style = node.computedStyles[rule][0];
                if (style.type == 'unit' && style.unit && style.unit == 'px') {
                    left = left + <number> style.value;
                }
            }
        });
        return left;
    }

    private calculateTopOffset(node: RenderTreeNode): number {
        let top = 0;
        let rules = ['border-top-width', 'margin-top', 'padding-top'];
        rules.forEach((rule) => {
            if (node.computedStyles[rule] && node.computedStyles[rule].length > 0) {
                let style = node.computedStyles[rule][0];
                if (style.type == 'unit' && style.unit && style.unit == 'px') {
                    top = top + <number> style.value;
                }
            }
        });
        return top;
    }

    private calculateHeight(node: RenderTreeNode) {
        let height = 0;

        // add some space for the text
        if (node.type == 'text') {
            height += 20;
        }

        let rules = ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom', 'border-top-width', 'border-bottom-width'];
        rules.forEach((rule) => {
            if (node.computedStyles[rule] && node.computedStyles[rule].length > 0) {
                let style = node.computedStyles[rule][0];
                if (style.type == 'unit' && style.unit && style.unit == 'px') {
                    height = height + <number> style.value;
                }
            }
        });

        return height;
    }

    private calculateInnerWidth(node: RenderTreeNode): number {
        let styles = node.computedStyles;
        let width: number = node.width;

        // margins
        if (styles['margin-right'][0].type == 'unit') {
            width = width - <number> styles['margin-right'][0].value;
        }
        if (styles['margin-left'][0].type == 'unit') {
            width = width - <number> styles['margin-left'][0].value;
        }

        // paddings
        if (styles['padding-right'][0].type == 'unit') {
            width = width - <number> styles['padding-right'][0].value;
        }
        if (styles['padding-left'][0].type == 'unit') {
            width = width - <number> styles['padding-left'][0].value;
        }

        // borders
        if (styles['border-right-style'][0].value != 'none' && styles['border-right-style'][0].value != 'hidden') {
            if (styles['border-right-width'][0].type == 'unit') {
                width = width - <number> styles['border-right-width'][0].value;
            }
        }
        if (styles['border-left-style'][0].value != 'none' && styles['border-left-style'][0].value != 'hidden') {
            if (styles['border-left-width'][0].type == 'unit') {
                width = width - <number> styles['border-left-width'][0].value;
            }
        }

        return width;
    }
}
