import { IBaseMixinConf } from './i-base-mixin-conf.js';
import { ColorAccessor } from '../core/types.js';

export interface IColorMixinConf extends IBaseMixinConf {
    readonly colorAccessor?: ColorAccessor;
}
