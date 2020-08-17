import {DataTable as DataTableNeo} from '../../charts/data-table';
import {BaseMixinExt} from '../base/base-mixin';
import {BaseAccessor, ChartGroupType, ChartParentType, CompareFn, DataTableColumnSpec} from '../../core/types';
import {logger} from '../core/logger';

// @ts-ignore, remove after group method is moved here
export class DataTable extends BaseMixinExt(DataTableNeo) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
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
            return this._conf.section;
        }
        this.configure({section: section});
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
            return this._conf.size;
        }
        this.configure({size: size});
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
            return this._conf.beginSlice;
        }
        this.configure({beginSlice: beginSlice});
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
            return this._conf.endSlice;
        }
        this.configure({endSlice: endSlice});
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
    public columns (): DataTableColumnSpec[];
    public columns (columns: DataTableColumnSpec[]): this;
    public columns (columns?) {
        if (!arguments.length) {
            return this._conf.columns;
        }
        this.configure({columns: columns});
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
            return this._conf.sortBy;
        }
        this.configure({sortBy: sortBy});
        return this;
    }

    /**
     * Get or set sort order. If the order is `d3.ascending`, the data table will use
     * `conf.dimension.bottom()` to fetch the data; otherwise it will use `conf.dimension.top()`
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
            return this._conf.order;
        }
        this.configure({order: order});
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
            return this._conf.showSections;
        }
        this.configure({showSections: showSections});
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

export const dataTable = (parent: ChartParentType, chartGroup: ChartGroupType) => new DataTable(parent, chartGroup);
