import {RowChart as RowChartNeo} from '../../charts/row-chart';
import {BaseMixinExt} from '../base/base-mixin';
import {ColorMixinExt} from '../base/color-mixin';
import {CapMixinExt} from '../base/cap-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';
import {MarginMixinExt} from '../base/margin-mixin';

export class RowChart extends CapMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(RowChartNeo)))) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);

        this.rowsCap = this.cap;
    }

    /**
     * Turn on/off Title label rendering (values) using SVG style of text-anchor 'end'.
     * @param {Boolean} [renderTitleLabel=false]
     * @returns {Boolean|RowChart}
     */
    public renderTitleLabel (): boolean;
    public renderTitleLabel (renderTitleLabel: boolean): this;
    public renderTitleLabel (renderTitleLabel?) {
        if (!arguments.length) {
            return this._conf.renderTitleLabel;
        }
        this.configure({renderTitleLabel: renderTitleLabel});
        return this;
    }

    /**
     * Get or set the fixed bar height. Default is [false] which will auto-scale bars.
     * For example, if you want to fix the height for a specific number of bars (useful in TopN charts)
     * you could fix height as follows (where count = total number of bars in your TopN and gap is
     * your vertical gap space).
     * @example
     * chart.fixedBarHeight( chartheight - (count + 1) * gap / count);
     * @param {Boolean|Number} [fixedBarHeight=false]
     * @returns {Boolean|Number|RowChart}
     */
    public fixedBarHeight (): number;
    public fixedBarHeight (fixedBarHeight: number): this;
    public fixedBarHeight (fixedBarHeight?) {
        if (!arguments.length) {
            return this._conf.fixedBarHeight;
        }
        this.configure({fixedBarHeight: fixedBarHeight});
        return this;
    }

    /**
     * Get or set the vertical gap space between rows on a particular row chart instance.
     * @param {Number} [gap=5]
     * @returns {Number|RowChart}
     */
    public gap (): number;
    public gap (gap: number): this;
    public gap (gap?) {
        if (!arguments.length) {
            return this._conf.gap;
        }
        this.configure({gap: gap});
        return this;
    }

    /**
     * Get or set the elasticity on x axis. If this attribute is set to true, then the x axis will rescale to auto-fit the
     * data range when filtered.
     * @param {Boolean} [elasticX]
     * @returns {Boolean|RowChart}
     */
    public elasticX (): boolean;
    public elasticX (elasticX: boolean): this;
    public elasticX (elasticX?) {
        if (!arguments.length) {
            return this._conf.elasticX;
        }
        this.configure({elasticX: elasticX});
        return this;
    }

    /**
     * Get or set the x offset (horizontal space to the top left corner of a row) for labels on a particular row chart.
     * @param {Number} [labelOffsetX=10]
     * @returns {Number|RowChart}
     */
    public labelOffsetX (): number;
    public labelOffsetX (labelOffsetX: number): this;
    public labelOffsetX (labelOffsetX?) {
        if (!arguments.length) {
            return this._conf.labelOffsetX;
        }
        this.configure({labelOffsetX: labelOffsetX});
        return this;
    }

    /**
     * Get or set the y offset (vertical space to the top left corner of a row) for labels on a particular row chart.
     * @param {Number} [labelOffsety]
     * @returns {Number|RowChart}
     */
    public labelOffsetY (): number;
    public labelOffsetY (labelOffsety: number): this;
    public labelOffsetY (labelOffsety?) {
        if (!arguments.length) {
            return this._conf.labelOffsetY;
        }
        this.configure({labelOffsetY: labelOffsety});
        return this;
    }

    /**
     * Get of set the x offset (horizontal space between right edge of row and right edge or text.
     * @param {Number} [titleLabelOffsetX=2]
     * @returns {Number|RowChart}
     */
    public titleLabelOffsetX (): number;
    public titleLabelOffsetX (titleLabelOffsetX: number): this;
    public titleLabelOffsetX (titleLabelOffsetX?) {
        if (!arguments.length) {
            return this._conf.titleLabelOffsetX;
        }
        this.configure({titleLabelOffsetX: titleLabelOffsetX});
        return this;
    }
}

export const rowChart = (parent: ChartParentType, chartGroup: ChartGroupType) => new RowChart(parent, chartGroup);
