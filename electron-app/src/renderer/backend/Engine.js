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
        return new Promise((resolve, reject) => {
            let network = new Network();
            store.commit('SET_URL', url);
            store.commit('SET_HTML', null);
            store.commit('SET_CSS', null);
            store.commit('SET_RENDERTREE', null);
            network.GET(url).then((data) => {
                let tStart = performance.now();
                //console.log(data);
                // Parse HTML
                let tStartHtml = performance.now();
                let htmlParser = new HtmlParser();
                let nodes = htmlParser.parse(data);
                if (store.state.App.devtoolsOpen) {
                    store.commit('SET_HTML', nodes);
                }
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
                let promises = [];
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
                    if (style.type === 'link') {
                        try {
                            let cssFileUrl = new URL(style.href, url);
                            let promise = network.GET(cssFileUrl.href);
                            promise.then((data) => {
                                let tree = cssParser.parse(data);
                                styles[index].cssTree = tree;
                                allStyleRules = allStyleRules.concat(tree);
                            });
                            promises.push(promise);
                        }
                        catch (e) {
                            console.warn('Could not parse URL for file: ' + style.href);
                        }
                    }
                });
                // wait for all files to load
                Promise.all(promises).then(() => {
                    // apply css tree
                    if (store.state.App.devtoolsOpen) {
                        store.commit('SET_CSS', styles);
                    }
                    console.log("Loading and parsing CSS: " + Math.round(performance.now() - tStartCss) + " milliseconds.");
                    // RenderTree
                    let tStartRendertree = performance.now();
                    let renderTree = new RenderTree();
                    let rtree = renderTree.createRenderTree(nodes, allStyleRules);
                    console.log("Create Rendertree: " + Math.round(performance.now() - tStartRendertree) + " milliseconds.");
                    let tStartLayouttree = performance.now();
                    let layoutTree = new LayoutTree();
                    let ltree = layoutTree.createLayoutTree(rtree, canvas.clientWidth, canvas.clientHeight);
                    if (store.state.App.devtoolsOpen) {
                        store.commit('SET_RENDERTREE', ltree);
                    }
                    console.log("Create LayoutTree: " + Math.round(performance.now() - tStartLayouttree) + " milliseconds.");
                    // Paint
                    let tStartPaint = performance.now();
                    let painter = new CanvasPainter();
                    painter.paintTree(canvas, rtree, store.state.App.devtoolsOpen && store.state.App.showDebugLayers);
                    console.log("Paint: " + Math.round(performance.now() - tStartPaint) + " milliseconds.");
                    console.log("Parsing & Rendering took " + Math.round(performance.now() - tStart) + " milliseconds.");
                    resolve();
                });
            });
        });
    }
}
