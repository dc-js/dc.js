import { MinimalCFDimension } from '../core/types';

const _defaultFilterHandler = (dimension: MinimalCFDimension, filters) => {
    if (filters.length === 0) {
        dimension.filter(null);
    } else if (filters.length === 1 && !filters[0].isFiltered) {
        // single value and not a function-based filter
        dimension.filterExact(filters[0]);
    } else if (filters.length === 1 && filters[0].filterType === 'RangedFilter') {
        // single range-based filter
        dimension.filterRange(filters[0]);
    } else {
        dimension.filterFunction(d => {
            for (let i = 0; i < filters.length; i++) {
                const filter = filters[i];
                if (filter.isFiltered) {
                    if (filter.isFiltered(d)) {
                        return true;
                    }
                } else if (filter <= d && filter >= d) {
                    return true;
                }
            }
            return false;
        });
    }
    return filters;
};

const _defaultHasFilterHandler = (filters, filter) => {
    if (filter === null || typeof filter === 'undefined') {
        return filters.length > 0;
    }
    return filters.some(f => filter <= f && filter >= f);
};

const _defaultRemoveFilterHandler = (filters, filter) => {
    for (let i = 0; i < filters.length; i++) {
        if (filters[i] <= filter && filters[i] >= filter) {
            filters.splice(i, 1);
            break;
        }
    }
    return filters;
};

const _defaultAddFilterHandler = (filters, filter) => {
    filters.push(filter);
    return filters;
};

const _defaultResetFilterHandler = filters => [];

export interface ICFFilterHandlerConf {
    dimension?: MinimalCFDimension;
    readonly resetFilterHandler?: (filters: any) => any[];
    readonly addFilterHandler?: (filters: any, filter: any) => any;
    readonly removeFilterHandler?: (filters: any, filter: any) => any;
    readonly filterHandler?: (dimension: MinimalCFDimension, filters: any) => any;
    readonly hasFilterHandler?: (filters, filter) => boolean;
}

export class CFFilterHandler {
    protected _conf: ICFFilterHandlerConf;
    public _filters: any[]; // TODO: find better types

    constructor() {
        this.configure({
            filterHandler: _defaultFilterHandler,
            hasFilterHandler: _defaultHasFilterHandler,
            removeFilterHandler: _defaultRemoveFilterHandler,
            addFilterHandler: _defaultAddFilterHandler,
            resetFilterHandler: _defaultResetFilterHandler,
        });

        this._filters = [];
    }

    public configure(conf: ICFFilterHandlerConf): this {
        this._conf = { ...this._conf, ...conf };
        return this;
     }

    public conf(): ICFFilterHandlerConf {
        return this._conf;
    }

    /**
     * Check whether any active filter or a specific filter is associated with particular chart instance.
     * This function is **not chainable**.
     * @see {@link BaseMixin#hasFilterHandler hasFilterHandler}
     * @param {*} [filter]
     * @returns {Boolean}
     */
    public hasFilter(filter?): boolean {
        return this._conf.hasFilterHandler(this._filters, filter);
    }

    public applyFilters(filters) {
        if (this._conf.dimension && this._conf.dimension.filter) {
            const fs = this._conf.filterHandler(this._conf.dimension, filters);
            if (fs) {
                filters = fs;
            }
        }
        return filters;
    }

    /**
     * Replace the chart filter. This is equivalent to calling `chart.filter(null).filter(filter)`
     * but more efficient because the filter is only applied once.
     *
     * @param {*} [filter]
     * @returns {BaseMixin}
     */
    public replaceFilter(filter): this {
        this._filters = this._conf.resetFilterHandler(this._filters);
        // this.filter(filter);  // TODO: this should be here, it will need refactoring BaseMixin.filter which has side effects
        return this;
    }

