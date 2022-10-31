import { IColorMixinConf } from '../base/i-color-mixin-conf.js';

export interface IPieChartConf extends IColorMixinConf {
    readonly drawPaths?: boolean;
    readonly externalLabels?: number;
    readonly minAngleForLabel?: number;
    readonly externalRadiusPadding?: number;
    readonly innerRadius?: number;
    readonly radius?: number;
    readonly emptyTitle?: string;
}
