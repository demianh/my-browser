import {RenderTreeNode} from "./RenderTree";


export class LayoutTree {

    private viewportWidth: number = 0;
    private viewportHeight: number = 0;

    public createLayoutTree(nodes: RenderTreeNode[], viewportWidth: number, viewportHeight: number): RenderTreeNode[] {

        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;

        for (let node of nodes) {
            this.calculateLayoutRecursive(node);
        }

        return nodes;
    }

    public calculateLayoutRecursive(node: RenderTreeNode) {
        let parentWidth = this.viewportWidth;

        if (node.parent) {
            node.width = this.calculateInnerWidth(node.parent);
            parentWidth = node.parent.width;
        } else {
            node.width = this.viewportWidth;
        }

        for (let child of node.children) {
            this.calculateLayoutRecursive(child);
        }

        let childheights = 100;
        node.height = childheights;


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