    /**
     * Filter the chart by the given parameter, or return the current filter if no input parameter
     * is given.
     *
     * The filter parameter can take one of these forms:
     * * A single value: the value will be toggled (added if it is not present in the current
     * filters, removed if it is present)
     * * An array containing a single array of values (`[[value,value,value]]`): each value is
     * toggled
     * * When appropriate for the chart, a {@link filters dc filter object} such as
     *   * {@link filters.RangedFilter `filters.RangedFilter`} for the
     * {@link CoordinateGridMixin CoordinateGridMixin} charts
     *   * {@link filters.TwoDimensionalFilter `filters.TwoDimensionalFilter`} for the
     * {@link HeatMap heat map}
     *   * {@link filters.RangedTwoDimensionalFilter `filters.RangedTwoDimensionalFilter`}
     * for the {@link ScatterPlot scatter plot}
     * * `null`: the filter will be reset using the
     * {@link BaseMixin#resetFilterHandler resetFilterHandler}
     *
     * Note that this is always a toggle (even when it doesn't make sense for the filter type). If
     * you wish to replace the current filter, either call `chart.filter(null)` first - or it's more
     * efficient to call {@link BaseMixin#replaceFilter `chart.replaceFilter(filter)`} instead.
     *
     * Each toggle is executed by checking if the value is already present using the
     * {@link BaseMixin#hasFilterHandler hasFilterHandler}; if it is not present, it is added
     * using the {@link BaseMixin#addFilterHandler addFilterHandler}; if it is already present,
     * it is removed using the {@link BaseMixin#removeFilterHandler removeFilterHandler}.
     *
     * Once the filters array has been updated, the filters are applied to the
     * crossfilter dimension, using the {@link BaseMixin#filterHandler filterHandler}.
     *
     * Once you have set the filters, call {@link BaseMixin#redrawGroup `chart.redrawGroup()`}
     * (or {@link redrawAll `redrawAll()`}) to redraw the chart's group.
     * @see {@link BaseMixin#addFilterHandler addFilterHandler}
     * @see {@link BaseMixin#removeFilterHandler removeFilterHandler}
     * @see {@link BaseMixin#resetFilterHandler resetFilterHandler}
     * @see {@link BaseMixin#filterHandler filterHandler}
     * @example
     * // filter by a single string
     * chart.filter('Sunday');
     * // filter by a single age
     * chart.filter(18);
     * // filter by a set of states
     * chart.filter([['MA', 'TX', 'ND', 'WA']]);
     * // filter by range -- note the use of filters.RangedFilter, which is different
     * // from the syntax for filtering a crossfilter dimension directly, dimension.filter([15,20])
     * chart.filter(filters.RangedFilter(15,20));
     * @param {*} [filter]
     * @returns {BaseMixin}
     */
    public filter();
    public filter(filter): this;
    public filter(filter?) {
        if (!arguments.length) {
            return this._filters.length > 0 ? this._filters[0] : null;
        }
        let filters: any[] = this._filters;
        // TODO: Not a great idea to have a method blessed onto an Array, needs redesign
        if (filter instanceof Array && filter[0] instanceof Array && !(filter as any).isFiltered) {
            // toggle each filter
            filter[0].forEach(f => {
                if (this._conf.hasFilterHandler(filters, f)) {
                    filters = this._conf.removeFilterHandler(filters, f);
                } else {
                    filters = this._conf.addFilterHandler(filters, f);
                }
            });
        } else if (filter === null) {
            filters = this._conf.resetFilterHandler(filters);
        } else {
            if (this._conf.hasFilterHandler(filters, filter)) {
                filters = this._conf.removeFilterHandler(filters, filter);
            } else {
                filters = this._conf.addFilterHandler(filters, filter);
            }
        }
        this._filters = this.applyFilters(filters);

        return this;
    }

    /**
     * Returns all current filters. This method does not perform defensive cloning of the internal
     * filter array before returning, therefore any modification of the returned array will effect the
     * chart's internal filter storage.
     * @returns {Array<*>}
     */
    public filters() {
        return this._filters;
    }
}
