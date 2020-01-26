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
            performance.mark('total');
            console.log('');
            store.commit('SET_URL', url);
            store.commit('SET_HTML', null);
            store.commit('SET_CSS', null);
            store.commit('SET_RENDERTREE', null);
            network.GET(url).then((data) => {
                // Parse HTML
                performance.mark('parse-html');
                let htmlParser = new HtmlParser();
                let nodes = htmlParser.parse(data);
                if (store.state.App.devtoolsOpen) {
                    store.commit('SET_HTML', nodes);
                }
                performance.measure('Parse HTML', 'parse-html');
                performance.mark('parse-embedded-css');
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
                performance.measure('Parse embedded CSS', 'parse-embedded-css');
                // wait for all files to load
                performance.mark('load-and-parse-external-css');
                Promise.all(promises).then(() => {
                    // apply css tree
                    if (store.state.App.devtoolsOpen) {
                        store.commit('SET_CSS', styles);
                    }
                    performance.measure('Load & parse external CSS', 'load-and-parse-external-css');
                    // RenderTree
                    performance.mark('render-tree');
                    let renderTree = new RenderTree();
                    let rtree = renderTree.createRenderTree(nodes, allStyleRules);
                    performance.measure('Building Render Tree', 'render-tree');
                    performance.mark('layout-tree');
                    let layoutTree = new LayoutTree();
                    let ltree = layoutTree.createLayoutTree(rtree, canvas.clientWidth, canvas.clientHeight);
                    if (store.state.App.devtoolsOpen) {
                        store.commit('SET_RENDERTREE', ltree);
                    }
                    performance.measure('Building Layout Tree', 'layout-tree');
                    // Paint
                    performance.mark('paint');
                    let painter = new CanvasPainter();
                    painter.paintTree(canvas, rtree, store.state.App.devtoolsOpen && store.state.App.showDebugLayers);
                    performance.measure('Paint', 'paint');
                    // show performance measures
                    performance.measure('=> Total Time', 'total');
                    performance.getEntriesByType('measure').forEach(measure => {
                        console.log('🕙 ' + measure.name + ': ' + new Intl.NumberFormat('de-CH').format(Math.round(measure.duration)) + 'ms');
                    });
                    performance.clearMarks();
                    performance.clearMeasures();
                    resolve();
                });
            });
        });
    }
}
