import {HeatMap as HeatMapNeo} from '../../charts/heat-map';
import {BaseMixinExt} from '../base/base-mixin';
import {ColorMixinExt} from '../base/color-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';
import {MarginMixinExt} from '../base/margin-mixin';

export class HeatMap extends ColorMixinExt(MarginMixinExt(BaseMixinExt(HeatMapNeo))) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const heatMap = (parent: ChartParentType, chartGroup: ChartGroupType) => new HeatMap(parent, chartGroup);
