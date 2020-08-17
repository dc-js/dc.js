import { IBaseMixinConf } from '../base/i-base-mixin-conf';
import { DataCountHTMLOptions, NumberFormatFn } from '../core/types';

export interface IDataCountConf extends IBaseMixinConf {
    readonly html?: DataCountHTMLOptions;
    readonly formatNumber?: NumberFormatFn;
}
