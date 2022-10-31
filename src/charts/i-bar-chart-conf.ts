import { IStackMixinConf } from '../base/i-stack-mixin-conf.js';

export interface IBarChartConf extends IStackMixinConf {
    readonly alwaysUseRounding?: boolean;
    readonly centerBar?: boolean;
}
