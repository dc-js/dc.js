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

export interface ICFFilterHandlerConf {
    dimension?: MinimalCFDimension;
    readonly filterHandler?: (dimension: MinimalCFDimension, filters: any) => any;
}

export class CFFilterHandler {
    protected _conf: ICFFilterHandlerConf;
    protected _filters: any[]; // TODO: find better types

    constructor() {
        this.configure({
            filterHandler: _defaultFilterHandler,
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
        if (filter === null || typeof filter === 'undefined') {
            return this._filters.length > 0;
        }
        return this._filters.some(f => filter <= f && filter >= f);
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
        // TODO: Not a great idea to have a method blessed onto an Array, needs redesign
        if (filter instanceof Array && filter[0] instanceof Array && !(filter as any).isFiltered) {
            filter[0].forEach(f => this.toggleFilter(f));
        } else if (filter === null) {
            this.resetFilters();
        } else {
            this.toggleFilter(filter);
        }
        this._filters = this.applyFilters(this._filters);

        return this;
    }

    public toggleFilter (filter) {
        if (this.hasFilter(filter)) {
            this.removeFilter(filter);
        } else {
            this.addFilter(filter);
        }
    }

    public addFilter(f) {
        this._filters.push(f);
    }

    public removeFilter(filter) {
        this._filters = this._filters.filter(f => !(filter <= f && filter >= f));
    }

    public resetFilters() {
        this._filters = [];
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
