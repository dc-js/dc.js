import {ICapMixinConf} from '../base/i-cap-mixin-conf';
import {IColorMixinConf} from '../base/i-color-mixin-conf';

export interface IPieChartConf extends ICapMixinConf, IColorMixinConf {
    emptyTitle?: string;
}
