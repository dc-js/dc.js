import {IMarginMixinConf} from './i-margin-mixin-conf';
import {IColorMixinConf} from './i-color-mixin-conf';
import {Units} from '../core/types';
import {CountableTimeInterval} from 'd3-time';

export interface ICoordinateGridMixinConf extends IMarginMixinConf, IColorMixinConf {
    xAxisPaddingUnit?: string | CountableTimeInterval;
    xAxisPadding?: number;
    xUnits?: Units;
}
