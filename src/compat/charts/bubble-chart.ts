import { BubbleChart as BubbleChartNeo } from '../../charts/bubble-chart.js';
import { BaseMixinExt } from '../base/base-mixin.js';
import { ColorMixinExt } from '../base/color-mixin.js';
import { ChartGroupType, ChartParentType } from '../../core/types.js';
import { MarginMixinExt } from '../base/margin-mixin.js';
import { CoordinateGridMixinExt } from '../base/coordinate-grid-mixin.js';
import { BubbleMixinExt } from '../base/bubble-mixin.js';

export class BubbleChart extends BubbleMixinExt(
    // @ts-ignore
    CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(BubbleChartNeo))))
) {
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const bubbleChart = (parent, chartGroup) => new BubbleChart(parent, chartGroup);
