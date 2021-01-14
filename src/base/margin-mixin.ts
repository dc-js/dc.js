import { BaseMixin } from './base-mixin';
import { ChartGroupType, ChartParentType, Margins } from '../core/types';
import { IMarginMixinConf } from './i-margin-mixin-conf';

/**
 * Margin is a mixin that provides margin utility functions for both the Row Chart and Coordinate Grid
 * Charts.
 */
export class MarginMixin extends BaseMixin {
    /**
     * @hidden
     */
    protected _conf: IMarginMixinConf;

    private _margins: Margins;

    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);

        this._margins = { top: 10, right: 50, bottom: 30, left: 30 };
    }

    public configure(conf: IMarginMixinConf): this {
        super.configure(conf);
        return this;
    }

    public conf(): IMarginMixinConf {
        return this._conf;
    }

    /**
     * Get or set the margins for a particular coordinate grid chart instance. The margins is stored as
     * an associative Javascript array.
     * @example
     * ```
     * let leftMargin = chart.margins().left; // 30 by default
     * chart.margins().left = 50;
     * leftMargin = chart.margins().left; // now 50
     * ```
     */
    public margins(): Margins;
    public margins(margins: Margins): this;
    public margins(margins?) {
        if (!arguments.length) {
            return this._margins;
        }
        this._margins = margins;
        return this;
    }

    /**
     * Effective width of the chart excluding margins (in pixels).
     *
     * @category Intermediate
     */
    public effectiveWidth(): number {
        return this.width() - this.margins().left - this.margins().right;
    }

    /**
     * Effective height of the chart excluding margins (in pixels).
     *
     * @category Intermediate
     */
    public effectiveHeight(): number {
        return this.height() - this.margins().top - this.margins().bottom;
    }
}
