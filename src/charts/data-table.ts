import {ascending} from 'd3-array';
import {nest} from 'd3-collection';

import {logger} from '../core/logger';
import {BaseMixin} from '../base/base-mixin';
import {BaseAccessor, ChartGroupType, ChartParentType, CompareFn} from '../core/types';
import {Selection} from 'd3-selection';

const LABEL_CSS_CLASS = 'dc-table-label';
const ROW_CSS_CLASS = 'dc-table-row';
const COLUMN_CSS_CLASS = 'dc-table-column';
const SECTION_CSS_CLASS = 'dc-table-section dc-table-group';
const HEAD_CSS_CLASS = 'dc-table-head';

type ColumnSpec = ((d) => string) | string | {label: string; format: (d) => string};

/**
 * The data table is a simple widget designed to list crossfilter focused data set (rows being
 * filtered) in a good old tabular fashion.
 *
 * An interesting feature of the data table is that you can pass a crossfilter group to the
 * `dimension`, if you want to show aggregated data instead of raw data rows. This requires no
 * special code as long as you specify the {@link DataTable#order order} as `d3.descending`,
 * since the data table will use `dimension.top()` to fetch the data in that case, and the method is
 * equally supported on the crossfilter group as the crossfilter dimension.
 *
 * If you want to display aggregated data in ascending order, you will need to wrap the group
 * in a [fake dimension](https://github.com/dc-js/dc.js/wiki/FAQ#fake-dimensions) to support the
 * `.bottom()` method. See the example linked below for more details.
 *
 * Note: Formerly the data table (and data grid chart) used the {@link DataTable#group group} attribute as a
 * keying function for {@link https://github.com/d3/d3-collection/blob/master/README.md#nest nesting} the data
 * together in sections.  This was confusing so it has been renamed to `section`, although `group` still works.
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
 * - {@link http://dc-js.github.io/dc.js/examples/table-on-aggregated-data.html dataTable on a crossfilter group}
 * ({@link https://github.com/dc-js/dc.js/blob/master/web-src/examples/table-on-aggregated-data.html source})
 *
 * @mixes BaseMixin
 */
export class DataTable extends BaseMixin {
    private _size: number;
    private _columns: ColumnSpec[];
    private _sortBy: BaseAccessor<any>;
    private _order: CompareFn;
    private _beginSlice: number;
    private _endSlice: number;
    private _showSections: boolean;
    private _section: BaseAccessor<string>;

