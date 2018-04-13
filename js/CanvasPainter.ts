import {RenderTreeNode} from "./RenderTree";

export class CanvasPainter {

    private ctx = null;

    private debugLayers: boolean = true;

    public paintTree(canvas: HTMLCanvasElement, tree: RenderTreeNode[]) {

        this.ctx = canvas.getContext("2d");
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(2,2);

        // Basic Canvas Settings
        this.ctx.textBaseline = "top";

        // clear screen
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        tree.forEach((node) => {
            this.paintNode(node);
        })
    }

    private paintNode(node: RenderTreeNode) {
        let display = node.computedStyles.display[0].value;

        if (display != 'none') {

            // Draw Text
            if (node.type == 'text') {
                this.paintTextNode(node);
            } else {
                // Draw debug background
                if (this.debugLayers) {
                    this.ctx.fillStyle = "rgba(0, 0, 255, 0.02)";
                    this.ctx.fillRect(node.left, node.top, node.width, node.height);
                }

                // Draw Backgrounds
                if (node.computedStyles['background-color'][0].value !== 'transparent') {
                    this.ctx.fillStyle = node.computedStyles['background-color'][0].value;
                    this.ctx.fillRect(node.left, node.top, node.width, node.height);
                }

                // Draw Borders
                // TODO
            }

            node.children.forEach((child) => {
                this.paintNode(child);
            })
        }

    }

    private paintTextNode(node: RenderTreeNode) {

        if (this.debugLayers) {
            // Draw debug background
            this.ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
            this.ctx.fillRect(node.left, node.top, node.width, node.height);
        }

        let size = node.computedStyles['font-size'][0].value;
        let family = node.computedStyles['font-size'][0].value;
        let style = node.computedStyles['font-style'][0].value;
        let weight = node.computedStyles['font-weight'][0].value;
        this.ctx.font = (style == 'italic' ? 'italic ': '')
            + (weight == 'bold' ? 'bold ': '')
            + size + 'px "'
            + family + '"';

        this.ctx.fillStyle = node.computedStyles.color[0].value;
        this.ctx.fillText(node.content, node.left, node.top);
    }
}