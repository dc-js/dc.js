import {ascending} from 'd3-array';
import {nest} from 'd3-collection';

import {BaseMixin} from '../base/base-mixin';
import {ChartGroupType, ChartParentType} from '../core/types';
import {Selection} from 'd3-selection';
import {IDataGridConf} from './i-data-grid-conf';

const LABEL_CSS_CLASS = 'dc-grid-label';
const ITEM_CSS_CLASS = 'dc-grid-item';
const SECTION_CSS_CLASS = 'dc-grid-section dc-grid-group';
const GRID_CSS_CLASS = 'dc-grid-top';

/**
 * Data grid is a simple widget designed to list the filtered records, providing
 * a simple way to define how the items are displayed.
 *
 * Note: Formerly the data grid chart (and data table) used the {@link DataGrid#group group} attribute as a
 * keying function for {@link https://github.com/d3/d3-collection/blob/master/README.md#nest nesting} the data
 * together in sections.  This was confusing so it has been renamed to `section`, although `group` still works.
 *
 * Examples:
 * - {@link https://dc-js.github.io/dc.js/ep/ List of members of the european parliament}
 * @mixes BaseMixin
 */
export class DataGrid extends BaseMixin {
    public _conf: IDataGridConf;

    /**
     * Create a Data Grid.
     * @param {String|node|d3.selection} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super();

        this.configure({
            section: null,
            size: 999, // shouldn't be needed, but you might
            html: d => `you need to provide an html() handling param:  ${JSON.stringify(d)}`,
            sortBy: d => d,
            order: ascending,
            beginSlice: 0,
            endSlice: undefined,
            htmlSection: d => `<div class='${SECTION_CSS_CLASS}'><h1 class='${LABEL_CSS_CLASS}'>${this._conf.keyAccessor(d)}</h1></div>`,
        });
        
        this._mandatoryAttributes(['dimension', 'section']);

        this.anchor(parent, chartGroup);
    }

    public configure(conf: IDataGridConf) {
        super.configure(conf);
    }

    public _doRender () {
        this.selectAll(`div.${GRID_CSS_CLASS}`).remove();

        this._renderItems(this._renderSections());

        return this;
    }

    public _renderSections () {
        const sections: Selection<HTMLDivElement, any, Element, any> = this.root().selectAll<HTMLDivElement, any>(`div.${GRID_CSS_CLASS}`)
            .data<any>(this._nestEntries(), d => this._conf.keyAccessor(d));

        const itemSection: Selection<HTMLDivElement, any, Element, any> = sections
            .enter()
            .append('div')
            .attr('class', GRID_CSS_CLASS);

        if (this._conf.htmlSection) {
            itemSection
                .html(d => this._conf.htmlSection(d));
        }

        sections.exit().remove();
        return itemSection;
    }

    public _nestEntries () {
        const entries = this._conf.dimension.top(this._conf.size);

        return nest()
            .key(this._conf.section)
            .sortKeys(this._conf.order)
            .entries(
                entries
                    .sort((a, b) => this._conf.order(this._conf.sortBy(a), this._conf.sortBy(b)))
                    .slice(this._conf.beginSlice, this._conf.endSlice)
            );
    }

    public _renderItems (sections: Selection<HTMLDivElement, any, Element, any>) {
        let items: Selection<HTMLDivElement, unknown, HTMLDivElement, any> = sections.order()
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

    public _doRedraw () {
        return this._doRender();
    }
}
