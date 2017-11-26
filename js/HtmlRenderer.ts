
export interface INode {
    type: 'element'|'text'|'comment'|'doctype';
    tag?: string;
    attributes?: {};
    children?: INode[];
    params?: string[];
    content?: string;
}

export class HtmlRenderer {

    private readonly VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

    public render(nodes: INode[], depth = 0) {
        let html = '';
        for (let k in nodes) {
            let node = nodes[k];
            switch (node.type) {
                case 'element':
                    //html += ' '.repeat(depth * 2);
                    html += '<' + node.tag;
                    for (let key in node.attributes) {
                        if (node.attributes.hasOwnProperty(key)) {
                            let value = node.attributes[key];
                            if (value === null) {
                                html += ' ' + key;
                            } else {
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
                    for (let k in node.params) {
                        let param = node.params[k];
                        html += ' ' + param;
                    }
                    html += '>';
                    //html += "\n";
                    break;
            }
        }
        return html;
    }
}