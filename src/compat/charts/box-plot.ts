import {BoxPlot as BoxPlotNeo} from '../../charts/box-plot';
import {BaseMixinExt} from '../base/base-mixin';
import {ColorMixinExt} from '../base/color-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';
import {MarginMixinExt} from '../base/margin-mixin';
import {CoordinateGridMixinExt} from '../base/coordinate-grid-mixin';

export class BoxPlot extends CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt((BoxPlotNeo))))) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const boxPlot = (parent, chartGroup) => new BoxPlot(parent, chartGroup);
