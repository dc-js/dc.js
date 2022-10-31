import { ICoordinateGridMixinConf } from './i-coordinate-grid-mixin-conf.js';
import { TitleAccessor } from '../core/types.js';

export interface IStackMixinConf extends ICoordinateGridMixinConf {
    readonly evadeDomainFilter?: boolean;
    readonly hidableStacks?: boolean;
    readonly titles?: { [key: string]: TitleAccessor };
}
