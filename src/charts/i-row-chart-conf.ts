import { IColorMixinConf } from '../base/i-color-mixin-conf';
import { IMarginMixinConf } from '../base/i-margin-mixin-conf';

export interface IRowChartConf extends IColorMixinConf, IMarginMixinConf {
    readonly elasticX?: boolean;
    readonly renderTitleLabel?: boolean;
    readonly fixedBarHeight?: number;
    readonly gap?: number;
    readonly titleLabelOffsetX?: number;
    readonly labelOffsetY?: number;
    readonly labelOffsetX?: number;
}
