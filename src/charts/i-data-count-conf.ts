import { IBaseMixinConf } from '../base/i-base-mixin-conf.js';
import { DataCountHTMLOptions, NumberFormatFn } from '../core/types.js';

export interface IDataCountConf extends IBaseMixinConf {
    readonly html?: DataCountHTMLOptions;
    readonly formatNumber?: NumberFormatFn;
}
