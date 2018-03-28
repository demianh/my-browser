import {ICSSStyleDeclaration} from "./CssParser";

export class CssShorthandExpander {
    public static padding(declaration: ICSSStyleDeclaration) {
        let derived: ICSSStyleDeclaration[] = [];
        switch (declaration.value.length) {
            case 1:
                derived.push({name: 'padding-top', value: [declaration.value[0]]});
                derived.push({name: 'padding-right', value: [declaration.value[0]]});
                derived.push({name: 'padding-bottom', value: [declaration.value[0]]});
                derived.push({name: 'padding-left', value: [declaration.value[0]]});
                break;
            case 2:
                derived.push({name: 'padding-top', value: [declaration.value[0]]});
                derived.push({name: 'padding-right', value: [declaration.value[1]]});
                derived.push({name: 'padding-bottom', value: [declaration.value[0]]});
                derived.push({name: 'padding-left', value: [declaration.value[1]]});
                break;
            case 3:
                derived.push({name: 'padding-top', value: [declaration.value[0]]});
                derived.push({name: 'padding-right', value: [declaration.value[1]]});
                derived.push({name: 'padding-bottom', value: [declaration.value[2]]});
                derived.push({name: 'padding-left', value: [declaration.value[1]]});
                break;
            case 4:
                derived.push({name: 'padding-top', value: [declaration.value[0]]});
                derived.push({name: 'padding-right', value: [declaration.value[1]]});
                derived.push({name: 'padding-bottom', value: [declaration.value[2]]});
                derived.push({name: 'padding-left', value: [declaration.value[3]]});
                break;
        }
        return derived;
    }

    public static margin(declaration: ICSSStyleDeclaration) {
        let derived: ICSSStyleDeclaration[] = [];
        switch (declaration.value.length) {
            case 1:
                derived.push({name: 'margin-top', value: [declaration.value[0]]});
                derived.push({name: 'margin-right', value: [declaration.value[0]]});
                derived.push({name: 'margin-bottom', value: [declaration.value[0]]});
                derived.push({name: 'margin-left', value: [declaration.value[0]]});
                break;
            case 2:
                derived.push({name: 'margin-top', value: [declaration.value[0]]});
                derived.push({name: 'margin-right', value: [declaration.value[1]]});
                derived.push({name: 'margin-bottom', value: [declaration.value[0]]});
                derived.push({name: 'margin-left', value: [declaration.value[1]]});
                break;
            case 3:
                derived.push({name: 'margin-top', value: [declaration.value[0]]});
                derived.push({name: 'margin-right', value: [declaration.value[1]]});
                derived.push({name: 'margin-bottom', value: [declaration.value[2]]});
                derived.push({name: 'margin-left', value: [declaration.value[1]]});
                break;
            case 4:
                derived.push({name: 'margin-top', value: [declaration.value[0]]});
                derived.push({name: 'margin-right', value: [declaration.value[1]]});
                derived.push({name: 'margin-bottom', value: [declaration.value[2]]});
                derived.push({name: 'margin-left', value: [declaration.value[3]]});
                break;
        }
        return derived;
    }

    public static border(declaration: ICSSStyleDeclaration) {
        let derived: ICSSStyleDeclaration[] = [];
        declaration.value.forEach((def) => {
            if (def.type == 'color') {
                derived.push({name: 'border-color', value: [def]});
            }
            if (def.type == 'unit') {
                derived.push({name: 'border-width', value: [def]});
            }
            if (def.type == 'keyword') {
                derived.push({name: 'border-style', value: [def]});
            }
        });
        return derived;
    }

    public static bordercolor(declaration: ICSSStyleDeclaration) {
        let derived: ICSSStyleDeclaration[] = [];
        switch (declaration.value.length) {
            case 1:
                derived.push({name: 'border-top-color', value: [declaration.value[0]]});
                derived.push({name: 'border-right-color', value: [declaration.value[0]]});
                derived.push({name: 'border-bottom-color', value: [declaration.value[0]]});
                derived.push({name: 'border-left-color', value: [declaration.value[0]]});
                break;
            case 2:
                derived.push({name: 'border-top-color', value: [declaration.value[0]]});
                derived.push({name: 'border-right-color', value: [declaration.value[1]]});
                derived.push({name: 'border-bottom-color', value: [declaration.value[0]]});
                derived.push({name: 'border-left-color', value: [declaration.value[1]]});
                break;
            case 3:
                derived.push({name: 'border-top-color', value: [declaration.value[0]]});
                derived.push({name: 'border-right-color', value: [declaration.value[1]]});
                derived.push({name: 'border-bottom-color', value: [declaration.value[2]]});
                derived.push({name: 'border-left-color', value: [declaration.value[1]]});
                break;
            case 4:
                derived.push({name: 'border-top-color', value: [declaration.value[0]]});
                derived.push({name: 'border-right-color', value: [declaration.value[1]]});
                derived.push({name: 'border-bottom-color', value: [declaration.value[2]]});
                derived.push({name: 'border-left-color', value: [declaration.value[3]]});
                break;
        }
        return derived;
    }

