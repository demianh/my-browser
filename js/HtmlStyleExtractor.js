"use strict";
/**
 * Extract all <style> tags and <link> stylesheets
 */
Object.defineProperty(exports, "__esModule", { value: true });
var HtmlStyleExtractor = /** @class */ (function () {
    function HtmlStyleExtractor() {
        this.styles = [];
    }
    HtmlStyleExtractor.prototype.extractStyles = function (nodes) {
        this.extractRecursive(nodes);
        return this.styles;
    };
    HtmlStyleExtractor.prototype.extractRecursive = function (nodes) {
        var _this = this;
        nodes.forEach(function (node) {
            if (node.type == 'element') {
                if (node.tag == 'style') {
                    if (node.children && node.children.length > 0 && node.children[0].content) {
                        _this.styles.push({
                            type: 'inline',
                            css: node.children[0].content
                        });
                    }
                }
                if (node.tag == 'link') {
                    if (node.attributes.rel && node.attributes.rel == 'stylesheet') {
                        if (node.attributes.href) {
                            _this.styles.push({
                                type: 'link',
                                href: node.attributes.href
                            });
                        }
                    }
                }
            }
            if (node.children && node.children.length > 0) {
                _this.extractRecursive(node.children);
            }
        });
    };
    return HtmlStyleExtractor;
}());
exports.HtmlStyleExtractor = HtmlStyleExtractor;
