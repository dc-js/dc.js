import { Constructor, RoundFn, Units } from '../../core/types';
import { BaseMixinExt } from './base-mixin';
import { CoordinateGridMixin as CoordinateGridMixinNeo } from '../../base/coordinate-grid-mixin';
import { MarginMixinExt } from './margin-mixin';
import { ColorMixinExt } from './color-mixin';
import { CountableTimeInterval } from 'd3-time';
import { logger } from '../core/logger';

class Intermediate extends MarginMixinExt(BaseMixinExt(CoordinateGridMixinNeo)) {}

export function CoordinateGridMixinExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        private _rangeChart: typeof CoordinateGridMixin;
        private _focusChart: typeof CoordinateGridMixin;

        constructor(...args: any[]) {
            super(...args);

            this._rangeChart = undefined;
            this._focusChart = undefined;
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
        public xUnits(): Units;
        public xUnits(xUnits: Units): this;
        public xUnits(xUnits?) {
            if (!arguments.length) {
                return this._conf.xUnits;
            }
            this.configure({ xUnits: xUnits });
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
        public xAxisPadding(): number;
        public xAxisPadding(padding: number): this;
        public xAxisPadding(padding?) {
            if (!arguments.length) {
                return this._conf.xAxisPadding;
            }
            this.configure({ xAxisPadding: padding });
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
        public xAxisPaddingUnit(): string | CountableTimeInterval;
        public xAxisPaddingUnit(unit: string | CountableTimeInterval): this;
        public xAxisPaddingUnit(unit?) {
            if (!arguments.length) {
                return this._conf.xAxisPaddingUnit;
            }
            this.configure({ xAxisPaddingUnit: unit });
            return this;
        }

        /**
         * Turn on/off elastic x axis behavior. If x axis elasticity is turned on, then the grid chart will
         * attempt to recalculate the x axis range whenever a redraw event is triggered.
         * @param {Boolean} [elasticX=false]
         * @returns {Boolean|CoordinateGridMixin}
         */
        public elasticX(): boolean;
        public elasticX(elasticX: boolean): this;
        public elasticX(elasticX?) {
            if (!arguments.length) {
                return this._conf.elasticX;
            }
            this.configure({ elasticX });
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
        public yAxisPadding(): number;
        public yAxisPadding(padding: number): this;
        public yAxisPadding(padding?) {
            if (!arguments.length) {
                return this._conf.yAxisPadding;
            }
            this.configure({ yAxisPadding: padding });
            return this;
        }

        /**
         * Turn on/off elastic y axis behavior. If y axis elasticity is turned on, then the grid chart will
         * attempt to recalculate the y axis range whenever a redraw event is triggered.
         * @param {Boolean} [elasticY=false]
         * @returns {Boolean|CoordinateGridMixin}
         */
        public elasticY(): boolean;
        public elasticY(elasticY: boolean): this;
        public elasticY(elasticY?) {
            if (!arguments.length) {
                return this._conf.elasticY;
            }
            this.configure({ elasticY });
            return this;
        }

        /**
         * Set or get the rounding function used to quantize the selection when brushing is enabled.
         * @example
         * // set x unit round to by month, this will make sure range selection brush will
         * // select whole months
         * chart.round(d3.timeMonth.round);
         * @param {Function} [round]
         * @returns {Function|CoordinateGridMixin}
         */
        public round(): RoundFn;
        public round(round: RoundFn): this;
        public round(round?) {
            if (!arguments.length) {
                return this._conf.round;
            }
            this.configure({ round: round });
            return this;
        }

        /**
         * Turn on/off horizontal grid lines.
         * @param {Boolean} [renderHorizontalGridLines=false]
         * @returns {Boolean|CoordinateGridMixin}
         */
        public renderHorizontalGridLines(): boolean;
        public renderHorizontalGridLines(renderHorizontalGridLines: boolean): this;
        public renderHorizontalGridLines(renderHorizontalGridLines?) {
            if (!arguments.length) {
                return this._conf.renderHorizontalGridLine;
            }
            this.configure({ renderHorizontalGridLine: renderHorizontalGridLines });
            return this;
        }

        /**
         * Turn on/off vertical grid lines.
         * @param {Boolean} [renderVerticalGridLines=false]
         * @returns {Boolean|CoordinateGridMixin}
         */
        public renderVerticalGridLines(): boolean;
        public renderVerticalGridLines(renderVerticalGridLines: boolean): this;
        public renderVerticalGridLines(renderVerticalGridLines?) {
            if (!arguments.length) {
                return this._conf.renderVerticalGridLines;
            }
            this.configure({ renderVerticalGridLines: renderVerticalGridLines });
            return this;
        }

        /**
         * Get or set the scale extent for mouse zooms. See https://github.com/d3/d3-zoom#zoom_scaleExtent.
         *
         * @returns {Array<Number>|CoordinateGridMixin}
         */
        public zoomScale(): [number, number];
        public zoomScale(extent: [number, number]): this;
        public zoomScale(extent?) {
            if (!arguments.length) {
                return this._conf.zoomScale;
            }
            this.configure({ zoomScale: extent });
            return this;
        }

        /**
         * Get or set the zoom restriction for the chart. If true limits the zoom to original domain of the chart.
         * @param {Boolean} [zoomOutRestrict=true]
         * @returns {Boolean|CoordinateGridMixin}
         */
        public zoomOutRestrict(): boolean;
        public zoomOutRestrict(zoomOutRestrict: boolean): this;
        public zoomOutRestrict(zoomOutRestrict?) {
            if (!arguments.length) {
                return this._conf.zoomOutRestrict;
            }
            this.configure({ zoomOutRestrict: zoomOutRestrict });
            return this;
        }

        /**
         * Set or get mouse zoom capability flag (default: false). When turned on the chart will be
         * zoomable using the mouse wheel. If the range selector chart is attached zooming will also update
         * the range selection brush on the associated range selector chart.
         * @param {Boolean} [mouseZoomable=false]
         * @returns {Boolean|CoordinateGridMixin}
         */
        public mouseZoomable(): boolean;
        public mouseZoomable(mouseZoomable: boolean): this;
        public mouseZoomable(mouseZoomable?) {
            if (!arguments.length) {
                return this._conf.mouseZoomable;
            }
            this.configure({ mouseZoomable: mouseZoomable });
            return this;
        }

        /**
         * Get or set the padding in pixels for the clip path. Once set padding will be applied evenly to
         * the top, left, right, and bottom when the clip path is generated. If set to zero, the clip area
         * will be exactly the chart body area minus the margins.
         * @param {Number} [padding=5]
         * @returns {Number|CoordinateGridMixin}
         */
        public clipPadding(): number;
        public clipPadding(padding: number): this;
        public clipPadding(padding?) {
            if (!arguments.length) {
                return this._conf.clipPadding;
            }
            this.configure({ clipPadding: padding });
            return this;
        }

        /**
         * Gets or sets whether the chart should be drawn with a right axis instead of a left axis. When
         * used with a chart in a composite chart, allows both left and right Y axes to be shown on a
         * chart.
         * @param {Boolean} [useRightYAxis=false]
         * @returns {Boolean|CoordinateGridMixin}
         */
        public useRightYAxis(): boolean;
        public useRightYAxis(useRightYAxis: boolean): this;
        public useRightYAxis(useRightYAxis?) {
            if (!arguments.length) {
                return this._conf.useRightYAxis;
            }

            // We need to warn if value is changing after self._yAxis was created
            // @ts-ignore, _yAxis is private in CoordinateGridMixin
            if (this._conf.useRightYAxis !== useRightYAxis && this._yAxis) {
                logger.warn(
                    'Value of useRightYAxis has been altered, after yAxis was created. ' +
                        'You might get unexpected yAxis behavior. ' +
                        'Make calls to useRightYAxis sooner in your chart creation process.'
                );
            }

            this.configure({ useRightYAxis: useRightYAxis });
            return this;
        }

        /**
         * Get or set the range selection chart associated with this instance. Setting the range selection
         * chart using this function will automatically update its selection brush when the current chart
         * zooms in. In return the given range chart will also automatically attach this chart as its focus
         * chart hence zoom in when range brush updates.
         *
         * Usually the range and focus charts will share a dimension. The range chart will set the zoom
         * boundaries for the focus chart, so its dimension values must be compatible with the domain of
         * the focus chart.
         *
         * See the [Nasdaq 100 Index](http://dc-js.github.com/dc.js/) example for this effect in action.
         * @param {CoordinateGridMixin} [rangeChart]
         * @returns {CoordinateGridMixin}
         */
        public rangeChart(): typeof CoordinateGridMixin;
        public rangeChart(rangeChart: typeof CoordinateGridMixin): this;
        public rangeChart(rangeChart?) {
            if (!arguments.length) {
                return this._rangeChart;
            }
            this._rangeChart = rangeChart;
            this.configure({autoFocus: true});
            // @ts-ignore
            this._rangeChart.focusChart(this);
            return this;
        }

        public focusChart(): typeof CoordinateGridMixin;
        public focusChart(c: typeof CoordinateGridMixin): this;
        public focusChart(c?) {
            if (!arguments.length) {
                return this._focusChart;
            }
            this._focusChart = c;
            return this;
        }
    };
}

// @ts-ignore
export const CoordinateGridMixin = CoordinateGridMixinExt(
    ColorMixinExt(MarginMixinExt(BaseMixinExt(CoordinateGridMixinNeo)))
);
