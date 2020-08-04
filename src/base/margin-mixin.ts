import {BaseMixin} from './base-mixin';
import {Margins} from '../core/types';
import {IMarginMixinConf} from './i-margin-mixin-conf';

/**
 * Margin is a mixin that provides margin utility functions for both the Row Chart and Coordinate Grid
 * Charts.
 * @mixin MarginMixin
 * @param {Object} Base
 * @returns {MarginMixin}
 */
export class MarginMixin extends BaseMixin {
    public _conf: IMarginMixinConf;

    private _margins: Margins;

    constructor () {
        super();

        this._margins = {top: 10, right: 50, bottom: 30, left: 30};
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
    public margins (): Margins;
    public margins (margins: Margins): this;
    public margins (margins?) {
        if (!arguments.length) {
            return this._margins;
        }
        this._margins = margins;
        return this;
    }

    /**
     * Effective width of the chart excluding margins (in pixels).
     *
     * @returns {number}
     */
    public effectiveWidth (): number {
        return this.width() - this.margins().left - this.margins().right;
    }

    /**
     * Effective height of the chart excluding margins (in pixels).
     *
     * @returns {number}
     */
    public effectiveHeight (): number {
        return this.height() - this.margins().top - this.margins().bottom;
    }
}
