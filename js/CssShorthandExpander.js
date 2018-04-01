export class CssShorthandExpander {
    static padding(declaration) {
        let derived = [];
        switch (declaration.value.length) {
            case 1:
                derived.push({ name: 'padding-top', value: [declaration.value[0]] });
                derived.push({ name: 'padding-right', value: [declaration.value[0]] });
                derived.push({ name: 'padding-bottom', value: [declaration.value[0]] });
                derived.push({ name: 'padding-left', value: [declaration.value[0]] });
                break;
            case 2:
                derived.push({ name: 'padding-top', value: [declaration.value[0]] });
                derived.push({ name: 'padding-right', value: [declaration.value[1]] });
                derived.push({ name: 'padding-bottom', value: [declaration.value[0]] });
                derived.push({ name: 'padding-left', value: [declaration.value[1]] });
                break;
            case 3:
                derived.push({ name: 'padding-top', value: [declaration.value[0]] });
                derived.push({ name: 'padding-right', value: [declaration.value[1]] });
                derived.push({ name: 'padding-bottom', value: [declaration.value[2]] });
                derived.push({ name: 'padding-left', value: [declaration.value[1]] });
                break;
            case 4:
                derived.push({ name: 'padding-top', value: [declaration.value[0]] });
                derived.push({ name: 'padding-right', value: [declaration.value[1]] });
                derived.push({ name: 'padding-bottom', value: [declaration.value[2]] });
                derived.push({ name: 'padding-left', value: [declaration.value[3]] });
                break;
        }
        return derived;
    }
    static margin(declaration) {
        let derived = [];
        switch (declaration.value.length) {
            case 1:
                derived.push({ name: 'margin-top', value: [declaration.value[0]] });
                derived.push({ name: 'margin-right', value: [declaration.value[0]] });
                derived.push({ name: 'margin-bottom', value: [declaration.value[0]] });
                derived.push({ name: 'margin-left', value: [declaration.value[0]] });
                break;
            case 2:
                derived.push({ name: 'margin-top', value: [declaration.value[0]] });
                derived.push({ name: 'margin-right', value: [declaration.value[1]] });
                derived.push({ name: 'margin-bottom', value: [declaration.value[0]] });
                derived.push({ name: 'margin-left', value: [declaration.value[1]] });
                break;
            case 3:
                derived.push({ name: 'margin-top', value: [declaration.value[0]] });
                derived.push({ name: 'margin-right', value: [declaration.value[1]] });
                derived.push({ name: 'margin-bottom', value: [declaration.value[2]] });
                derived.push({ name: 'margin-left', value: [declaration.value[1]] });
                break;
            case 4:
                derived.push({ name: 'margin-top', value: [declaration.value[0]] });
                derived.push({ name: 'margin-right', value: [declaration.value[1]] });
                derived.push({ name: 'margin-bottom', value: [declaration.value[2]] });
                derived.push({ name: 'margin-left', value: [declaration.value[3]] });
                break;
        }
        return derived;
    }
    static border(declaration) {
        let derived = [];
        declaration.value.forEach((def) => {
            if (def.type == 'color') {
                derived.push({ name: 'border-color', value: [def] });
            }
            if (def.type == 'unit') {
                derived.push({ name: 'border-width', value: [def] });
            }
            if (def.type == 'keyword') {
                derived.push({ name: 'border-style', value: [def] });
            }
        });
        return derived;
    }
    static bordercolor(declaration) {
        let derived = [];
        switch (declaration.value.length) {
            case 1:
                derived.push({ name: 'border-top-color', value: [declaration.value[0]] });
                derived.push({ name: 'border-right-color', value: [declaration.value[0]] });
                derived.push({ name: 'border-bottom-color', value: [declaration.value[0]] });
                derived.push({ name: 'border-left-color', value: [declaration.value[0]] });
                break;
            case 2:
                derived.push({ name: 'border-top-color', value: [declaration.value[0]] });
                derived.push({ name: 'border-right-color', value: [declaration.value[1]] });
                derived.push({ name: 'border-bottom-color', value: [declaration.value[0]] });
                derived.push({ name: 'border-left-color', value: [declaration.value[1]] });
                break;
            case 3:
                derived.push({ name: 'border-top-color', value: [declaration.value[0]] });
                derived.push({ name: 'border-right-color', value: [declaration.value[1]] });
                derived.push({ name: 'border-bottom-color', value: [declaration.value[2]] });
                derived.push({ name: 'border-left-color', value: [declaration.value[1]] });
                break;
            case 4:
                derived.push({ name: 'border-top-color', value: [declaration.value[0]] });
                derived.push({ name: 'border-right-color', value: [declaration.value[1]] });
                derived.push({ name: 'border-bottom-color', value: [declaration.value[2]] });
                derived.push({ name: 'border-left-color', value: [declaration.value[3]] });
                break;
        }
        return derived;
    }
    static borderwidth(declaration) {
        let derived = [];
        switch (declaration.value.length) {
            case 1:
                derived.push({ name: 'border-top-width', value: [declaration.value[0]] });
                derived.push({ name: 'border-right-width', value: [declaration.value[0]] });
                derived.push({ name: 'border-bottom-width', value: [declaration.value[0]] });
                derived.push({ name: 'border-left-width', value: [declaration.value[0]] });
                break;
            case 2:
                derived.push({ name: 'border-top-width', value: [declaration.value[0]] });
                derived.push({ name: 'border-right-width', value: [declaration.value[1]] });
                derived.push({ name: 'border-bottom-width', value: [declaration.value[0]] });
                derived.push({ name: 'border-left-width', value: [declaration.value[1]] });
                break;
            case 3:
                derived.push({ name: 'border-top-width', value: [declaration.value[0]] });
                derived.push({ name: 'border-right-width', value: [declaration.value[1]] });
                derived.push({ name: 'border-bottom-width', value: [declaration.value[2]] });
                derived.push({ name: 'border-left-width', value: [declaration.value[1]] });
                break;
            case 4:
                derived.push({ name: 'border-top-width', value: [declaration.value[0]] });
                derived.push({ name: 'border-right-width', value: [declaration.value[1]] });
                derived.push({ name: 'border-bottom-width', value: [declaration.value[2]] });
                derived.push({ name: 'border-left-width', value: [declaration.value[3]] });
                break;
        }
        return derived;
    }
    static borderstyle(declaration) {
        let derived = [];
        switch (declaration.value.length) {
            case 1:
                derived.push({ name: 'border-top-style', value: [declaration.value[0]] });
                derived.push({ name: 'border-right-style', value: [declaration.value[0]] });
                derived.push({ name: 'border-bottom-style', value: [declaration.value[0]] });
                derived.push({ name: 'border-left-style', value: [declaration.value[0]] });
                break;
            case 2:
                derived.push({ name: 'border-top-style', value: [declaration.value[0]] });
                derived.push({ name: 'border-right-style', value: [declaration.value[1]] });
                derived.push({ name: 'border-bottom-style', value: [declaration.value[0]] });
                derived.push({ name: 'border-left-style', value: [declaration.value[1]] });
                break;
            case 3:
                derived.push({ name: 'border-top-style', value: [declaration.value[0]] });
                derived.push({ name: 'border-right-style', value: [declaration.value[1]] });
                derived.push({ name: 'border-bottom-style', value: [declaration.value[2]] });
                derived.push({ name: 'border-left-style', value: [declaration.value[1]] });
                break;
            case 4:
                derived.push({ name: 'border-top-style', value: [declaration.value[0]] });
                derived.push({ name: 'border-right-style', value: [declaration.value[1]] });
                derived.push({ name: 'border-bottom-style', value: [declaration.value[2]] });
                derived.push({ name: 'border-left-style', value: [declaration.value[3]] });
                break;
        }
        return derived;
    }
    static bordertop(declaration) {
        return this._border_direction('top', declaration);
    }
    static borderleft(declaration) {
        return this._border_direction('left', declaration);
    }
    static borderbottom(declaration) {
        return this._border_direction('bottom', declaration);
    }
    static borderright(declaration) {
        return this._border_direction('right', declaration);
    }
    static _border_direction(direction, declaration) {
        let derived = [];
        declaration.value.forEach((def) => {
            if (def.type == 'color') {
                derived.push({ name: 'border-' + direction + '-color', value: [def] });
            }
            if (def.type == 'unit') {
                derived.push({ name: 'border-' + direction + '-width', value: [def] });
            }
            if (def.type == 'keyword') {
                derived.push({ name: 'border-' + direction + '-style', value: [def] });
            }
        });
        return derived;
    }
    static background(declaration) {
        let derived = [];
        declaration.value.forEach((def) => {
            if (def.type == 'color') {
                derived.push({ name: 'background-color', value: [def] });
            }
        });
        return derived;
    }
}
