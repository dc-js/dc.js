/**
 * Margin is a mixin that provides margin utility functions for both the Row Chart and Coordinate Grid
 * Charts.
 * @name marginMixin
 * @memberof dc
 * @mixin
 * @param {Object} Base
 * @returns {dc.marginMixin}
 */
export const MarginMixin = Base => {
    return class extends Base {
        constructor () {
            super();

            this._margin = {top: 10, right: 50, bottom: 30, left: 30};
        }

        /**
         * Get or set the margins for a particular coordinate grid chart instance. The margins is stored as
         * an associative Javascript array.
         * @method margins
         * @memberof dc.marginMixin
         * @instance
         * @example
         * var leftMargin = chart.margins().left; // 30 by default
         * chart.margins().left = 50;
         * leftMargin = chart.margins().left; // now 50
         * @param {{top: Number, right: Number, left: Number, bottom: Number}} [margins={top: 10, right: 50, bottom: 30, left: 30}]
         * @returns {{top: Number, right: Number, left: Number, bottom: Number}|dc.marginMixin}
         */
        margins (margins) {
            if (!arguments.length) {
                return this._margin;
            }
            this._margin = margins;
            return this;
        }

        effectiveWidth () {
            return this.width() - this.margins().left - this.margins().right;
        }

        effectiveHeight () {
            return this.height() - this.margins().top - this.margins().bottom;
        }
    }
};
