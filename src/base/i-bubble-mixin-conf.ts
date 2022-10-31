import { IColorMixinConf } from './i-color-mixin-conf.js';
import { RValueAccessor } from '../core/types.js';

export interface IBubbleMixinConf extends IColorMixinConf {
    readonly radiusValueAccessor?: RValueAccessor;
    readonly excludeElasticZero?: boolean;
    readonly elasticRadius?: boolean;
    readonly sortBubbleSize?: boolean;
    readonly minRadiusWithLabel?: number;
    readonly maxBubbleRelativeSize?: number;
}
