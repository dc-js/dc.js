import * as d3 from 'd3';

import {config} from '../core/config';
import {utils} from '../core/utils';

/**
 * The Color Mixin is an abstract chart functional class providing universal coloring support
 * as a mix-in for any concrete chart implementation.
 * @name colorMixin
 * @memberof dc
 * @mixin
 * @param {Object} _chart
 * @returns {dc.colorMixin}
 */
export const ColorMixin = Base => {
    return class extends Base {
        constructor () {
            super();

            this._colors = d3.scaleOrdinal(config.defaultColors());

            this._colorAccessor = (d) => {
                return this.keyAccessor()(d);
            };
            this._colorCalculator = undefined;

            {
                const self = this;
                // ES6: this method is called very differently from stack-mixin and derived charts
                // Removing and placing it as a member method is tricky

                /**
                 * Get the color for the datum d and counter i. This is used internally by charts to retrieve a color.
                 * @method getColor
                 * @memberof dc.colorMixin
                 * @instance
                 * @param {*} d
                 * @param {Number} [i]
                 * @returns {String}
                 */
                self.getColor = function (d, i) {
                    return self._colorCalculator ?
                        self._colorCalculator.call(this, d, i) :
                        self._colors(self._colorAccessor.call(this, d, i));
                };
            }
        }

        /**
         * Set the domain by determining the min and max values as retrieved by
         * {@link dc.colorMixin#colorAccessor .colorAccessor} over the chart's dataset.
         * @method calculateColorDomain
         * @memberof dc.colorMixin
         * @instance
         * @returns {dc.colorMixin}
         */
        calculateColorDomain () {
            const newDomain = [d3.min(this.data(), this.colorAccessor()),
                               d3.max(this.data(), this.colorAccessor())];
            this._colors.domain(newDomain);
            return this;
        }

        /**
         * Retrieve current color scale or set a new color scale. This methods accepts any function that
         * operates like a d3 scale.
         * @method colors
         * @memberof dc.colorMixin
         * @instance
         * @see {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale}
         * @example
         * // alternate categorical scale
         * chart.colors(d3.scale.category20b());
         * // ordinal scale
         * chart.colors(d3.scaleOrdinal().range(['red','green','blue']));
         * // convenience method, the same as above
         * chart.ordinalColors(['red','green','blue']);
         * // set a linear scale
         * chart.linearColors(["#4575b4", "#ffffbf", "#a50026"]);
         * @param {d3.scale} [colorScale=d3.scaleOrdinal(d3.schemeCategory20c)]
         * @returns {d3.scale|dc.colorMixin}
         */
        colors (colorScale) {
            if (!arguments.length) {
                return this._colors;
            }
            if (colorScale instanceof Array) {
                this._colors = d3.scaleQuantize().range(colorScale); // deprecated legacy support, note: this fails for ordinal domains
            } else {
                this._colors = typeof colorScale === 'function' ? colorScale : utils.constant(colorScale);
            }
            return this;
        }

        /**
         * Convenience method to set the color scale to
         * {@link https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales d3.scaleOrdinal} with
         * range `r`.
         * @method ordinalColors
         * @memberof dc.colorMixin
         * @instance
         * @param {Array<String>} r
         * @returns {dc.colorMixin}
         */
        ordinalColors (r) {
            return this.colors(d3.scaleOrdinal().range(r));
        }

        /**
         * Convenience method to set the color scale to an Hcl interpolated linear scale with range `r`.
         * @method linearColors
         * @memberof dc.colorMixin
         * @instance
         * @param {Array<Number>} r
         * @returns {dc.colorMixin}
         */
        linearColors (r) {
            return this.colors(d3.scaleLinear()
                .range(r)
                .interpolate(d3.interpolateHcl));
        }

        /**
         * Set or the get color accessor function. This function will be used to map a data point in a
         * crossfilter group to a color value on the color scale. The default function uses the key
         * accessor.
         * @method colorAccessor
         * @memberof dc.colorMixin
         * @instance
         * @example
         * // default index based color accessor
         * .colorAccessor(function (d, i){return i;})
         * // color accessor for a multi-value crossfilter reduction
         * .colorAccessor(function (d){return d.value.absGain;})
         * @param {Function} [colorAccessor]
         * @returns {Function|dc.colorMixin}
         */
        colorAccessor (colorAccessor) {
            if (!arguments.length) {
                return this._colorAccessor;
            }
            this._colorAccessor = colorAccessor;
            return this;
        }

        /**
         * Set or get the current domain for the color mapping function. The domain must be supplied as an
         * array.
         *
         * Note: previously this method accepted a callback function. Instead you may use a custom scale
         * set by {@link dc.colorMixin#colors .colors}.
         * @method colorDomain
         * @memberof dc.colorMixin
         * @instance
         * @param {Array<String>} [domain]
         * @returns {Array<String>|dc.colorMixin}
         */
        colorDomain (domain) {
            if (!arguments.length) {
                return this._colors.domain();
            }
            this._colors.domain(domain);
            return this;
        }

        /**
         * Overrides the color selection algorithm, replacing it with a simple function.
         *
         * Normally colors will be determined by calling the `colorAccessor` to get a value, and then passing that
         * value through the `colorScale`.
         *
         * But sometimes it is difficult to get a color scale to produce the desired effect. The `colorCalculator`
         * takes the datum and index and returns a color directly.
         * @method colorCalculator
         * @memberof dc.colorMixin
         * @instance
         * @param {*} [colorCalculator]
         * @returns {Function|dc.colorMixin}
         */
        colorCalculator (colorCalculator) {
            if (!arguments.length) {
                return this._colorCalculator || this.getColor;
            }
            this._colorCalculator = colorCalculator;
            return this;
        }
    }
};
