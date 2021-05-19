export class CanvasPainter {
    constructor() {
        this.ctx = null;
    }
    paintTree(canvas, tree, debugLayers = false) {
        this.debugLayers = debugLayers;
        // set height of canvas
        // chrome limits canvas height/width to 32'767 px
        canvas.height = Math.min(tree[0].height * 2, 32767);
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
                let mTop = node.computedPixelValue('margin-top');
                let mBottom = node.computedPixelValue('margin-bottom');
                let mLeft = node.computedPixelValue('margin-left');
                let mRight = node.computedPixelValue('margin-right');
                // Draw Backgrounds
                if (node.computedStyles['background-color'][0].value !== 'transparent') {
                    this.ctx.fillStyle = node.computedStyles['background-color'][0].value;
                    this.ctx.fillRect(node.left + mLeft, node.top + mTop, node.width - (mLeft + mRight), node.height - (mTop + mBottom));
                }
                // Draw Borders
                let borderWidthTop = node.computedPixelValue('border-top-width');
                let borderWidthRight = node.computedPixelValue('border-right-width');
                let borderWidthBottom = node.computedPixelValue('border-bottom-width');
                let borderWidthLeft = node.computedPixelValue('border-left-width');
                if (borderWidthTop) {
                    this.ctx.fillStyle = node.computedValue('border-top-color');
                    let region = new Path2D();
                    region.moveTo(node.left + mLeft, node.top + mTop);
                    region.lineTo(node.left + node.width - mLeft, node.top + mTop);
                    region.lineTo(node.left + node.width - borderWidthRight - mLeft, node.top + mTop + borderWidthTop);
                    region.lineTo(node.left + mLeft + borderWidthLeft, node.top + mTop + borderWidthTop);
                    region.closePath();
                    this.ctx.fill(region);
                }
                if (borderWidthRight) {
                    this.ctx.fillStyle = node.computedValue('border-right-color');
                    let region = new Path2D();
                    region.moveTo(node.left + node.width - mLeft, node.top + mTop);
                    region.lineTo(node.left + node.width - borderWidthRight - mLeft, node.top + mTop + borderWidthTop);
                    region.lineTo(node.left + node.width - borderWidthRight - mLeft, node.top + node.height - mTop - mBottom - borderWidthBottom);
                    region.lineTo(node.left + node.width - mLeft, node.top + node.height - mTop - mBottom);
                    region.closePath();
                    this.ctx.fill(region);
                }
                if (borderWidthBottom) {
                    this.ctx.fillStyle = node.computedValue('border-bottom-color');
                    let region = new Path2D();
                    region.moveTo(node.left + node.width - mLeft, node.top + node.height - mTop - mBottom);
                    region.lineTo(node.left + node.width - borderWidthRight - mLeft, node.top + node.height - mTop - mBottom - borderWidthBottom);
                    region.lineTo(node.left + mRight + borderWidthLeft, node.top + node.height - mTop - mBottom - borderWidthBottom);
                    region.lineTo(node.left + mRight, node.top + node.height - mTop - mBottom);
                    region.closePath();
                    this.ctx.fill(region);
                }
                if (borderWidthLeft) {
                    this.ctx.fillStyle = node.computedValue('border-left-color');
                    let region = new Path2D();
                    region.moveTo(node.left + mLeft, node.top + mTop);
                    region.lineTo(node.left + mLeft + borderWidthLeft, node.top + mTop + borderWidthTop);
                    region.lineTo(node.left + mRight + borderWidthLeft, node.top + node.height - mTop - mBottom - borderWidthBottom);
                    region.lineTo(node.left + mRight, node.top + node.height - mTop - mBottom);
                    region.closePath();
                    this.ctx.fill(region);
                }
            }
            node.children.forEach((child) => {
                this.paintNode(child);
            });
        }
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
