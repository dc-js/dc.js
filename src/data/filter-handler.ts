export class FilterHandler {
    private _filters: any[] = []; // TODO: find better types
    get filters(): any[] {
        return this._filters;
    }

    set filters(value: any[]) {
        this._filters = value;
    }

    /**
     * Check whether any active filter or a specific filter is associated.
     */
    public hasFilter(filter?): boolean {
        if (filter === null || typeof filter === 'undefined') {
            return this.filters.length > 0;
        }
        return this.filters.some(f => filter <= f && filter >= f);
    }

    /**
     * Different data backends will implement it differently.
     * Crossfilter version will apply the filter onto the corresponding dimension.
     */
    protected applyFilters() {
        // do nothing at this level, derived classes will actually implement it
    }

    /**
     * This will notify charts that filters have changed.
     * It will be implemented in one of derived classes.
     */
    protected notifyListeners(filter) {}

    // TODO rewrite to use FilterHandler / CFFilterHandler
    /**
     * Filter the chart by the given parameter, or return the current filter if no input parameter
     * is given.
     *
     * The filter parameter can take one of these forms:
     * * A single value: the value will be toggled (added if it is not present in the current
     * filters, removed if it is present)
     * * An array containing a single array of values (`[ [value,value,value] ]`): each value is
     * toggled
     * * When appropriate for the chart, a {@link IFilter dc filter object} such as
     *   * {@link RangedFilter} for the {@link CoordinateGridMixin} charts
     *   * {@link TwoDimensionalFilter} for the {@link HeatMap}
     *   * {@link RangedTwoDimensionalFilter} for the {@link ScatterPlot}
     *   * {@link HierarchyFilter} for the {@link SunburstChart}
     *   * `null`: the filter will be reset by {@link CFSimpleAdapter.resetFilters}
     *
     * Note that this is always a toggle (even when it doesn't make sense for the filter type). If
     * you wish to replace the current filter call
     * {@link BaseMixin.replaceFilter `chart.replaceFilter(filter)`} instead.
     *
     * Each toggle is executed by checking if the value is already present using the
     * {@link CFSimpleAdapter.hasFilter}; if it is not present, it is added
     * using the {@link CFSimpleAdapter.addFilter}; if it is already present,
     * it is removed using the {@link CFSimpleAdapter.removeFilter}.
     *
     * In the Crossfilter version, once the filters array has been updated,
     * the filters are applied to the
     * crossfilter dimension, using the {@link CFSimpleAdapter.applyFilters}.
     *
     * Once you have set the filters, call {@link BaseMixin.redrawGroup}
     * (or {@link ChartGroup.redrawAll}) to redraw the chart's group.
     * @see {@link CFSimpleAdapter.hasFilter}
     * @see {@link CFSimpleAdapter.addFilter}
     * @see {@link CFSimpleAdapter.removeFilter}
     * @see {@link CFSimpleAdapter.applyFilters}
     * @see {@link BaseMixin.replaceFilter}
     * @example
     * ```
     * // filter by a single string
     * chart.filter('Sunday');
     * // filter by a single age
     * chart.filter(18);
     * // filter by a set of states
     * chart.filter([ ['MA', 'TX', 'ND', 'WA'] ]);
     * // filter by range -- note the use of filters.RangedFilter, which is different
     * // from the syntax for filtering a crossfilter dimension directly, dimension.filter([15,20])
     * chart.filter(new RangedFilter(15,20));
     * ```
     */
    public filter();
    public filter(filter): this;
    public filter(filter?) {
        if (!arguments.length) {
            return this.filters.length > 0 ? this.filters[0] : null;
        }

        if (filter === null) {
            this.resetFilters();
        } else if (
            filter instanceof Array &&
            filter[0] instanceof Array &&
            !(filter as any).isFiltered
        ) {
            // list of filters
            filter[0].forEach(f => this.toggleFilter(f));
        } else {
            this.toggleFilter(filter);
        }

        this.applyFilters();

        this.notifyListeners(filter);

        return this;
    }

    public toggleFilter(filter) {
        if (this.hasFilter(filter)) {
            this.removeFilter(filter);
        } else {
            this.addFilter(filter);
        }
    }

    /**
     * Add this filter to existing filters.
     *
     * Override this if you need to alter the default behaviour of this filter to be just appended to the current list.
     *
     * TODO: link to example
     */
    protected addFilter(f) {
        this.filters.push(f);
    }

    /**
     * Remove this filter from existing filters.
     *
     * Override this if you need to alter the default behaviour of this filter to be just removed from the current list.
     *
     * TODO: link to example
     */
    public removeFilter(filter) {
        this.filters = this.filters.filter(f => !(filter <= f && filter >= f));
    }

    /**
     * Clear current filters.
     */
    public resetFilters() {
        this.filters = [];
    }

    /**
     * An opportunity to cleanup.
     */
    public dispose() {
        // use this to cleanup before discarding
    }
}
