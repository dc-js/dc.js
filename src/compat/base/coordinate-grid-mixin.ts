import {Constructor, Units} from '../../core/types';
import {BaseMixinExt} from './base-mixin';
import {CoordinateGridMixin as CoordinateGridMixinNeo} from '../../base/coordinate-grid-mixin';
import {MarginMixinExt} from './margin-mixin';
import {ColorMixinExt} from './color-mixin';

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
    }
}

export const CoordinateGridMixin = CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(CoordinateGridMixinNeo))));
