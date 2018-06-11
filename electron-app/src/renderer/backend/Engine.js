import store from '../store';
import { Network } from "./Network";
import { HtmlParser } from "../../../../js/HtmlParser";
import { CssParser } from "../../../../js/CssParser";
import { RenderTree } from "../../../../js/RenderTree";
import { HtmlStyleExtractor } from "../../../../js/HtmlStyleExtractor";
import { DefaultBrowserCss } from "./DefaultBrowserCss";
import { CanvasPainter } from "../../../../js/CanvasPainter";
import { LayoutTree } from "../../../../js/LayoutTree";
export class Engine {
    loadURL(url, canvas) {
        let network = new Network();
        store.dispatch('setUrl', url);
        store.dispatch('setHTML', null);
        store.dispatch('setCSS', null);
        store.dispatch('setRenderTree', null);
        network.GET(url).then((data) => {
            let tStart = performance.now();
            //console.log(data);
            // Parse HTML
            let tStartHtml = performance.now();
            let htmlParser = new HtmlParser();
            let nodes = htmlParser.parse(data);
            store.dispatch('setHTML', nodes);
            console.log("Parsing HTML: " + Math.round(performance.now() - tStartHtml) + " milliseconds.");
            let tStartCss = performance.now();
            let extractor = new HtmlStyleExtractor();
            let cssParser = new CssParser();
            let styles = extractor.extractStyles(nodes);
            // add browser default styles
            styles.push({
                type: 'browser',
                css: DefaultBrowserCss.css,
            });
            // Parse CSS
            let allStyleRules = [];
            styles.forEach((style, index) => {
                if (style.type === 'inline') {
                    let tree = cssParser.parse(style.css);
                    styles[index].cssTree = tree;
                    allStyleRules = allStyleRules.concat(tree);
                }
                if (style.type === 'browser') {
                    let tree = cssParser.parse(style.css, 0);
                    styles[index].cssTree = tree;
                    allStyleRules = allStyleRules.concat(tree);
                }
            });
            store.dispatch('setCSS', styles);
            console.log("Parsing CSS: " + Math.round(performance.now() - tStartCss) + " milliseconds.");
            // RenderTree
            let tStartRendertree = performance.now();
            let renderTree = new RenderTree();
            let rtree = renderTree.createRenderTree(nodes, allStyleRules);
            //store.dispatch('setRenderTree', rtree);
            console.log("Create Rendertree: " + Math.round(performance.now() - tStartRendertree) + " milliseconds.");
            let tStartLayouttree = performance.now();
            let layoutTree = new LayoutTree();
            let ltree = layoutTree.createLayoutTree(rtree, canvas.clientWidth, canvas.clientHeight);
            store.dispatch('setRenderTree', ltree);
            console.log("Create LayoutTree: " + Math.round(performance.now() - tStartLayouttree) + " milliseconds.");
            // Paint
            let tStartPaint = performance.now();
            let painter = new CanvasPainter();
            painter.paintTree(canvas, rtree, store.state.App.showDebugLayers);
            console.log("Paint: " + Math.round(performance.now() - tStartPaint) + " milliseconds.");
            console.log("Parsing & Rendering took " + Math.round(performance.now() - tStart) + " milliseconds.");
        });
    }
}
