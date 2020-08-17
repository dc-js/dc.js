import {HtmlLegend as HtmlLegendNeo} from '../../charts/html-legend';

export class HtmlLegend extends HtmlLegendNeo {
    constructor() {
        super();
    }
}

export const htmlLegend = () => new HtmlLegend();
