import {IBaseMixinConf} from './i-base-mixin-conf';

export interface ICapMixinConf extends IBaseMixinConf {
    readonly othersGrouper?: (topItems, restItems) => (any);
    readonly othersLabel?: string;
    readonly takeFront?: boolean;
    readonly cap?: number
}