    /**
     * Create a Data Table.
     *
     * @param {String|node|d3.selection} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super();

        this._size = 25;
        this._columns = [];
        this._sortBy = d => d;
        this._order = ascending;
        this._beginSlice = 0;
        this._endSlice = undefined;
        this._showSections = true;
        this._section = () => ''; // all in one section

        this._mandatoryAttributes(['dimension']);

        this.anchor(parent, chartGroup);
    }

    public _doRender () {
        this.selectAll('tbody').remove();

        this._renderRows(this._renderSections());

        return this;
    }

    private _doColumnValueFormat (v, d) {
        return (typeof v === 'function') ? v(d) :  // v as function
            (typeof v === 'string') ? d[v] :       // v is field name string
            v.format(d);                           // v is Object, use fn (element 2)
    }

    private _doColumnHeaderFormat (d: ColumnSpec): string {
        // if 'function', convert to string representation
        // show a string capitalized
        // if an object then display its label string as-is.
        return (typeof d === 'function') ? this._doColumnHeaderFnToString(d) :
            (typeof d === 'string') ? this._doColumnHeaderCapitalize(d) :
            String(d.label);
    }

    private _doColumnHeaderCapitalize (s: string): string {
        // capitalize
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    // TODO: This looks really peculiar, investigate, code is quite fragile
    private _doColumnHeaderFnToString (f: (...args) => any): string {
        // columnString(f) {
        let s = String(f);
        const i1 = s.indexOf('return ');
        if (i1 >= 0) {
            const i2 = s.lastIndexOf(';');
            if (i2 >= 0) {
                s = s.substring(i1 + 7, i2);
                const i3 = s.indexOf('numberFormat');
                if (i3 >= 0) {
                    s = s.replace('numberFormat', '');
                }
            }
        }
        return s;
    }

    private _renderSections (): Selection<HTMLTableSectionElement, any, Element, any> {
        // The 'original' example uses all 'functions'.
        // If all 'functions' are used, then don't remove/add a header, and leave
        // the html alone. This preserves the functionality of earlier releases.
        // A 2nd option is a string representing a field in the data.
        // A third option is to supply an Object such as an array of 'information', and
        // supply your own _doColumnHeaderFormat and _doColumnValueFormat functions to
        // create what you need.
        let bAllFunctions = true;
        this._columns.forEach(f => {
            bAllFunctions = bAllFunctions && (typeof f === 'function');
        });

        if (!bAllFunctions) {
            // ensure one thead
            let thead: Selection<HTMLTableSectionElement, any, Element, any> =
                this.selectAll<HTMLTableSectionElement, any>('thead').data([0]);

            thead.exit().remove();
            thead = thead.enter()
                .append('thead')
                .merge(thead);

            // with one tr
            let headrow = thead.selectAll<HTMLTableRowElement, any>('tr').data([0]);
            headrow.exit().remove();
            headrow = headrow.enter()
                .append('tr')
                .merge(headrow);

            // with a th for each column
            const headcols = headrow.selectAll<HTMLTableHeaderCellElement, any>('th')
                .data(this._columns);
            headcols.exit().remove();
            headcols.enter().append('th')
                .merge(headcols)
                .attr('class', HEAD_CSS_CLASS)
                .html(d => (this._doColumnHeaderFormat(d)));
        }

        const sections: Selection<HTMLTableSectionElement, any, Element, any> =
            this.root().selectAll<HTMLTableSectionElement, any>('tbody')
                       .data<any>(this._nestEntries(), d => this.keyAccessor()(d));

        const rowSection = sections
            .enter()
            .append('tbody');

        if (this._showSections === true) {
            rowSection
                .append('tr')
                .attr('class', SECTION_CSS_CLASS)
                .append('td')
                .attr('class', LABEL_CSS_CLASS)
                .attr('colspan', this._columns.length)
                .html(d => this.keyAccessor()(d));
        }

        sections.exit().remove();

        return rowSection;
    }

    private _nestEntries (): { key: string; values: any }[] {
        let entries;
        if (this._order === ascending) {
            entries = this.dimension().bottom(this._size);
        } else {
            entries = this.dimension().top(this._size);
        }

        return nest()
            .key(this.section())
            .sortKeys(this._order)
            .entries(entries.sort((a, b) => this._order(this._sortBy(a), this._sortBy(b))).slice(this._beginSlice, this._endSlice));
    }

    private _renderRows (sections: Selection<HTMLTableSectionElement, any, Element, any>) {
        const rows: Selection<HTMLTableRowElement, unknown, HTMLTableSectionElement, any> = sections.order()
            .selectAll<HTMLTableRowElement, any>(`tr.${ROW_CSS_CLASS}`)
            .data(d => d.values);

        const rowEnter: Selection<HTMLTableRowElement, unknown, HTMLTableSectionElement, any> = rows.enter()
            .append('tr')
            .attr('class', ROW_CSS_CLASS);

        this._columns.forEach((v, i) => {
            rowEnter.append('td')
                .attr('class', `${COLUMN_CSS_CLASS} _${i}`)
                .html(d => this._doColumnValueFormat(v, d));
        });

        rows.exit().remove();

        return rows;
    }

    public _doRedraw (): this {
        return this._doRender();
    }

    /**
     * Get or set the section function for the data table. The section function takes a data row and
     * returns the key to specify to {@link https://github.com/d3/d3-collection/blob/master/README.md#nest d3.nest}
     * to split rows into sections. By default there will be only one section with no name.
     *
     * Set {@link DataTable#showSections showSections} to false to hide the section headers
     *
     * @example
     * // section rows by the value of their field
     * chart
     *     .section(function(d) { return d.field; })
     * @param {Function} section Function taking a row of data and returning the nest key.
     * @returns {Function|DataTable}
     */
    public section (): BaseAccessor<string>;
    public section (section: BaseAccessor<string>): this;
    public section (section?) {
        if (!arguments.length) {
            return this._section;
        }
        this._section = section;
        return this;
    }

    /**
     * Backward-compatible synonym for {@link DataTable#section section}.
     *
     * @param {Function} section Function taking a row of data and returning the nest key.
     * @returns {Function|DataTable}
     */
    // @ts-ignore, signature is different in BaseMixin
    public group (): BaseAccessor<string>;
    // @ts-ignore, signature is different in BaseMixin
    public group (section: BaseAccessor<string>): this;
    // @ts-ignore, signature is different in BaseMixin
    public group (section?) {
        logger.warnOnce('consider using dataTable.section instead of dataTable.group for clarity');
        if (!arguments.length) {
            return this.section();
        }
        return this.section(section);
    }

