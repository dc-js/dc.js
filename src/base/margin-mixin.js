import {BaseMixin} from './base-mixin';

/**
 * Margin is a mixin that provides margin utility functions for both the Row Chart and Coordinate Grid
 * Charts.
 * @mixin MarginMixin
 * @param {Object} Base
 * @returns {MarginMixin}
 */
export class MarginMixin extends BaseMixin {
    constructor () {
        super();

        this._margin = {top: 10, right: 50, bottom: 30, left: 30};
    }

    /**
     * Get or set the margins for a particular coordinate grid chart instance. The margins is stored as
     * an associative Javascript array.
     * @memberof MarginMixin
     * @instance
     * @example
     * var leftMargin = chart.margins().left; // 30 by default
     * chart.margins().left = 50;
     * leftMargin = chart.margins().left; // now 50
     * @param {{top: Number, right: Number, left: Number, bottom: Number}} [margins={top: 10, right: 50, bottom: 30, left: 30}]
     * @returns {{top: Number, right: Number, left: Number, bottom: Number}|MarginMixin}
     */
    margins (margins) {
        if (!arguments.length) {
            return this._margin;
        }
        this._margin = margins;
        return this;
    }

    /**
     * Effective width of the chart excluding margins (in pixels).
     *
     * @returns {number}
     */
    effectiveWidth () {
        return this.width() - this.margins().left - this.margins().right;
    }

    /**
     * Effective height of the chart excluding margins (in pixels).
     *
     * @returns {number}
     */
    effectiveHeight () {
        return this.height() - this.margins().top - this.margins().bottom;
    }
}
