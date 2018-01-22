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
}
