import { IBaseMixinConf } from '../base/i-base-mixin-conf.js';
import { NumberFormatFn } from '../core/types.js';

export interface INumberDisplayConf extends IBaseMixinConf {
    readonly formatNumber?: NumberFormatFn;
}
