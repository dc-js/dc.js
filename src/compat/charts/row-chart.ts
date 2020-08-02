import {RowChart as RowChartNeo} from '../../charts/row-chart';
import {BaseMixinExt} from '../base/base-mixin';
import {ColorMixinExt} from '../base/color-mixin';
import {CapMixinExt} from '../base/cap-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';
import {MarginMixinExt} from '../base/margin-mixin';

export class RowChart extends CapMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(RowChartNeo)))) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const rowChart = (parent: ChartParentType, chartGroup: ChartGroupType) => new RowChart(parent, chartGroup);
