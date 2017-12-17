/**
 * Extract all <style> tags and <link> stylesheets
 */
export class HtmlStyleExtractor {
    constructor() {
        this.styles = [];
    }
    extractStyles(nodes) {
        this.extractRecursive(nodes);
        return this.styles;
    }
    extractRecursive(nodes) {
        nodes.forEach((node) => {
            if (node.type == 'element') {
                if (node.tag == 'style') {
                    if (node.children && node.children.length > 0 && node.children[0].content) {
                        this.styles.push({
                            type: 'inline',
                            css: node.children[0].content
                        });
                    }
                }
                if (node.tag == 'link') {
                    if (node.attributes.rel && node.attributes.rel == 'stylesheet') {
                        if (node.attributes.href) {
                            this.styles.push({
                                type: 'link',
                                href: node.attributes.href
                            });
                        }
                    }
                }
            }
            if (node.children && node.children.length > 0) {
                this.extractRecursive(node.children);
            }
        });
    }
}
