
interface IDomNode {
    type: 'element'|'text'|'comment'|'doctype';
    tag?: string;
    attributes?: {};
    children?: IDomNode[];
    params?: string[];
    content?: string;
}

export interface IStyleNode {
    type: 'style'|'media'|'comment'|'import';
    rules?: {
        specificity: [number,number,number,number];
        selectors: IStyleNodeSelector[];
    };
    declarations?: {
        name: string;
        value: string;
    };
    content?: string;
}

export interface IStyleNodeSelector {
    type: 'element'|'class'|'id'|'universal'|'attribute'|'pseudo-element'|'pseudo-class',
    combinator: 'root'|'descendant'|'same'|'child'|'adjacent'|'sibling';
    selector: string;
    arguments: IStyleNodeSelector[];
}


export interface IRenderTreeNode {
    node: IDomNode,
    children: IRenderTreeNode
}

export class RenderTree {

    public createRenderTree(nodes: IDomNode[], styles: IStyleNode[]): IRenderTreeNode[] {
        return [];
    }
}
