import {ICoordinateGridMixinConf} from '../base/i-coordinate-grid-mixin-conf';

export interface ICompositeChartConf extends ICoordinateGridMixinConf {
    readonly shareTitle?: boolean;
    readonly shareColors?: boolean;
}
