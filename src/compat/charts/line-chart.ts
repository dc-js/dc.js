import { LineChart as LineChartNeo } from '../../charts/line-chart';
import { BaseMixinExt } from '../base/base-mixin';
import { ColorMixinExt } from '../base/color-mixin';
import { ChartGroupType, ChartParentType } from '../../core/types';
import { MarginMixinExt } from '../base/margin-mixin';
import { CoordinateGridMixinExt } from '../base/coordinate-grid-mixin';
import { StackMixinExt } from '../base/stack-mixin';

export class LineChart extends StackMixinExt(
    CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(LineChartNeo))))
) {
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const lineChart = (parent: ChartParentType, chartGroup: ChartGroupType) =>
    new LineChart(parent, chartGroup);
