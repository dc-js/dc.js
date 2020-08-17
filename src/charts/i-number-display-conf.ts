import { IBaseMixinConf } from '../base/i-base-mixin-conf';
import { NumberFormatFn } from '../core/types';

export interface INumberDisplayConf extends IBaseMixinConf {
    readonly formatNumber?: NumberFormatFn;
}
