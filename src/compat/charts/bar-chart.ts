import {BarChart as BarChartNeo} from '../../charts/bar-chart';
import {BaseMixinExt} from '../base/base-mixin';
import {ColorMixinExt} from '../base/color-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';
import {MarginMixinExt} from '../base/margin-mixin';
import {CoordinateGridMixinExt} from '../base/coordinate-grid-mixin';
import {StackMixinExt} from '../base/stack-mixin';

export class BarChart extends StackMixinExt(CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt((BarChartNeo)))))) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const barChart = (parent: ChartParentType, chartGroup: ChartGroupType) => new BarChart(parent, chartGroup);
