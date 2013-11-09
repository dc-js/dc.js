dc.filters = {};

dc.filters.RangedFilter = function(low, high) {
    var range = Array(low, high);
    range.isFiltered = function(value) {
        return value >= this[0] && value < this[1];
    };

    return range;
};

dc.filters.TwoDimensionalFilter = function(array) {
    var filter = array;
    filter.isFiltered = function(value) {
        return value.length && value.length == filter.length &&
               value[0] == filter[0] && value[1] == filter[1];
    };

    return filter;
};
