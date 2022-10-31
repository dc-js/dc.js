import { BarChart as BarChartNeo } from '../../charts/bar-chart.js';
import { BaseMixinExt } from '../base/base-mixin.js';
import { ColorMixinExt } from '../base/color-mixin.js';
import { ChartGroupType, ChartParentType } from '../../core/types.js';
import { MarginMixinExt } from '../base/margin-mixin.js';
import { CoordinateGridMixinExt } from '../base/coordinate-grid-mixin.js';
import { StackMixinExt } from '../base/stack-mixin.js';

export class BarChart extends StackMixinExt(
    CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(BarChartNeo))))
) {
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }

    /**
     * Whether the bar chart will render each bar centered around the data position on the x-axis.
     * @param [centerBar=false]
     */
    public centerBar(): boolean;
    public centerBar(centerBar: boolean): this;
    public centerBar(centerBar?) {
        if (!arguments.length) {
            return this._conf.centerBar;
        }
        this.configure({ centerBar: centerBar });
        return this;
    }

    /**
     * Set or get whether rounding is enabled when bars are centered. If false, using
     * rounding with centered bars will result in a warning and rounding will be ignored.  This flag
     * has no effect if bars are not {@link BarChart.centerBar centered}.
     * When using standard d3.js rounding methods, the brush often doesn't align correctly with
     * centered bars since the bars are offset.  The rounding function must add an offset to
     * compensate, such as in the following example.
     * @example
     * chart.round(function(n) { return Math.floor(n) + 0.5; });
     * @param [alwaysUseRounding=false]
     */
    public alwaysUseRounding(): boolean;
    public alwaysUseRounding(alwaysUseRounding: boolean): this;
    public alwaysUseRounding(alwaysUseRounding?) {
        if (!arguments.length) {
            return this._conf.alwaysUseRounding;
        }
        this.configure({ alwaysUseRounding: alwaysUseRounding });
        return this;
    }
}

export const barChart = (parent: ChartParentType, chartGroup: ChartGroupType) =>
    new BarChart(parent, chartGroup);
