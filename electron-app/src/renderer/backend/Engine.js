import store from '../store';
import { Network } from "./Network";
import { HtmlParser } from "../../../../js/HtmlParser";
import { CssParser } from "../../../../js/CssParser";
import { RenderTree } from "../../../../js/RenderTree";
import { HtmlStyleExtractor } from "../../../../js/HtmlStyleExtractor";
export class Engine {
    loadURL(url) {
        let network = new Network();
        store.dispatch('setUrl', url);
        store.dispatch('setHTML', null);
        store.dispatch('setCSS', null);
        store.dispatch('setRenderTree', null);
        network.GET(url).then((data) => {
            console.log(data);
            let htmlParser = new HtmlParser();
            let nodes = htmlParser.parse(data);
            store.dispatch('setHTML', nodes);
            let extractor = new HtmlStyleExtractor();
            let cssParser = new CssParser();
            let styles = extractor.extractStyles(nodes);
            let allStyleRules = [];
            styles.forEach((style, index) => {
                if (style.type === 'inline') {
                    let tree = cssParser.parse(style.css);
                    styles[index].cssTree = tree;
                    allStyleRules = allStyleRules.concat(tree);
                }
            });
            store.dispatch('setCSS', styles);
            let renderTree = new RenderTree();
            let rtree = renderTree.createRenderTree(nodes, allStyleRules);
            store.dispatch('setRenderTree', rtree);
        });
    }
}
