import {Constructor} from '../../core/types';
import {CompositeChart as CompositeChartNeo} from '../../charts/composite-chart';
import {BaseMixinExt} from '../base/base-mixin';
import {MarginMixinExt} from '../base/margin-mixin';
import {ColorMixinExt} from '../base/color-mixin';
import {CoordinateGridMixinExt} from '../base/coordinate-grid-mixin';

class Intermediate extends CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(CompositeChartNeo)))) { }

export function CompositeChartExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }
    }
}

export const CompositeChart = CompositeChartExt(CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(CompositeChartNeo)))));

export const compositeChart = (parent, chartGroup) => new CompositeChart(parent, chartGroup);
