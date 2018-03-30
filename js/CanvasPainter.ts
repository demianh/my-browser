import {RenderTreeNode} from "./RenderTree";

export class CanvasPainter {

    private ctx = null;

    public paintTree(canvas: HTMLCanvasElement, tree: RenderTreeNode[]) {

        this.ctx = canvas.getContext("2d");

        // clear screen
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        tree.forEach((node) => {
            this.paintNode(node);
        })
    }

    private paintNode(node: RenderTreeNode) {
        let display = node.computedStyles.display[0].value;

        if (display != 'none') {

            // Draw demo background
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.02)";
            this.ctx.fillRect(node.left, node.top, node.width, node.height);

            // Draw Borders
            // TODO

            // Draw Text
            if (node.type == 'text') {
                this.ctx.font = "15px Arial";
                this.ctx.fillStyle = node.computedStyles.color[0].value;
                this.ctx.fillText(node.content, node.left, node.top);
            }

            node.children.forEach((child) => {
                this.paintNode(child);
            })
        }

    }
}
