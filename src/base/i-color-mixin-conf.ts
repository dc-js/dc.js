import {IBaseMixinConf} from './i-base-mixin-conf';
import {BaseAccessor} from '../core/types';

export interface IColorMixinConf extends IBaseMixinConf {
    colorCalculator?: BaseAccessor<string>;
}
