import { ICoordinateGridMixinConf } from './i-coordinate-grid-mixin-conf';
import { TitleAccessor } from '../core/types';

export interface IStackMixinConf extends ICoordinateGridMixinConf {
    readonly evadeDomainFilter?: boolean;
    readonly hidableStacks?: boolean;
    readonly titles?: { [key: string]: TitleAccessor };
}
