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

/**
 * @param array in the form [[x1,y1],[x2,y2]]
 */
dc.filters.RangedTwoDimensionalFilter = function(array){
    if (array == null) { return null; }
    var filter = array;
    var fromTopLeft;
    if (array[0] instanceof Array) {
        fromTopLeft = [[Math.min(array[0][0], array[1][0]),
                        Math.min(array[0][1], array[1][1])],
                       [Math.max(array[0][0], array[1][0]),
                        Math.max(array[0][1], array[1][1])]];
    } else {
        fromTopLeft = [[array[0], -Infinity],[array[1], Infinity]];
    }

    filter.isFiltered = function(value) {
        var x = value[0];
        var y = value[1];

        return value.length == 2 &&
            x >= fromTopLeft[0][0] && x < fromTopLeft[1][0] &&
            y >= fromTopLeft[0][1] && y < fromTopLeft[1][1];
    };

    return filter;
};