import { ascending } from 'd3-array';
import { Selection } from 'd3-selection';

import { BaseMixin } from '../base/base-mixin';
import { ChartGroupType, ChartParentType, DataTableColumnSpec } from '../core/types';
import { IDataTableConf } from './i-data-table-conf';
import { compatNestHelper } from '../core/d3compat';

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
 * special code as long as you specify the {@link IDataTableConf.order order} as `d3.descending`,
 * since the data table will use `dimension.top()` to fetch the data in that case, and the method is
 * equally supported on the crossfilter group as the crossfilter dimension.
 *
 * If you want to display aggregated data in ascending order, you will need to wrap the group
 * in a [fake dimension](https://github.com/dc-js/dc.js/wiki/FAQ#fake-dimensions) to support the
 * `.bottom()` method. See the example linked below for more details.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
 * - {@link http://dc-js.github.io/dc.js/examples/table-on-aggregated-data.html dataTable on a crossfilter group}
 * ({@link https://github.com/dc-js/dc.js/blob/master/web-src/examples/table-on-aggregated-data.html source})
 *
 */
export class DataTable extends BaseMixin {
    protected _conf: IDataTableConf;

    /**
     * Create a Data Table.
     */
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);

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
    }

    public configure(conf: IDataTableConf): this {
        super.configure(conf);
        return this;
    }

    public conf(): IDataTableConf {
        return this._conf;
    }

    protected _doRender(): this {
        this.selectAll('tbody').remove();

        this._renderRows(this._renderSections());

        return this;
    }

    private _doColumnValueFormat(v, d) {
        if (typeof v === 'function') {
            // v is function
            return v(d);
        }
        if (typeof v === 'string') {
            // v is field name string
            return d[v];
        }
        // v is Object, use fn (element 2)
        return v.format(d);
    }

    private _doColumnHeaderFormat(d: DataTableColumnSpec): string {
        // if 'function', convert to string representation
        // show a string capitalized
        // if an object then display its label string as-is.
        if (typeof d === 'function') {
            return this._doColumnHeaderFnToString(d);
        }
        if (typeof d === 'string') {
            return this._doColumnHeaderCapitalize(d);
        }
        return String(d.label);
    }

    private _doColumnHeaderCapitalize(s: string): string {
        // capitalize
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    // TODO: This looks really peculiar, investigate, code is quite fragile
    private _doColumnHeaderFnToString(f: (...args) => any): string {
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

    private _renderSections(): Selection<HTMLTableSectionElement, any, Element, any> {
        // The 'original' example uses all 'functions'.
        // If all 'functions' are used, then don't remove/add a header, and leave
        // the html alone. This preserves the functionality of earlier releases.
        // A 2nd option is a string representing a field in the data.
        // A third option is to supply an Object such as an array of 'information', and
        // supply your own _doColumnHeaderFormat and _doColumnValueFormat functions to
        // create what you need.
        let bAllFunctions = true;
        this._conf.columns.forEach(f => {
            bAllFunctions = bAllFunctions && typeof f === 'function';
        });

        if (!bAllFunctions) {
            // ensure one thead
            // prettier-ignore
            let thead: Selection<HTMLTableSectionElement, any, Element, any> =
                this.selectAll<HTMLTableSectionElement, any>('thead').data([0]);

            thead.exit().remove();
            thead = thead.enter().append('thead').merge(thead);

            // with one tr
            let headrow = thead.selectAll<HTMLTableRowElement, any>('tr').data([0]);
            headrow.exit().remove();
            headrow = headrow.enter().append('tr').merge(headrow);

            // with a th for each column
            const headcols = headrow
                .selectAll<HTMLTableHeaderCellElement, any>('th')
                .data(this._conf.columns);
            headcols.exit().remove();
            headcols
                .enter()
                .append('th')
                .merge(headcols)
                .attr('class', HEAD_CSS_CLASS)
                .html(d => this._doColumnHeaderFormat(d));
        }

        const sections: Selection<HTMLTableSectionElement, any, Element, any> = this.root()
            .selectAll<HTMLTableSectionElement, any>('tbody')
            .data<any>(this._nestEntries(), d => this._conf.keyAccessor(d));

        const rowSection = sections.enter().append('tbody');

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

    private _nestEntries(): { key: string; values: any }[] {
        // TODO: consider creating special DataProvider
        const dimension = this.dataProvider().conf().dimension;

        let entries;
        if (this._conf.order === ascending) {
            entries = dimension.bottom(this._conf.size);
        } else {
            entries = dimension.top(this._conf.size);
        }

        entries = entries
            .sort((a, b) => this._conf.order(this._conf.sortBy(a), this._conf.sortBy(b)))
            .slice(this._conf.beginSlice, this._conf.endSlice);

        return compatNestHelper({
            key: this._conf.section,
            sortKeys: this._conf.order,
            entries,
        });
    }

    private _renderRows(sections: Selection<HTMLTableSectionElement, any, Element, any>) {
        const rows: Selection<HTMLTableRowElement, unknown, HTMLTableSectionElement, any> = sections
            .order()
            .selectAll<HTMLTableRowElement, any>(`tr.${ROW_CSS_CLASS}`)
            .data(d => d.values);

        const rowEnter: Selection<
            HTMLTableRowElement,
            unknown,
            HTMLTableSectionElement,
            any
        > = rows.enter().append('tr').attr('class', ROW_CSS_CLASS);

        this._conf.columns.forEach((v, i) => {
            rowEnter
                .append('td')
                .attr('class', `${COLUMN_CSS_CLASS} _${i}`)
                .html(d => this._doColumnValueFormat(v, d));
        });

        rows.exit().remove();

        return rows;
    }

    protected _doRedraw(): this {
        return this._doRender();
    }
}
