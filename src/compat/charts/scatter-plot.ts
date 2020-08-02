import {ScatterPlot as ScatterPlotNeo} from '../../charts/scatter-plot';
import {BaseMixinExt} from '../base/base-mixin';
import {ColorMixinExt} from '../base/color-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';
import {MarginMixinExt} from '../base/margin-mixin';
import {CoordinateGridMixinExt} from '../base/coordinate-grid-mixin';

export class ScatterPlot extends CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt((ScatterPlotNeo))))) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const scatterPlot = (parent, chartGroup) => new ScatterPlot(parent, chartGroup);
