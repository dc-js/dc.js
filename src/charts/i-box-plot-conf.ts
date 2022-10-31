import { ICoordinateGridMixinConf } from '../base/i-coordinate-grid-mixin-conf.js';
import { NumberFormatFn } from '../core/types.js';

export interface IBoxPlotConf extends ICoordinateGridMixinConf {
    readonly yRangePadding?: number;
    readonly boldOutlier?: boolean;
    readonly showOutliers?: boolean;
    readonly dataWidthPortion?: number;
    readonly dataOpacity?: number;
    readonly renderDataPoints?: boolean;
    readonly tickFormat?: NumberFormatFn;
}
