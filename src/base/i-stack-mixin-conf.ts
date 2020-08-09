import {ICoordinateGridMixinConf} from './i-coordinate-grid-mixin-conf';

export interface IStackMixinConf extends ICoordinateGridMixinConf {
    readonly evadeDomainFilter?: boolean;
    readonly hidableStacks?: boolean;
}
