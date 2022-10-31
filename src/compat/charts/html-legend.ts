import { HtmlLegend as HtmlLegendNeo } from '../../charts/html-legend.js';

export class HtmlLegend extends HtmlLegendNeo {
    constructor() {
        super();
    }
}

export const htmlLegend = () => new HtmlLegend();