    /**
     * Get or set the table size which determines the number of rows displayed by the widget.
     * @param {Number} [size=25]
     * @returns {Number|DataTable}
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
     * Get or set the index of the beginning slice which determines which entries get displayed
     * by the widget. Useful when implementing pagination.
     *
     * Note: the sortBy function will determine how the rows are ordered for pagination purposes.
     * See the {@link http://dc-js.github.io/dc.js/examples/table-pagination.html table pagination example}
     * to see how to implement the pagination user interface using `beginSlice` and `endSlice`.
     * @param {Number} [beginSlice=0]
     * @returns {Number|DataTable}
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
     * Get or set the index of the end slice which determines which entries get displayed by the
     * widget. Useful when implementing pagination. See {@link DataTable#beginSlice `beginSlice`} for more information.
     * @param {Number|undefined} [endSlice=undefined]
     * @returns {Number|DataTable}
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
     * Get or set column functions. The data table widget supports several methods of specifying the
     * columns to display.
     *
     * The original method uses an array of functions to generate dynamic columns. Column functions
     * are simple javascript functions with only one input argument `d` which represents a row in
     * the data set. The return value of these functions will be used to generate the content for
     * each cell. However, this method requires the HTML for the table to have a fixed set of column
     * headers.
     *
     * <pre><code>chart.columns([
     *     function(d) { return d.date; },
     *     function(d) { return d.open; },
     *     function(d) { return d.close; },
     *     function(d) { return numberFormat(d.close - d.open); },
     *     function(d) { return d.volume; }
     * ]);
     * </code></pre>
     *
     * In the second method, you can list the columns to read from the data without specifying it as
     * a function, except where necessary (ie, computed columns).  Note the data element name is
     * capitalized when displayed in the table header. You can also mix in functions as necessary,
     * using the third `{label, format}` form, as shown below.
     *
     * <pre><code>chart.columns([
     *     "date",    // d["date"], ie, a field accessor; capitalized automatically
     *     "open",    // ...
     *     "close",   // ...
     *     {
     *         label: "Change",
     *         format: function (d) {
     *             return numberFormat(d.close - d.open);
     *         }
     *     },
     *     "volume"   // d["volume"], ie, a field accessor; capitalized automatically
     * ]);
     * </code></pre>
     *
     * In the third example, we specify all fields using the `{label, format}` method:
     * <pre><code>chart.columns([
     *     {
     *         label: "Date",
     *         format: function (d) { return d.date; }
     *     },
     *     {
     *         label: "Open",
     *         format: function (d) { return numberFormat(d.open); }
     *     },
     *     {
     *         label: "Close",
     *         format: function (d) { return numberFormat(d.close); }
     *     },
     *     {
     *         label: "Change",
     *         format: function (d) { return numberFormat(d.close - d.open); }
     *     },
     *     {
     *         label: "Volume",
     *         format: function (d) { return d.volume; }
     *     }
     * ]);
     * </code></pre>
     *
     * You may wish to override the dataTable functions `_doColumnHeaderCapitalize` and
     * `_doColumnHeaderFnToString`, which are used internally to translate the column information or
     * function into a displayed header. The first one is used on the "string" column specifier; the
     * second is used to transform a stringified function into something displayable. For the Stock
     * example, the function for Change becomes the table header **d.close - d.open**.
     *
     * Finally, you can even specify a completely different form of column definition. To do this,
     * override `_chart._doColumnHeaderFormat` and `_chart._doColumnValueFormat` Be aware that
     * fields without numberFormat specification will be displayed just as they are stored in the
     * data, unformatted.
     * @param {Array<Function>} [columns=[]]
     * @returns {Array<Function>}|DataTable}
     */
    public columns (): ColumnSpec[];
    public columns (columns: ColumnSpec[]): this;
    public columns (columns?) {
        if (!arguments.length) {
            return this._columns;
        }
        this._columns = columns;
        return this;
    }

    /**
     * Get or set sort-by function. This function works as a value accessor at row level and returns a
     * particular field to be sorted by.
     * @example
     * chart.sortBy(function(d) {
     *     return d.date;
     * });
     * @param {Function} [sortBy=identity function]
     * @returns {Function|DataTable}
     */
    public sortBy (): BaseAccessor<any>;
    public sortBy (sortBy: BaseAccessor<any>): this;
    public sortBy (sortBy?) {
        if (!arguments.length) {
            return this._sortBy;
        }
        this._sortBy = sortBy;
        return this;
    }

    /**
     * Get or set sort order. If the order is `d3.ascending`, the data table will use
     * `dimension().bottom()` to fetch the data; otherwise it will use `dimension().top()`
     * @see {@link https://github.com/d3/d3-array/blob/master/README.md#ascending d3.ascending}
     * @see {@link https://github.com/d3/d3-array/blob/master/README.md#descending d3.descending}
     * @example
     * chart.order(d3.descending);
     * @param {Function} [order=d3.ascending]
     * @returns {Function|DataTable}
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

    /**
     * Get or set if section header rows will be shown.
     * @example
     * chart
     *     .section([value], [name])
     *     .showSections(true|false);
     * @param {Boolean} [showSections=true]
     * @returns {Boolean|DataTable}
     */
    public showSections (): boolean;
    public showSections (showSections: boolean): this;
    public showSections (showSections?) {
        if (!arguments.length) {
            return this._showSections;
        }
        this._showSections = showSections;
        return this;
    }

    /**
     * Backward-compatible synonym for {@link DataTable#showSections showSections}.
     * @param {Boolean} [showSections=true]
     * @returns {Boolean|DataTable}
     */
    public showGroups (): boolean;
    public showGroups (showSections: boolean): this;
    public showGroups (showSections?) {
        logger.warnOnce('consider using dataTable.showSections instead of dataTable.showGroups for clarity');
        if (!arguments.length) {
            return this.showSections();
        }
        return this.showSections(showSections);
    }
}
