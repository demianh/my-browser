export class CanvasPainter {
    constructor() {
        this.ctx = null;
    }
    paintTree(canvas, tree, debugLayers = false) {
        this.debugLayers = debugLayers;
        this.ctx = canvas.getContext("2d");
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(2, 2);
        // Basic Canvas Settings
        this.ctx.textBaseline = "top";
        // clear screen
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        tree.forEach((node) => {
            this.paintNode(node);
        });
    }
    paintNode(node) {
        let display = node.computedStyles.display[0].value;
        if (display != 'none') {
            // Draw Text
            if (node.type == 'text') {
                this.paintTextNode(node);
            }
            else {
                // Draw debug background
                if (this.debugLayers) {
                    this.ctx.fillStyle = "rgba(0, 0, 255, 0.02)";
                    this.ctx.fillRect(node.left, node.top, node.width, node.height);
                }
                // Draw Backgrounds
                if (node.computedStyles['background-color'][0].value !== 'transparent') {
                    let mTop = this.getPixelValue(node.computedStyles['margin-top'][0]);
                    let mBottom = this.getPixelValue(node.computedStyles['margin-bottom'][0]);
                    let mLeft = this.getPixelValue(node.computedStyles['margin-left'][0]);
                    let mRight = this.getPixelValue(node.computedStyles['margin-right'][0]);
                    this.ctx.fillStyle = node.computedStyles['background-color'][0].value;
                    this.ctx.fillRect(node.left + mLeft, node.top + mTop, node.width - (mLeft + mRight), node.height - (mTop + mBottom));
                }
                // Draw Borders
                // TODO
            }
            node.children.forEach((child) => {
                this.paintNode(child);
            });
        }
    }
    getPixelValue(style) {
        let pixels = 0;
        if (style.type == 'unit' && style.unit && style.unit == 'px') {
            pixels = parseFloat(style.value);
        }
        return pixels;
    }
    paintTextNode(node) {
        let size = parseFloat(node.computedStyles['font-size'][0].value);
        let family = node.computedStyles['font-size'][0].value;
        let style = node.computedStyles['font-style'][0].value;
        let weight = node.computedStyles['font-weight'][0].value;
        this.ctx.font = (style == 'italic' ? 'italic ' : '')
            + (weight == 'bold' ? 'bold ' : '')
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
        });
    }
}
