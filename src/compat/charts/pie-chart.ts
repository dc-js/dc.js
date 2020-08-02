import {PieChart as PieChartNeo} from '../../charts/pie-chart';
import {BaseMixinExt} from '../base/base-mixin';
import {ColorMixinExt} from '../base/color-mixin';
import {CapMixinExt} from '../base/cap-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';

export class PieChart extends CapMixinExt(ColorMixinExt(BaseMixinExt(PieChartNeo))) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const pieChart = (parent: ChartParentType, chartGroup: ChartGroupType) => new PieChart(parent, chartGroup);
