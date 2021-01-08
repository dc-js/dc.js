import { ascending } from 'd3-array';

import { BaseMixin } from '../base/base-mixin';
import { ChartGroupType, ChartParentType } from '../core/types';
import { Selection } from 'd3-selection';
import { IDataGridConf } from './i-data-grid-conf';
import { compatNestHelper } from '../core/d3compat';

const LABEL_CSS_CLASS = 'dc-grid-label';
const ITEM_CSS_CLASS = 'dc-grid-item';
const SECTION_CSS_CLASS = 'dc-grid-section dc-grid-group';
const GRID_CSS_CLASS = 'dc-grid-top';

/**
 * Data grid is a simple widget designed to list the filtered records, providing
 * a simple way to define how the items are displayed.
 *
 * Examples:
 * - {@link https://dc-js.github.io/dc.js/ep/ List of members of the european parliament}
 */
export class DataGrid extends BaseMixin {
    protected _conf: IDataGridConf;

    /**
     * Create a Data Grid.
     */
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);

        this.configure({
            section: null,
            size: 999, // shouldn't be needed, but you might
            html: d => `you need to provide an html() handling param:  ${JSON.stringify(d)}`,
            sortBy: d => d,
            order: ascending,
            beginSlice: 0,
            endSlice: undefined,
            htmlSection: d =>
                `<div class='${SECTION_CSS_CLASS}'><h1 class='${LABEL_CSS_CLASS}'>${this._conf.keyAccessor(
                    d
                )}</h1></div>`,
        });

        this._mandatoryAttributes(['dimension', 'section']);
    }

    public configure(conf: IDataGridConf): this {
        super.configure(conf);
        return this;
    }

    public conf(): IDataGridConf {
        return this._conf;
    }

    protected _doRender(): this {
        this.selectAll(`div.${GRID_CSS_CLASS}`).remove();

        this._renderItems(this._renderSections());

        return this;
    }

    private _renderSections() {
        const sections: Selection<HTMLDivElement, any, Element, any> = this.root()
            .selectAll<HTMLDivElement, any>(`div.${GRID_CSS_CLASS}`)
            .data<any>(this._nestEntries(), d => this._conf.keyAccessor(d));

        const itemSection: Selection<HTMLDivElement, any, Element, any> = sections
            .enter()
            .append('div')
            .attr('class', GRID_CSS_CLASS);

        if (this._conf.htmlSection) {
            itemSection.html(d => this._conf.htmlSection(d));
        }

        sections.exit().remove();
        return itemSection;
    }

    private _nestEntries() {
        // TODO: consider creating special DataProvider
        let entries = this.dataProvider().conf().dimension.top(this._conf.size);

        entries = entries
            .sort((a, b) => this._conf.order(this._conf.sortBy(a), this._conf.sortBy(b)))
            .slice(this._conf.beginSlice, this._conf.endSlice);

        return compatNestHelper({
            key: this._conf.section,
            sortKeys: this._conf.order,
            entries,
        });
    }

    private _renderItems(sections: Selection<HTMLDivElement, any, Element, any>) {
        let items: Selection<HTMLDivElement, unknown, HTMLDivElement, any> = sections
            .order()
            .selectAll<HTMLDivElement, any>(`div.${ITEM_CSS_CLASS}`)
            .data(d => d.values);

        items.exit().remove();

        items = items
            .enter()
            .append('div')
            .attr('class', ITEM_CSS_CLASS)
            .html(d => this._conf.html(d))
            .merge(items);

        return items;
    }

    protected _doRedraw(): this {
        return this._doRender();
    }
}
