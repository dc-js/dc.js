interface IFilters {
    RangedFilter: (low, high) => any[];
    TwoDimensionalFilter: (filter) => null | any;
    RangedTwoDimensionalFilter: (filter) => null | any;
    HierarchyFilter: (path) => null | any;
}

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
export const filters: IFilters = {
    HierarchyFilter(path): any {},
    RangedFilter(low, high): any[] {
        return [];
    },
    RangedTwoDimensionalFilter(filter): any {},
    TwoDimensionalFilter(filter): any {},
};

interface IFilter {
    filterType: string;
    isFiltered(value): boolean;
}

export class RangedFilter<T> extends Array<T> implements IFilter {
    readonly filterType = 'RangedFilter';

    constructor(low: T, high: T) {
        super();
        this[0] = low;
        this[1] = high;
    }

    isFiltered(value: T): boolean {
        return value >= this[0] && value < this[1];
    }
}

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
filters.RangedFilter = (low, high) => new RangedFilter(low, high);

export class TwoDimensionalFilter extends Array implements IFilter {
    public readonly filterType = 'TwoDimensionalFilter';

    constructor(filter) {
        super();
        this[0] = filter[0];
        this[1] = filter[1];
    }

    public isFiltered(value) {
        return (
            value.length &&
            value.length === this.length &&
            value[0] === this[0] &&
            value[1] === this[1]
        );
    }
}

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
filters.TwoDimensionalFilter = filter => new TwoDimensionalFilter(filter);

export class RangedTwoDimensionalFilter extends Array implements IFilter {
    public readonly filterType = 'RangedTwoDimensionalFilter';

    private fromBottomLeft;

    constructor(filter) {
        super();

        for (let i = 0; i < filter.length; i++) {
            this[i] = filter[i];
        }

        if (filter[0] instanceof Array) {
            this.fromBottomLeft = [
                [Math.min(filter[0][0], filter[1][0]), Math.min(filter[0][1], filter[1][1])],
                [Math.max(filter[0][0], filter[1][0]), Math.max(filter[0][1], filter[1][1])],
            ];
        } else {
            this.fromBottomLeft = [
                [filter[0], -Infinity],
                [filter[1], Infinity],
            ];
        }
    }

    public isFiltered(value): boolean {
        let x;
        let y;

        if (value instanceof Array) {
            x = value[0];
            y = value[1];
        } else {
            x = value;
            y = this.fromBottomLeft[0][1];
        }

        return (
            x >= this.fromBottomLeft[0][0] &&
            x < this.fromBottomLeft[1][0] &&
            y >= this.fromBottomLeft[0][1] &&
            y < this.fromBottomLeft[1][1]
        );
    }
}

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
filters.RangedTwoDimensionalFilter = filter => new RangedTwoDimensionalFilter(filter);

// ******** Sunburst Chart ********

class HierarchyFilter extends Array implements IFilter {
    public readonly filterType = 'HierarchyFilter';

    constructor(path) {
        super();

        for (let i = 0; i < path.length; i++) {
            this[i] = path[i];
        }
    }

    public isFiltered(value): boolean {
        const filter = this;

        if (!(filter.length && value && value.length && value.length >= filter.length)) {
            return false;
        }

        for (let i = 0; i < filter.length; i++) {
            if (value[i] !== filter[i]) {
                return false;
            }
        }

        return true;
    }
}

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
filters.HierarchyFilter = path => new HierarchyFilter(path);
