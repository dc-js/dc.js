import {Constructor, Units} from '../../core/types';
import {BaseMixinExt} from './base-mixin';
import {CoordinateGridMixin as CoordinateGridMixinNeo} from '../../base/coordinate-grid-mixin';
import {MarginMixinExt} from './margin-mixin';
import {ColorMixinExt} from './color-mixin';
import {CountableTimeInterval} from 'd3-time';

class Intermediate extends MarginMixinExt(BaseMixinExt(CoordinateGridMixinNeo)) { }

export function CoordinateGridMixinExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }

        /**
         * Set or get the xUnits function. The coordinate grid chart uses the xUnits function to calculate
         * the number of data projections on the x axis such as the number of bars for a bar chart or the
         * number of dots for a line chart.
         *
         * This function is expected to return a Javascript array of all data points on the x axis, or
         * the number of points on the axis. d3 time range functions [d3.timeDays, d3.timeMonths, and
         * d3.timeYears](https://github.com/d3/d3-time/blob/master/README.md#intervals) are all valid
         * xUnits functions.
         *
         * dc.js also provides a few units function, see the {@link units Units Namespace} for
         * a list of built-in units functions.
         *
         * Note that as of dc.js 3.0, `units.ordinal` is not a real function, because it is not
         * possible to define this function compliant with the d3 range functions. It was already a
         * magic value which caused charts to behave differently, and now it is completely so.
         * @example
         * // set x units to count days
         * chart.xUnits(d3.timeDays);
         * // set x units to count months
         * chart.xUnits(d3.timeMonths);
         *
         * // A custom xUnits function can be used as long as it follows the following interface:
         * // units in integer
         * function(start, end) {
         *      // simply calculates how many integers in the domain
         *      return Math.abs(end - start);
         * }
         *
         * // fixed units
         * function(start, end) {
         *      // be aware using fixed units will disable the focus/zoom ability on the chart
         *      return 1000;
         * }
         * @param {Function} [xUnits=units.integers]
         * @returns {Function|CoordinateGridMixin}
         */
        public xUnits (): Units;
        public xUnits (xUnits: Units): this;
        public xUnits (xUnits?) {
            if (!arguments.length) {
                return this._conf.xUnits;
            }
            this._conf.xUnits = xUnits;
            return this;
        }

        /**
         * Set or get x axis padding for the elastic x axis. The padding will be added to both end of the x
         * axis if elasticX is turned on; otherwise it is ignored.
         *
         * Padding can be an integer or percentage in string (e.g. '10%'). Padding can be applied to
         * number or date x axes.  When padding a date axis, an integer represents number of units being padded
         * and a percentage string will be treated the same as an integer. The unit will be determined by the
         * xAxisPaddingUnit variable.
         * @param {Number|String} [padding=0]
         * @returns {Number|String|CoordinateGridMixin}
         */
        public xAxisPadding (): number;
        public xAxisPadding (padding: number): this;
        public xAxisPadding (padding?) {
            if (!arguments.length) {
                return this._conf.xAxisPadding;
            }
            this._conf.xAxisPadding = padding;
            return this;
        }

        /**
         * Set or get x axis padding unit for the elastic x axis. The padding unit will determine which unit to
         * use when applying xAxis padding if elasticX is turned on and if x-axis uses a time dimension;
         * otherwise it is ignored.
         *
         * The padding unit should be a
         * [d3 time interval](https://github.com/d3/d3-time/blob/master/README.md#self._interval).
         * For backward compatibility with dc.js 2.0, it can also be the name of a d3 time interval
         * ('day', 'hour', etc). Available arguments are the
         * [d3 time intervals](https://github.com/d3/d3-time/blob/master/README.md#intervals d3.timeInterval).
         * @param {String} [unit=d3.timeDay]
         * @returns {String|CoordinateGridMixin}
         */
        public xAxisPaddingUnit (): string|CountableTimeInterval;
        public xAxisPaddingUnit (unit: string|CountableTimeInterval): this;
        public xAxisPaddingUnit (unit?) {
            if (!arguments.length) {
                return this._conf.xAxisPaddingUnit;
            }
            this._conf.xAxisPaddingUnit = unit;
            return this;
        }

        /**
         * Turn on/off elastic x axis behavior. If x axis elasticity is turned on, then the grid chart will
         * attempt to recalculate the x axis range whenever a redraw event is triggered.
         * @param {Boolean} [elasticX=false]
         * @returns {Boolean|CoordinateGridMixin}
         */
        public elasticX (): boolean;
        public elasticX (elasticX: boolean): this;
        public elasticX (elasticX?) {
            if (!arguments.length) {
                return this._conf.xElasticity;
            }
            this._conf.xElasticity = elasticX;
            return this;
        }

        /**
         * Set or get y axis padding for the elastic y axis. The padding will be added to the top and
         * bottom of the y axis if elasticY is turned on; otherwise it is ignored.
         *
         * Padding can be an integer or percentage in string (e.g. '10%'). Padding can be applied to
         * number or date axes. When padding a date axis, an integer represents number of days being padded
         * and a percentage string will be treated the same as an integer.
         * @param {Number|String} [padding=0]
         * @returns {Number|CoordinateGridMixin}
         */
        public yAxisPadding (): number;
        public yAxisPadding (padding: number): this;
        public yAxisPadding (padding?) {
            if (!arguments.length) {
                return this._conf.yAxisPadding;
            }
            this._conf.yAxisPadding = padding;
            return this;
        }
    }
}

export const CoordinateGridMixin = CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(CoordinateGridMixinNeo))));
