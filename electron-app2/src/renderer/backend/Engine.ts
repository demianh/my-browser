import store from '../store';

import {Network} from "./Network";

import {HtmlParser} from "../../../../js/HtmlParser";
import {CssParser} from "../../../../js/CssParser";
import {RenderTree, RenderTreeNode} from "../../../../js/RenderTree";
import {HtmlStyleExtractor} from "../../../../js/HtmlStyleExtractor";
import {DefaultBrowserCss} from "./DefaultBrowserCss";
import {CanvasPainter} from "../../../../js/CanvasPainter";
import {LayoutTree} from "../../../../js/LayoutTree";
import cloneDeep from 'lodash/cloneDeep'

export class Engine {

    public loadURL(url: string, canvas: HTMLCanvasElement): Promise<void> {
        return new Promise((resolve, reject) => {
            let network = new Network();
            performance.mark('total');
            console.log('');

            store.dispatch('SET_URL', url);
            store.dispatch('SET_HTML', null)
            store.dispatch('SET_CSS', null);
            store.dispatch('SET_RENDERTREE', null);
            store.dispatch('SET_LAYOUTTREE', null);
            network.GET(url).then((data: string) => {

                // Parse HTML
                performance.mark('parse-html');
                let htmlParser = new HtmlParser();
                let nodes = htmlParser.parse(data);
                if (store.state.App.devtoolsOpen) {
                    store.dispatch('SET_HTML', nodes);
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
                        allStyleRules = allStyleRules.concat(tree)
                    }
                    if (style.type === 'browser') {
                        let tree = cssParser.parse(style.css, 0);
                        styles[index].cssTree = tree;
                        allStyleRules = allStyleRules.concat(tree)
                    }
                    if (style.type === 'link') {
                        try {
                            let cssFileUrl = new URL(style.href, url);
                            let promise = network.GET(cssFileUrl.href);
                            promise.then((data: string) => {
                                let tree = cssParser.parse(data);
                                styles[index].cssTree = tree;
                                allStyleRules = allStyleRules.concat(tree)
                            });
                            promises.push(promise)
                        } catch (e) {
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
                        store.dispatch('SET_CSS', styles);
                    }
                    performance.measure('Load & parse external CSS', 'load-and-parse-external-css');

                    // RenderTree
                    performance.mark('render-tree');
                    let renderTree = new RenderTree();
                    let rtree = renderTree.createRenderTree(nodes, allStyleRules);
                    if (store.state.App.devtoolsOpen) {
                        store.dispatch('SET_RENDERTREE', rtree);
                    }
                    performance.measure('Building Render Tree', 'render-tree');

                    performance.mark('layout-tree');
                    let layoutTree = new LayoutTree();
                    let ltree = layoutTree.createLayoutTree(cloneDeep(rtree), canvas.clientWidth, canvas.clientHeight);
                    if (store.state.App.devtoolsOpen) {
                        store.dispatch('SET_LAYOUTTREE', ltree);
                    }
                    performance.measure('Building Layout Tree', 'layout-tree');

                    // Paint
                    performance.mark('paint');
                    let painter = new CanvasPainter();
                    painter.paintTree(<HTMLCanvasElement> canvas, ltree, store.state.App.devtoolsOpen && store.state.App.showDebugLayers);
                    performance.measure('Paint', 'paint');

                    performance.measure('=> Total Time', 'total');
                    this.showPerformanceMeasures();

                    resolve();
                })
            });
        });
    }

    public repaint(renderTree: RenderTreeNode[], canvas: HTMLCanvasElement) {
        console.log('🔄 Repaint: ' + canvas.clientWidth + 'px x ' + canvas.clientHeight + 'px')
        renderTree = cloneDeep(renderTree);
        performance.mark('layout-tree');
        let layoutTree = new LayoutTree();
        let ltree = layoutTree.createLayoutTree(renderTree, canvas.clientWidth, canvas.clientHeight);
        if (store.state.App.devtoolsOpen) {
            store.dispatch('SET_LAYOUTTREE', ltree);
        }
        performance.measure('Building Layout Tree', 'layout-tree');

        // Paint
        performance.mark('paint');
        let painter = new CanvasPainter();
        painter.paintTree(<HTMLCanvasElement> canvas, ltree, store.state.App.devtoolsOpen && store.state.App.showDebugLayers);
        performance.measure('Paint', 'paint');

        this.showPerformanceMeasures();

    }

    private showPerformanceMeasures() {
        // log performance measures to console
        performance.getEntriesByType('measure').forEach(measure => {
            console.log('🕙 ' + measure.name + ': ' + new Intl.NumberFormat('de-CH').format(Math.round(measure.duration)) + 'ms')
        })
        performance.clearMarks();
        performance.clearMeasures();
    }
}
