import {ascending} from 'd3-array';
import {nest} from 'd3-collection';
import {Selection} from 'd3-selection';

import {BaseMixin} from '../base/base-mixin';
import {BaseAccessor, ChartGroupType, ChartParentType, CompareFn, DataTableColumnSpec} from '../core/types';
import {IDataTableConf} from './i-data-table-conf';

const LABEL_CSS_CLASS = 'dc-table-label';
const ROW_CSS_CLASS = 'dc-table-row';
const COLUMN_CSS_CLASS = 'dc-table-column';
const SECTION_CSS_CLASS = 'dc-table-section dc-table-group';
const HEAD_CSS_CLASS = 'dc-table-head';

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
    public _conf: IDataTableConf;

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

        this.configure({
            size: 25,
            columns: [],
            sortBy: d => d,
            order: ascending,
            beginSlice: 0,
            endSlice: undefined,
            showSections: true,
            section: () => '', // all in one section
        });

        this._mandatoryAttributes(['dimension']);

        this.anchor(parent, chartGroup);
    }

    public configure(conf: IDataTableConf) {
        super.configure(conf);
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

    private _doColumnHeaderFormat (d: DataTableColumnSpec): string {
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
        this._conf.columns.forEach(f => {
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
                .data(this._conf.columns);
            headcols.exit().remove();
            headcols.enter().append('th')
                .merge(headcols)
                .attr('class', HEAD_CSS_CLASS)
                .html(d => (this._doColumnHeaderFormat(d)));
        }

        const sections: Selection<HTMLTableSectionElement, any, Element, any> =
            this.root().selectAll<HTMLTableSectionElement, any>('tbody')
                       .data<any>(this._nestEntries(), d => this._conf.keyAccessor(d));

        const rowSection = sections
            .enter()
            .append('tbody');

        if (this._conf.showSections === true) {
            rowSection
                .append('tr')
                .attr('class', SECTION_CSS_CLASS)
                .append('td')
                .attr('class', LABEL_CSS_CLASS)
                .attr('colspan', this._conf.columns.length)
                .html(d => this._conf.keyAccessor(d));
        }

        sections.exit().remove();

        return rowSection;
    }

    private _nestEntries (): { key: string; values: any }[] {
        let entries;
        if (this._conf.order === ascending) {
            entries = this._conf.dimension.bottom(this._conf.size);
        } else {
            entries = this._conf.dimension.top(this._conf.size);
        }

        return nest()
            .key(this._conf.section)
            .sortKeys(this._conf.order)
            .entries(entries.sort((a, b) => this._conf.order(this._conf.sortBy(a), this._conf.sortBy(b))).slice(this._conf.beginSlice, this._conf.endSlice));
    }

    private _renderRows (sections: Selection<HTMLTableSectionElement, any, Element, any>) {
        const rows: Selection<HTMLTableRowElement, unknown, HTMLTableSectionElement, any> = sections.order()
            .selectAll<HTMLTableRowElement, any>(`tr.${ROW_CSS_CLASS}`)
            .data(d => d.values);

        const rowEnter: Selection<HTMLTableRowElement, unknown, HTMLTableSectionElement, any> = rows.enter()
            .append('tr')
            .attr('class', ROW_CSS_CLASS);

        this._conf.columns.forEach((v, i) => {
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
}
