import store from '../store';

import {Network} from "./Network";

import {HtmlParser} from "../../../../js/HtmlParser";
import {CssParser} from "../../../../js/CssParser";
import {RenderTree} from "../../../../js/RenderTree";
import {HtmlStyleExtractor} from "../../../../js/HtmlStyleExtractor";

export class Engine {

    public loadURL(url: string): void {
        let network = new Network();

        store.dispatch('setUrl', url);
        store.dispatch('setHTML', null);
        store.dispatch('setCSS', null);
        store.dispatch('setRenderTree', null);
        network.GET(url).then((data: string) => {
            let tStart = performance.now();

            //console.log(data);

            let tStartHtml = performance.now();
            let htmlParser = new HtmlParser();
            let nodes = htmlParser.parse(data);
            store.dispatch('setHTML', nodes);
            console.log("Parsing HTML: " + Math.round(performance.now() - tStartHtml) + " milliseconds.");

            let tStartCss = performance.now();
            let extractor = new HtmlStyleExtractor();
            let cssParser = new CssParser();
            let styles = extractor.extractStyles(nodes);
            let allStyleRules = [];
            styles.forEach((style, index) => {
                if (style.type === 'inline') {
                    let tree = cssParser.parse(style.css);
                    styles[index].cssTree = tree;
                    allStyleRules = allStyleRules.concat(tree)
                }
            });
            store.dispatch('setCSS', styles);
            console.log("Parsing CSS: " + Math.round(performance.now() - tStartCss) + " milliseconds.");

            let tStartRendertree = performance.now();
            let renderTree = new RenderTree();
            let rtree = renderTree.createRenderTree(nodes, allStyleRules);
            store.dispatch('setRenderTree', rtree);
            console.log("Create Rendertree: " + Math.round(performance.now() - tStartRendertree) + " milliseconds.");

            console.log("Parsing & Rendering took " + Math.round(performance.now() - tStart) + " milliseconds.");
        });
    }
}
