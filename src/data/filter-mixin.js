import {DataProvider} from './data-provider';

const _defaultFilterHandler = (dimension, filters) => {
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
                    if(filter.isFiltered(d)) {
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
    if (filter === null || typeof (filter) === 'undefined') {
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

export class FilterMixin extends DataProvider {
    constructor () {
        super();

        this._filters = [];

        this._filterHandler = _defaultFilterHandler;
        this._hasFilterHandler = _defaultHasFilterHandler;
        this._removeFilterHandler = _defaultRemoveFilterHandler;
        this._addFilterHandler = _defaultAddFilterHandler;
        this._resetFilterHandler = _defaultResetFilterHandler;
    }

    hasFilter (filter) {
        return this._hasFilterHandler(this._filters, filter);
    }

    _applyFilters (filters) {
        if (this.dimension && this.dimension.filter) {
            const fs = this._filterHandler(this.dimension, filters);
            if (fs) {
                filters = fs;
            }
        }
        return filters;
    }

    clearFilters () {
        this._filters = this._resetFilterHandler(this._filters);
    }

    filter (filter) {
        if (!arguments.length) {
            return this._filters.length > 0 ? this._filters[0] : null;
        }
        let filters = this._filters;
        if (filter instanceof Array && filter[0] instanceof Array && !filter.isFiltered) {
            // toggle each filter
            filter[0].forEach(f => {
                if (this._hasFilterHandler(filters, f)) {
                    filters = this._removeFilterHandler(filters, f);
                } else {
                    filters = this._addFilterHandler(filters, f);
                }
            });
        } else if (filter === null) {
            filters = this._resetFilterHandler(filters);
        } else {
            if (this._hasFilterHandler(filters, filter)) {
                filters = this._removeFilterHandler(filters, filter);
            } else {
                filters = this._addFilterHandler(filters, filter);
            }
        }
        this._filters = this._applyFilters(filters);
        return filter;
    }
}
