import { ICoordinateGridMixinConf } from '../base/i-coordinate-grid-mixin-conf.js';

export interface ICompositeChartConf extends ICoordinateGridMixinConf {
    readonly shareTitle?: boolean;
    readonly shareColors?: boolean;
}
