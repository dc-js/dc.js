import { LineChart as LineChartNeo } from '../../charts/line-chart.js';
import { BaseMixinExt } from '../base/base-mixin.js';
import { ColorMixinExt } from '../base/color-mixin.js';
import { ChartGroupType, ChartParentType } from '../../core/types.js';
import { MarginMixinExt } from '../base/margin-mixin.js';
import { CoordinateGridMixinExt } from '../base/coordinate-grid-mixin.js';
import { StackMixinExt } from '../base/stack-mixin.js';

export class LineChart extends StackMixinExt(
    CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(LineChartNeo))))
) {
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const lineChart = (parent: ChartParentType, chartGroup: ChartGroupType) =>
    new LineChart(parent, chartGroup);
