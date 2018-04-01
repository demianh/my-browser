import {RenderTreeNode} from "./RenderTree";

export class CanvasPainter {

    private ctx = null;

    private debugLayers: boolean = true;

    public paintTree(canvas: HTMLCanvasElement, tree: RenderTreeNode[]) {

        this.ctx = canvas.getContext("2d");

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

        this.ctx.font = "15px Arial";
        this.ctx.fillStyle = node.computedStyles.color[0].value;
        this.ctx.fillText(node.content, node.left, node.top);
    }
}
