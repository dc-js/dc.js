import { IMarginMixinConf } from './i-margin-mixin-conf';
import { IColorMixinConf } from './i-color-mixin-conf';
import { RoundFn, Units } from '../core/types';
import { CountableTimeInterval } from 'd3-time';

export interface ICoordinateGridMixinConf extends IMarginMixinConf, IColorMixinConf {
    readonly useRightYAxis?: boolean;
    readonly clipPadding?: number;
    readonly mouseZoomable?: boolean;
    readonly autoFocus?: boolean;
    readonly zoomOutRestrict?: boolean;
    readonly zoomScale?: [number, number];
    readonly renderHorizontalGridLine?: boolean;
    readonly renderVerticalGridLines?: boolean;
    readonly round?: RoundFn;
    readonly elasticY?: boolean;
    readonly yAxisPadding?: number;
    readonly elasticX?: boolean;
    readonly xAxisPaddingUnit?: string | CountableTimeInterval;
    readonly xAxisPadding?: number;
    readonly xUnits?: Units;
}
