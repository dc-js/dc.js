import {ascending} from 'd3-array';
import {nest} from 'd3-collection';

import {logger} from '../core/logger';
import {BaseMixin} from '../base/base-mixin';
import {BaseAccessor, ChartGroupType, ChartParentType, CompareFn, GroupingFn} from '../core/types';
import {Selection} from 'd3-selection';

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
    private _section: GroupingFn;
    private _size: number;
    private _html: BaseAccessor<string>;
    private _sortBy: BaseAccessor<any>;
    private _order: CompareFn;
    private _beginSlice: number;
    private _endSlice: number;
    private _htmlSection: BaseAccessor<string>;

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

        this._section = null;
        this._size = 999; // shouldn't be needed, but you might
        this._html = function (d) {
            return `you need to provide an html() handling param:  ${JSON.stringify(d)}`;
        };
        this._sortBy = function (d) {
            return d;
        };
        this._order = ascending;
        this._beginSlice = 0;
        this._endSlice = undefined;

        this._htmlSection = d => `<div class='${SECTION_CSS_CLASS}'><h1 class='${LABEL_CSS_CLASS}'>${
            this.keyAccessor()(d)}</h1></div>`;

        this._mandatoryAttributes(['dimension', 'section']);

        this.anchor(parent, chartGroup);
    }

    public _doRender () {
        this.selectAll(`div.${GRID_CSS_CLASS}`).remove();

        this._renderItems(this._renderSections());

        return this;
    }

    public _renderSections () {
        const sections: Selection<HTMLDivElement, any, Element, any> = this.root().selectAll<HTMLDivElement, any>(`div.${GRID_CSS_CLASS}`)
            .data<any>(this._nestEntries(), d => this.keyAccessor()(d));

        const itemSection: Selection<HTMLDivElement, any, Element, any> = sections
            .enter()
            .append('div')
            .attr('class', GRID_CSS_CLASS);

        if (this._htmlSection) {
            itemSection
                .html(d => this._htmlSection(d));
        }

        sections.exit().remove();
        return itemSection;
    }

    public _nestEntries () {
        const entries = this._conf.dimension.top(this._size);

        return nest()
            .key(this.section())
            .sortKeys(this._order)
            .entries(
                entries
                    .sort((a, b) => this._order(this._sortBy(a), this._sortBy(b)))
                    .slice(this._beginSlice, this._endSlice)
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
            .html(d => this._html(d))
            .merge(items);

        return items;
    }

    public _doRedraw () {
        return this._doRender();
    }

    /**
     * Get or set the section function for the data grid. The section function takes a data row and
     * returns the key to specify to {@link https://github.com/d3/d3-collection/blob/master/README.md#nest d3.nest}
     * to split rows into sections.
     *
     * Do not pass in a crossfilter section as this will not work.
     * @example
     * // section rows by the value of their field
     * chart
     *     .section(function(d) { return d.field; })
     * @param {Function} section Function taking a row of data and returning the nest key.
     * @returns {Function|DataGrid}
     */
    public section (): GroupingFn;
    public section (section: GroupingFn): this;
    public section (section?) {
        if (!arguments.length) {
            return this._section;
        }
        this._section = section;
        return this;
    }

    /**
     * Backward-compatible synonym for {@link DataGrid#section section}.
     *
     * @param {Function} section Function taking a row of data and returning the nest key.
     * @returns {Function|DataGrid}
     */
    // @ts-ignore, signature is different in BaseMixin
    public group (): GroupingFn;
    // @ts-ignore, signature is different in BaseMixin
    public group (section: GroupingFn): this;
    // @ts-ignore, signature is different in BaseMixin
    public group (section?) {
        logger.warnOnce('consider using dataGrid.section instead of dataGrid.group for clarity');
        if (!arguments.length) {
            return this.section();
        }
        return this.section(section);
    }

    /**
     * Get or set the index of the beginning slice which determines which entries get displayed by the widget.
     * Useful when implementing pagination.
     * @param {Number} [beginSlice=0]
     * @returns {Number|DataGrid}
     */
    public beginSlice (): number;
    public beginSlice (beginSlice: number): this;
    public beginSlice (beginSlice?) {
        if (!arguments.length) {
            return this._beginSlice;
        }
        this._beginSlice = beginSlice;
        return this;
    }

    /**
     * Get or set the index of the end slice which determines which entries get displayed by the widget.
     * Useful when implementing pagination.
     * @param {Number} [endSlice]
     * @returns {Number|DataGrid}
     */
    public endSlice (): number;
    public endSlice (endSlice: number): this;
    public endSlice (endSlice?) {
        if (!arguments.length) {
            return this._endSlice;
        }
        this._endSlice = endSlice;
        return this;
    }

    /**
     * Get or set the grid size which determines the number of items displayed by the widget.
     * @param {Number} [size=999]
     * @returns {Number|DataGrid}
     */
    public size (): number;
    public size (size: number): this;
    public size (size?) {
        if (!arguments.length) {
            return this._size;
        }
        this._size = size;
        return this;
    }

    /**
     * Get or set the function that formats an item. The data grid widget uses a
     * function to generate dynamic html. Use your favourite templating engine or
     * generate the string directly.
     * @example
     * chart.html(function (d) { return '<div class='item '+data.exampleCategory+''>'+data.exampleString+'</div>';});
     * @param {Function} [html]
     * @returns {Function|DataGrid}
     */
    public html (): BaseAccessor<string>;
    public html (html: BaseAccessor<string>): this;
    public html (html?) {
        if (!arguments.length) {
            return this._html;
        }
        this._html = html;
        return this;
    }

    /**
     * Get or set the function that formats a section label.
     * @example
     * chart.htmlSection (function (d) { return '<h2>'.d.key . 'with ' . d.values.length .' items</h2>'});
     * @param {Function} [htmlSection]
     * @returns {Function|DataGrid}
     */
    public htmlSection (): BaseAccessor<string>;
    public htmlSection (htmlSection: BaseAccessor<string>): this;
    public htmlSection (htmlSection?) {
        if (!arguments.length) {
            return this._htmlSection;
        }
        this._htmlSection = htmlSection;
        return this;
    }

    /**
     * Backward-compatible synonym for {@link DataGrid#htmlSection htmlSection}.
     * @param {Function} [htmlSection]
     * @returns {Function|DataGrid}
     */
    public htmlGroup (): BaseAccessor<string>;
    public htmlGroup (htmlSection: BaseAccessor<string>): this;
    public htmlGroup (htmlSection?) {
        logger.warnOnce('consider using dataGrid.htmlSection instead of dataGrid.htmlGroup for clarity');
        if (!arguments.length) {
            return this.htmlSection();
        }
        return this.htmlSection(htmlSection);
    }

    /**
     * Get or set sort-by function. This function works as a value accessor at the item
     * level and returns a particular field to be sorted.
     * @example
     * chart.sortBy(function(d) {
     *     return d.date;
     * });
     * @param {Function} [sortByFunction]
     * @returns {Function|DataGrid}
     */
    public sortBy (): BaseAccessor<any>;
    public sortBy (sortByFunction: BaseAccessor<any>): this;
    public sortBy (sortByFunction?) {
        if (!arguments.length) {
            return this._sortBy;
        }
        this._sortBy = sortByFunction;
        return this;
    }

    /**
     * Get or set the sort order function.
     * @see {@link https://github.com/d3/d3-array/blob/master/README.md#ascending d3.ascending}
     * @see {@link https://github.com/d3/d3-array/blob/master/README.md#descending d3.descending}
     * @example
     * chart.order(d3.descending);
     * @param {Function} [order=d3.ascending]
     * @returns {Function|DataGrid}
     */
    public order (): CompareFn;
    public order (order: CompareFn): this;
    public order (order?) {
        if (!arguments.length) {
            return this._order;
        }
        this._order = order;
        return this;
    }
}
