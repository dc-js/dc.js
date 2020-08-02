import {GeoChoroplethChart as GeoChoroplethChartNeo} from '../../charts/geo-choropleth-chart';
import {BaseMixinExt} from '../base/base-mixin';
import {ColorMixinExt} from '../base/color-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';

export class GeoChoroplethChart extends ColorMixinExt(BaseMixinExt(GeoChoroplethChartNeo)) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const geoChoroplethChart = (parent: ChartParentType, chartGroup: ChartGroupType) => new GeoChoroplethChart(parent, chartGroup);
