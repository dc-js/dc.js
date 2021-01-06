import { DataGrid as DataGridNeo } from '../../charts/data-grid';
import { BaseMixinExt } from '../base/base-mixin';
import {
    BaseAccessor,
    ChartGroupType,
    ChartParentType,
    CompareFn,
    GroupingFn,
} from '../../core/types';
import { logger } from '../core/logger';

// @ts-ignore, remove after group method is moved here
export class DataGrid extends BaseMixinExt(DataGridNeo) {
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
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
     */
    public section(): GroupingFn;
    public section(section: GroupingFn): this;
    public section(section?) {
        if (!arguments.length) {
            return this._conf.section;
        }
        this.configure({ section: section });
        return this;
    }

    /**
     * Backward-compatible synonym for {@link DataGrid#section section}.
     *
     */
    // @ts-ignore, signature is different in BaseMixin
    public group(): GroupingFn;
    // @ts-ignore, signature is different in BaseMixin
    public group(section: GroupingFn): this;
    // @ts-ignore, signature is different in BaseMixin
    public group(section?) {
        logger.warnOnce('consider using dataGrid.section instead of dataGrid.group for clarity');
        if (!arguments.length) {
            return this.section();
        }
        return this.section(section);
    }

    /**
     * Get or set the index of the beginning slice which determines which entries get displayed by the widget.
     * Useful when implementing pagination.
     * @param [beginSlice=0]
     */
    public beginSlice(): number;
    public beginSlice(beginSlice: number): this;
    public beginSlice(beginSlice?) {
        if (!arguments.length) {
            return this._conf.beginSlice;
        }
        this.configure({ beginSlice: beginSlice });
        return this;
    }

    /**
     * Get or set the index of the end slice which determines which entries get displayed by the widget.
     * Useful when implementing pagination.
     */
    public endSlice(): number;
    public endSlice(endSlice: number): this;
    public endSlice(endSlice?) {
        if (!arguments.length) {
            return this._conf.endSlice;
        }
        this.configure({ endSlice: endSlice });
        return this;
    }

    /**
     * Get or set the grid size which determines the number of items displayed by the widget.
     * @param [size=999]
     */
    public size(): number;
    public size(size: number): this;
    public size(size?) {
        if (!arguments.length) {
            return this._conf.size;
        }
        this.configure({ size: size });
        return this;
    }

    /**
     * Get or set the function that formats an item. The data grid widget uses a
     * function to generate dynamic html. Use your favourite templating engine or
     * generate the string directly.
     * @example
     * chart.html(function (d) { return '<div class='item '+data.exampleCategory+''>'+data.exampleString+'</div>';});
     */
    public html(): BaseAccessor<string>;
    public html(html: BaseAccessor<string>): this;
    public html(html?) {
        if (!arguments.length) {
            return this._conf.html;
        }
        this.configure({ html: html });
        return this;
    }

    /**
     * Get or set the function that formats a section label.
     * @example
     * chart.htmlSection (function (d) { return '<h2>'.d.key . 'with ' . d.values.length .' items</h2>'});
     */
    public htmlSection(): BaseAccessor<string>;
    public htmlSection(htmlSection: BaseAccessor<string>): this;
    public htmlSection(htmlSection?) {
        if (!arguments.length) {
            return this._conf.htmlSection;
        }
        this.configure({ htmlSection: htmlSection });
        return this;
    }

    /**
     * Backward-compatible synonym for {@link DataGrid#htmlSection htmlSection}.
     */
    public htmlGroup(): BaseAccessor<string>;
    public htmlGroup(htmlSection: BaseAccessor<string>): this;
    public htmlGroup(htmlSection?) {
        logger.warnOnce(
            'consider using dataGrid.htmlSection instead of dataGrid.htmlGroup for clarity'
        );
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
     */
    public sortBy(): BaseAccessor<any>;
    public sortBy(sortByFunction: BaseAccessor<any>): this;
    public sortBy(sortByFunction?) {
        if (!arguments.length) {
            return this._conf.sortBy;
        }
        this.configure({ sortBy: sortByFunction });
        return this;
    }

    /**
     * Get or set the sort order function.
     * @see {@link https://github.com/d3/d3-array/blob/master/README.md#ascending d3.ascending}
     * @see {@link https://github.com/d3/d3-array/blob/master/README.md#descending d3.descending}
     * @example
     * chart.order(d3.descending);
     */
    public order(): CompareFn;
    public order(order: CompareFn): this;
    public order(order?) {
        if (!arguments.length) {
            return this._conf.order;
        }
        this.configure({ order: order });
        return this;
    }
}

export const dataGrid = (parent: ChartParentType, chartGroup: ChartGroupType) =>
    new DataGrid(parent, chartGroup);
