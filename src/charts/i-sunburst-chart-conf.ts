import { IColorMixinConf } from '../base/i-color-mixin-conf.js';
import { BaseAccessor } from '../core/types.js';

export interface RingSizeSpecs {
    partitionDy: () => number;
    scaleOuterRadius: BaseAccessor<number>;
    scaleInnerRadius: BaseAccessor<number>;
    relativeRingSizesFunction: (ringCount: number) => number[];
}

export interface ISunburstChartConf extends IColorMixinConf {
    readonly emptyTitle?: string;
    readonly externalLabels?: number;
    readonly minAngleForLabel?: number;
    readonly ringSizes?: RingSizeSpecs;
    readonly innerRadius?: number;
    readonly radius?: number;
}
