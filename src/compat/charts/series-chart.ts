import {SeriesChart as SeriesChartNeo} from '../../charts/series-chart';
import {BaseMixinExt} from '../base/base-mixin';
import {ColorMixinExt} from '../base/color-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';
import {MarginMixinExt} from '../base/margin-mixin';
import {CoordinateGridMixinExt} from '../base/coordinate-grid-mixin';
import {CompositeChartExt} from './composite-chart';

export class SeriesChart extends CompositeChartExt(CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(SeriesChartNeo))))) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const seriesChart = (parent, chartGroup) => new SeriesChart(parent, chartGroup);
