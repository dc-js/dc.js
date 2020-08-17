import { IStackMixinConf } from '../base/i-stack-mixin-conf';

export interface IBarChartConf extends IStackMixinConf {
    readonly alwaysUseRounding?: boolean;
    readonly centerBar?: boolean;
}
