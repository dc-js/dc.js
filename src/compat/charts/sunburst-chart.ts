import {SunburstChart as SunburstChartNeo} from '../../charts/sunburst-chart';
import {BaseMixinExt} from '../base/base-mixin';
import {ColorMixinExt} from '../base/color-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';

export class SunburstChart extends ColorMixinExt(BaseMixinExt(SunburstChartNeo)) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const sunburstChart = (parent: ChartParentType, chartGroup: ChartGroupType) => new SunburstChart(parent, chartGroup);
