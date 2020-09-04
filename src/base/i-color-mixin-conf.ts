import { IBaseMixinConf } from './i-base-mixin-conf';
import { BaseAccessor, ColorAccessor } from '../core/types';

export interface IColorMixinConf extends IBaseMixinConf {
    readonly colorAccessor?: ColorAccessor;
}
