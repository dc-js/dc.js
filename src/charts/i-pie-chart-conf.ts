import { IColorMixinConf } from '../base/i-color-mixin-conf';

export interface IPieChartConf extends IColorMixinConf {
    readonly drawPaths?: boolean;
    readonly externalLabelRadius?: number;
    readonly minAngleForLabel?: number;
    readonly externalRadiusPadding?: number;
    readonly innerRadius?: number;
    readonly radius?: number;
    readonly emptyTitle?: string;
}
