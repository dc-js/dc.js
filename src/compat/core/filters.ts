import {
    RangedFilter,
    TwoDimensionalFilter,
    RangedTwoDimensionalFilter,
    HierarchyFilter,
} from '../../core/filters/index';

/**
 * The dc.js filters are functions which are passed into crossfilter to chose which records will be
 * accumulated to produce values for the charts.  In the crossfilter model, any filters applied on one
 * dimension will affect all the other dimensions but not that one.  dc always applies a filter
 * function to the dimension; the function combines multiple filters and if any of them accept a
 * record, it is filtered in.
 *
 * These filter constructors are used as appropriate by the various charts to implement brushing.  We
 * mention below which chart uses which filter.  In some cases, many instances of a filter will be added.
 *
 * Each of the dc.js filters is an object with the following properties:
 * * `isFiltered` - a function that returns true if a value is within the filter
 * * `filterType` - a string identifying the filter, here the name of the constructor
 *
 * Currently these filter objects are also arrays, but this is not a requirement. Custom filters
 * can be used as long as they have the properties above.
 * @namespace filters
 * @type {{}}
 */

export const filters = {
    /**
     * RangedFilter is a filter which accepts keys between `low` and `high`.  It is used to implement X
     * axis brushing for the {@link CoordinateGridMixin coordinate grid charts}.
     *
     * Its `filterType` is 'RangedFilter'
     * @name RangedFilter
     * @memberof filters
     * @param {Number} low
     * @param {Number} high
     * @returns {Array<Number>}
     * @constructor
     */
    RangedFilter: (low, high) => new RangedFilter(low, high),

    /**
     * TwoDimensionalFilter is a filter which accepts a single two-dimensional value.  It is used by the
     * {@link HeatMap heat map chart} to include particular cells as they are clicked.  (Rows and columns are
     * filtered by filtering all the cells in the row or column.)
     *
     * Its `filterType` is 'TwoDimensionalFilter'
     * @name TwoDimensionalFilter
     * @memberof filters
     * @param {Array<Number>} filter
     * @returns {Array<Number>}
     * @constructor
     */
    TwoDimensionalFilter: filter => new TwoDimensionalFilter(filter),

    /**
     * The RangedTwoDimensionalFilter allows filtering all values which fit within a rectangular
     * region. It is used by the {@link ScatterPlot scatter plot} to implement rectangular brushing.
     *
     * It takes two two-dimensional points in the form `[[x1,y1],[x2,y2]]`, and normalizes them so that
     * `x1 <= x2` and `y1 <= y2`. It then returns a filter which accepts any points which are in the
     * rectangular range including the lower values but excluding the higher values.
     *
     * If an array of two values are given to the RangedTwoDimensionalFilter, it interprets the values as
     * two x coordinates `x1` and `x2` and returns a filter which accepts any points for which `x1 <= x <
     * x2`.
     *
     * Its `filterType` is 'RangedTwoDimensionalFilter'
     * @name RangedTwoDimensionalFilter
     * @memberof filters
     * @param {Array<Array<Number>>} filter
     * @returns {Array<Array<Number>>}
     * @constructor
     */
    RangedTwoDimensionalFilter: filter => new RangedTwoDimensionalFilter(filter),

    /**
     * HierarchyFilter is a filter which accepts a key path as an array. It matches any node at, or
     * child of, the given path. It is used by the {@link SunburstChart sunburst chart} to include particular cells and all
     * their children as they are clicked.
     *
     * @name HierarchyFilter
     * @memberof filters
     * @param {String} path
     * @returns {Array<String>}
     * @constructor
     */
    HierarchyFilter: path => new HierarchyFilter(path),
};