    public static borderwidth(declaration: ICSSStyleDeclaration) {
        let derived: ICSSStyleDeclaration[] = [];
        switch (declaration.value.length) {
            case 1:
                derived.push({name: 'border-top-width', value: [declaration.value[0]]});
                derived.push({name: 'border-right-width', value: [declaration.value[0]]});
                derived.push({name: 'border-bottom-width', value: [declaration.value[0]]});
                derived.push({name: 'border-left-width', value: [declaration.value[0]]});
                break;
            case 2:
                derived.push({name: 'border-top-width', value: [declaration.value[0]]});
                derived.push({name: 'border-right-width', value: [declaration.value[1]]});
                derived.push({name: 'border-bottom-width', value: [declaration.value[0]]});
                derived.push({name: 'border-left-width', value: [declaration.value[1]]});
                break;
            case 3:
                derived.push({name: 'border-top-width', value: [declaration.value[0]]});
                derived.push({name: 'border-right-width', value: [declaration.value[1]]});
                derived.push({name: 'border-bottom-width', value: [declaration.value[2]]});
                derived.push({name: 'border-left-width', value: [declaration.value[1]]});
                break;
            case 4:
                derived.push({name: 'border-top-width', value: [declaration.value[0]]});
                derived.push({name: 'border-right-width', value: [declaration.value[1]]});
                derived.push({name: 'border-bottom-width', value: [declaration.value[2]]});
                derived.push({name: 'border-left-width', value: [declaration.value[3]]});
                break;
        }
        return derived;
    }

    public static borderstyle(declaration: ICSSStyleDeclaration) {
        let derived: ICSSStyleDeclaration[] = [];
        switch (declaration.value.length) {
            case 1:
                derived.push({name: 'border-top-style', value: [declaration.value[0]]});
                derived.push({name: 'border-right-style', value: [declaration.value[0]]});
                derived.push({name: 'border-bottom-style', value: [declaration.value[0]]});
                derived.push({name: 'border-left-style', value: [declaration.value[0]]});
                break;
            case 2:
                derived.push({name: 'border-top-style', value: [declaration.value[0]]});
                derived.push({name: 'border-right-style', value: [declaration.value[1]]});
                derived.push({name: 'border-bottom-style', value: [declaration.value[0]]});
                derived.push({name: 'border-left-style', value: [declaration.value[1]]});
                break;
            case 3:
                derived.push({name: 'border-top-style', value: [declaration.value[0]]});
                derived.push({name: 'border-right-style', value: [declaration.value[1]]});
                derived.push({name: 'border-bottom-style', value: [declaration.value[2]]});
                derived.push({name: 'border-left-style', value: [declaration.value[1]]});
                break;
            case 4:
                derived.push({name: 'border-top-style', value: [declaration.value[0]]});
                derived.push({name: 'border-right-style', value: [declaration.value[1]]});
                derived.push({name: 'border-bottom-style', value: [declaration.value[2]]});
                derived.push({name: 'border-left-style', value: [declaration.value[3]]});
                break;
        }
        return derived;
    }

    public static bordertop(declaration: ICSSStyleDeclaration) {
        return this._border_direction('top', declaration);
    }

    public static borderleft(declaration: ICSSStyleDeclaration) {
        return this._border_direction('left', declaration);
    }

    public static borderbottom(declaration: ICSSStyleDeclaration) {
        return this._border_direction('bottom', declaration);
    }

    public static borderright(declaration: ICSSStyleDeclaration) {
        return this._border_direction('right', declaration);
    }

    public static _border_direction(direction: string, declaration: ICSSStyleDeclaration) {
        let derived: ICSSStyleDeclaration[] = [];
        declaration.value.forEach((def) => {
            if (def.type == 'color') {
                derived.push({name: 'border-' + direction + '-color', value: [def]});
            }
            if (def.type == 'unit') {
                derived.push({name: 'border-' + direction + '-width', value: [def]});
            }
            if (def.type == 'keyword') {
                derived.push({name: 'border-' + direction + '-style', value: [def]});
            }
        });
        return derived;
    }
}
