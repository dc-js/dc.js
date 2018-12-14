dc.crossfilterAdapter = function (_crossfilter) {
    var _dataAdapter = {};

    function wrapDimension (_origDimension) {
        var _dimension = {};

        var _filters = [];

        var applyFilters = function () {
            if (_filters.length === 0) {
                _origDimension.filter(null);
            } else if (_filters.length === 1 && !_filters[0].isFiltered) {
                // single value and not a function-based filter
                _origDimension.filterExact(_filters[0]);
            } else if (_filters.length === 1 && _filters[0].filterType === 'RangedFilter') {
                // single range-based filter
                _origDimension.filterRange(_filters[0]);
            } else {
                _origDimension.filterFunction(function (d) {
                    for (var i = 0; i < _filters.length; i++) {
                        var filter = _filters[i];
                        if (filter.isFiltered && filter.isFiltered(d)) {
                            return true;
                        } else if (filter <= d && filter >= d) {
                            return true;
                        }
                    }
                    return false;
                });
            }
        };

        var removeFilter = function (filter) {
            for (var i = 0; i < _filters.length; i++) {
                if (_filters[i] <= filter && _filters[i] >= filter) {
                    _filters.splice(i, 1);
                    break;
                }
            }
        };

        var addFilter = function (filter) {
            _filters.push(filter);
        };

        _dimension.hasFilter = function (filter) {
            if (filter === null || typeof(filter) === 'undefined') {
                return _filters.length > 0;
            }
            return _filters.some(function (f) {
                return filter <= f && filter >= f;
            });
        };

        _dimension.exFilter = function (filter) {
            if (!arguments.length) {
                return _filters.length > 0 ? _filters[0] : null;
            }
            if (filter instanceof Array && filter[0] instanceof Array && !filter.isFiltered) {
                // toggle each filter
                filter[0].forEach(function (f) {
                    if (_dimension.hasFilter(f)) {
                        removeFilter(f);
                    } else {
                        addFilter(f);
                    }
                });
            } else if (filter === null) {
                _filters = [];
            } else {
                if (_dimension.hasFilter(filter)) {
                    removeFilter(filter);
                } else {
                    addFilter(filter);
                }
            }
            applyFilters();
        };

        _dimension.filters = function () {
            return _filters;
        };

        // Delegate functions to _crossfilter, group doe not seem to be needed within dc
        ['group', 'bottom'].forEach(function (fnName) {
            _dimension[fnName] = function () {
                return _origDimension[fnName].apply(_origDimension, arguments);
            };
        });

        return _dimension;
    }

    _dataAdapter.dimension = function () {
        var dimension = _crossfilter.dimension.apply(_crossfilter, arguments);

        return wrapDimension(dimension);
    };

    // Delegate functions to _crossfilter
    ['groupAll', 'size'].forEach(function (fnName) {
        _dataAdapter[fnName] = function () {
            return _crossfilter[fnName].apply(_crossfilter, arguments);
        };
    });

    return _dataAdapter;
};
