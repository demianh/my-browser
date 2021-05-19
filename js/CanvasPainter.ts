import {RenderTreeNode} from "./RenderTree";
import {ICSSGenericValue} from "./CssParser";

export class CanvasPainter {

    private ctx = null;

    private debugLayers: boolean;

    public paintTree(canvas: HTMLCanvasElement, tree: RenderTreeNode[], debugLayers: boolean = false) {

        this.debugLayers = debugLayers;

        // set height of canvas
        // chrome limits canvas height/width to 32'767 px
        canvas.height = Math.min(tree[0].height * 2, 32767);

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

                let mTop = this.getPixelValue(node.computedStyles['margin-top'][0]);
                let mBottom = this.getPixelValue(node.computedStyles['margin-bottom'][0]);
                let mLeft = this.getPixelValue(node.computedStyles['margin-left'][0]);
                let mRight = this.getPixelValue(node.computedStyles['margin-right'][0]);

                // Draw Backgrounds
                if (node.computedStyles['background-color'][0].value !== 'transparent') {
                    this.ctx.fillStyle = node.computedStyles['background-color'][0].value;
                    this.ctx.fillRect(
                        node.left + mLeft,
                        node.top + mTop,
                        node.width - (mLeft + mRight),
                        node.height - (mTop + mBottom)
                    );
                }

                // Draw Borders
                if (node.computedStyles['border-top-width']) {
                    let borderWidth = this.getPixelValue(node.computedStyles['border-top-width'][0]);
                    this.ctx.fillStyle = node.computedStyles['border-top-color'][0].value;
                    this.ctx.fillRect(
                        node.left + mLeft,
                        node.top + mTop,
                        node.width - (mLeft + mRight),
                        borderWidth
                    );
                }
                if (node.computedStyles['border-right-width']) {
                    let borderWidth = this.getPixelValue(node.computedStyles['border-right-width'][0]);
                    this.ctx.fillStyle = node.computedStyles['border-right-color'][0].value;
                    this.ctx.fillRect(
                        node.left + node.width - borderWidth - mLeft,
                        node.top + mTop,
                        borderWidth,
                        node.height - (mTop + mBottom)
                    );
                }
                if (node.computedStyles['border-bottom-width']) {
                    let borderWidth = this.getPixelValue(node.computedStyles['border-bottom-width'][0]);
                    this.ctx.fillStyle = node.computedStyles['border-bottom-color'][0].value;
                    this.ctx.fillRect(
                        node.left + mLeft,
                        node.top + node.height - borderWidth - mTop,
                        node.width - (mLeft + mRight),
                        borderWidth
                    );
                }
                if (node.computedStyles['border-left-width']) {
                    let borderWidth = this.getPixelValue(node.computedStyles['border-left-width'][0]);
                    this.ctx.fillStyle = node.computedStyles['border-left-color'][0].value;
                    this.ctx.fillRect(
                        node.left + mLeft,
                        node.top + mTop,
                        borderWidth,
                        node.height - (mTop + mBottom)
                    );
                }
            }

            node.children.forEach((child) => {
                this.paintNode(child);
            })
        }
    }

    private getPixelValue(style: ICSSGenericValue): number {
        let pixels = 0;
        if (style.type == 'unit' && style.unit && style.unit == 'px') {
            pixels = parseFloat(<string>style.value);
        }
        return pixels;
    }

    private paintTextNode(node: RenderTreeNode) {
        let size: number = parseFloat(<string>node.computedStyles['font-size'][0].value);
        let family = node.computedStyles['font-size'][0].value;
        let style = node.computedStyles['font-style'][0].value;
        let weight = node.computedStyles['font-weight'][0].value;

        this.ctx.font = (style == 'italic' ? 'italic ': '')
            + (weight == 'bold' ? 'bold ': '')
            + size + 'px "'
            + family + '"';

        if (this.debugLayers) {
            // Draw debug background
            this.ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
            this.ctx.fillRect(node.left, node.top, node.width, node.height);
        }

        let top = node.top;

        node.textLines.forEach(line => {
            this.ctx.fillStyle = node.computedStyles.color[0].value;
            this.ctx.fillText(line, node.left, top);
            // TODO: use correct line-height
            top += size;
        })
    }
}
