import {IMarginMixinConf} from './i-margin-mixin-conf';
import {IColorMixinConf} from './i-color-mixin-conf';
import {RoundFn, Units} from '../core/types';
import {CountableTimeInterval} from 'd3-time';

export interface ICoordinateGridMixinConf extends IMarginMixinConf, IColorMixinConf {
    readonly zoomOutRestrict?: boolean;
    readonly zoomScale?: [number, number];
    readonly renderHorizontalGridLine?: boolean;
    readonly renderVerticalGridLines?: boolean;
    readonly round?: RoundFn;
    readonly yElasticity?: boolean;
    readonly yAxisPadding?: number;
    readonly xElasticity?: boolean;
    readonly xAxisPaddingUnit?: string | CountableTimeInterval;
    readonly xAxisPadding?: number;
    readonly xUnits?: Units;
}
