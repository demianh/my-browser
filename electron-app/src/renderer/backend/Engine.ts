import store from '../store';

import {Network} from "./Network";

import {HtmlParser} from "../../../../js/HtmlParser";
import {HtmlStyleExtractor} from "../../../../js/HtmlStyleExtractor";

export class Engine {

    public loadURL(url: string): void {
        let network = new Network();

        store.dispatch('setUrl', url);
        store.dispatch('setHTML', null);
        store.dispatch('setCSS', null);
        network.GET(url).then((data: string) => {

            console.log(data);
            let htmlParser = new HtmlParser();
            let nodes = htmlParser.parse(data);
            store.dispatch('setHTML', nodes);

            let extractor = new HtmlStyleExtractor();
            let styles = extractor.extractStyles(nodes);
            store.dispatch('setCSS', styles);
        });
    }
}
