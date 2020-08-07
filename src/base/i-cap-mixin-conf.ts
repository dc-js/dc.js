import {IBaseMixinConf} from './i-base-mixin-conf';

export interface ICapMixinConf extends IBaseMixinConf {
    othersGrouper?: (topItems, restItems) => (any);
    othersLabel?: string;
    takeFront?: boolean;
    cap?: number
}
