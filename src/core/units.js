import {utils} from './utils';

/**
 * @namespace units
 * @memberof dc
 * @type {{}}
 */
export const units = {};

/**
 * The default value for {@link dc.coordinateGridMixin#xUnits .xUnits} for the
 * {@link dc.coordinateGridMixin Coordinate Grid Chart} and should
 * be used when the x values are a sequence of integers.
 * It is a function that counts the number of integers in the range supplied in its start and end parameters.
 * @method integers
 * @memberof dc.units
 * @see {@link dc.coordinateGridMixin#xUnits coordinateGridMixin.xUnits}
 * @example
 * chart.xUnits(dc.units.integers) // already the default
 * @param {Number} start
 * @param {Number} end
 * @returns {Number}
 */
units.integers = function (start, end) {
    return Math.abs(end - start);
};

/**
 * This argument can be passed to the {@link dc.coordinateGridMixin#xUnits .xUnits} function of a
 * coordinate grid chart to specify ordinal units for the x axis. Usually this parameter is used in
 * combination with passing
 * {@link https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales d3.scaleOrdinal}
 * to {@link dc.coordinateGridMixin#x .x}.
 *
 * As of dc.js 3.0, this is purely a placeholder or magic value which causes the chart to go into ordinal mode; the
 * function is not called.
 * @method ordinal
 * @memberof dc.units
 * @return {uncallable}
 * @see {@link https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales d3.scaleOrdinal}
 * @see {@link dc.coordinateGridMixin#xUnits coordinateGridMixin.xUnits}
 * @see {@link dc.coordinateGridMixin#x coordinateGridMixin.x}
 * @example
 * chart.xUnits(dc.units.ordinal)
 *      .x(d3.scaleOrdinal())
 */
units.ordinal = function () {
    throw new Error('dc.units.ordinal should not be called - it is a placeholder');
};

/**
 * @namespace fp
 * @memberof dc.units
 * @type {{}}
 */
units.fp = {};
/**
 * This function generates an argument for the {@link dc.coordinateGridMixin Coordinate Grid Chart}
 * {@link dc.coordinateGridMixin#xUnits .xUnits} function specifying that the x values are floating-point
 * numbers with the given precision.
 * The returned function determines how many values at the given precision will fit into the range
 * supplied in its start and end parameters.
 * @method precision
 * @memberof dc.units.fp
 * @see {@link dc.coordinateGridMixin#xUnits coordinateGridMixin.xUnits}
 * @example
 * // specify values (and ticks) every 0.1 units
 * chart.xUnits(dc.units.fp.precision(0.1)
 * // there are 500 units between 0.5 and 1 if the precision is 0.001
 * var thousandths = dc.units.fp.precision(0.001);
 * thousandths(0.5, 1.0) // returns 500
 * @param {Number} precision
 * @returns {Function} start-end unit function
 */
units.fp.precision = function (precision) {
    var _f = function (s, e) {
        var d = Math.abs((e - s) / _f.resolution);
        if (utils.isNegligible(d - Math.floor(d))) {
            return Math.floor(d);
        } else {
            return Math.ceil(d);
        }
    };
    _f.resolution = precision;
    return _f;
};
