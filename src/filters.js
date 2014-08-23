dc.filters = {};

/**
## Filters
The dc.js filters are functions which are passed into crossfilter to chose which records will be
accumulated to produce values for the charts.  In the crossfilter model, any filters applied on one
dimension will affect all the other dimensions but not that one.  dc always applies a filter
function to the dimension; the function combines multiple filters and if any of them accept a
record, it is filtered in.

These filter constructors are used as appropriate by the various charts to implement brushing.  We
mention below which chart uses which filter.  In some cases, many instances of a filter will be added.

**/

/**
#### dc.filters.RangedFilter(low, high)
 RangedFilter is a filter which accepts keys between `low` and `high`.  It is used to implement X
 axis brushing for the [coordinate grid charts](#coordinate-grid-mixin).
**/
dc.filters.RangedFilter = function (low, high) {
    var range = new Array(low, high);
    range.isFiltered = function (value) {
        return value >= this[0] && value < this[1];
    };

    return range;
};

/**
#### dc.filters.TwoDimensionalFilter(array)
 TwoDimensionalFilter is a filter which accepts a single two-dimensional value.  It is used by the
 [heat map chart](#heat-map) to include particular cells as they are clicked.  (Rows and columns are
 filtered by filtering all the cells in the row or column.)
**/
dc.filters.TwoDimensionalFilter = function (array) {
    if (array === null) { return null; }

    var filter = array;
    filter.isFiltered = function (value) {
        return value.length && value.length === filter.length &&
               value[0] === filter[0] && value[1] === filter[1];
    };

    return filter;
};

/**
#### dc.filters.RangedTwoDimensionalFilter(array)
 The RangedTwoDimensionalFilter allows filtering all values which fit within a rectangular
 region. It is used by the [scatter plot](#scatter-plot) to implement rectangular brushing.

 It takes two two-dimensional points in the form `[[x1,y1],[x2,y2]]`, and normalizes them so that
 `x1 <= x2` and `y1 <- y2`. It then returns a filter which accepts any points which are in the
 rectangular range including the lower values but excluding the higher values.

 If an array of two values are given to the RangedTwoDimensionalFilter, it interprets the values as
 two x coordinates `x1` and `x2` and returns a filter which accepts any points for which `x1 <= x <
 x2`.
 **/
dc.filters.RangedTwoDimensionalFilter = function (array) {
    if (array === null) { return null; }

    var filter = array;
    var fromBottomLeft;

    if (filter[0] instanceof Array) {
        fromBottomLeft = [
            [Math.min(array[0][0], array[1][0]), Math.min(array[0][1], array[1][1])],
            [Math.max(array[0][0], array[1][0]), Math.max(array[0][1], array[1][1])]
        ];
    } else {
        fromBottomLeft = [[array[0], -Infinity], [array[1], Infinity]];
    }

    filter.isFiltered = function (value) {
        var x, y;

        if (value instanceof Array) {
            if (value.length !== 2) {
                return false;
            }
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
