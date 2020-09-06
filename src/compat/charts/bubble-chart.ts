import { BubbleChart as BubbleChartNeo } from '../../charts/bubble-chart';
import { BaseMixinExt } from '../base/base-mixin';
import { ColorMixinExt } from '../base/color-mixin';
import { ChartGroupType, ChartParentType } from '../../core/types';
import { MarginMixinExt } from '../base/margin-mixin';
import { CoordinateGridMixinExt } from '../base/coordinate-grid-mixin';
import { BubbleMixinExt } from '../base/bubble-mixin';

export class BubbleChart extends BubbleMixinExt(
    // @ts-ignore
    CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(BubbleChartNeo))))
) {
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const bubbleChart = (parent, chartGroup) => new BubbleChart(parent, chartGroup);
