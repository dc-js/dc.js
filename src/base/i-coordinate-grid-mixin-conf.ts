import {IMarginMixinConf} from './i-margin-mixin-conf';
import {IColorMixinConf} from './i-color-mixin-conf';
import {Units} from '../core/types';

export interface ICoordinateGridMixinConf extends IMarginMixinConf, IColorMixinConf {
    xAxisPadding?: number;
    xUnits?: Units;
}
