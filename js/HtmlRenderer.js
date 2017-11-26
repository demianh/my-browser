"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HtmlRenderer = /** @class */ (function () {
    function HtmlRenderer() {
        this.VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    }
    HtmlRenderer.prototype.render = function (nodes, depth) {
        if (depth === void 0) { depth = 0; }
        var html = '';
        for (var k in nodes) {
            var node = nodes[k];
            switch (node.type) {
                case 'element':
                    //html += ' '.repeat(depth * 2);
                    html += '<' + node.tag;
                    for (var key in node.attributes) {
                        if (node.attributes.hasOwnProperty(key)) {
                            var value = node.attributes[key];
                            if (value === null) {
                                html += ' ' + key;
                            }
                            else {
                                html += ' ' + key + '="' + value + '"';
                            }
                        }
                    }
                    html += '>';
                    //html += "\n";
                    if (this.VOID_ELEMENTS.indexOf(node.tag) == -1) {
                        if (node.children && node.children.length > 0) {
                            html += this.render(node.children, depth + 1);
                        }
                        //html += ' '.repeat(depth * 2);
                        html += '</' + node.tag + '>';
                        //html += "\n";
                    }
                    break;
                case 'text':
                    //html += ' '.repeat(depth * 2);
                    html += node.content;
                    //html += "\n";
                    break;
                case 'comment':
                    //html += ' '.repeat(depth * 2);
                    html += '<!--' + node.content + '-->';
                    //html += "\n";
                    break;
                case 'doctype':
                    html += '<!DOCTYPE';
                    for (var k_1 in node.params) {
                        var param = node.params[k_1];
                        html += ' ' + param;
                    }
                    html += '>';
                    //html += "\n";
                    break;
            }
        }
        return html;
    };
    return HtmlRenderer;
}());
exports.HtmlRenderer = HtmlRenderer;
