dc.filters = {};

dc.filters.RangedFilter = function(low, high) {
    var range = Array(low, high);
    range.isFiltered = function(value) {
        return value >= this[0] && value < this[1];
    };

    return range;
};

dc.filters.TwoDimensionalFilter = function(array) {
    if (array === null) { return null; }

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
    if (array === null) { return null; }

    var filter = array;
    var fromBottomLeft;

    if (filter[0] instanceof Array) {
        fromBottomLeft = [[Math.min(array[0][0], array[1][0]),
                           Math.min(array[0][1], array[1][1])],
                          [Math.max(array[0][0], array[1][0]),
                           Math.max(array[0][1], array[1][1])]];
    } else {
        fromBottomLeft = [[array[0], -Infinity],
                          [array[1], Infinity]];
    }

    filter.isFiltered = function(value) {
        var x, y;

        if (value instanceof Array) {
            if (value.length != 2) return false;
            x = value[0];
            y = value[1];
        } else {
            x = value;
            y = fromBottomLeft[0][1];
        }

        return x >= fromBottomLeft[0][0] && x < fromBottomLeft[1][0] &&
               y >= fromBottomLeft[0][1] && y < fromBottomLeft[1][1];
    };

    return filter;
};
