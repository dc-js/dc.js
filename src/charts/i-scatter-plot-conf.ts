import { ICoordinateGridMixinConf } from '../base/i-coordinate-grid-mixin-conf.js';
import { BaseAccessor } from '../core/types.js';

export interface IScatterPlotConf extends ICoordinateGridMixinConf {
    readonly useCanvas?: boolean;
    readonly emptyColor?: string;
    readonly nonemptyOpacity?: number;
    readonly emptyOpacity?: number;
    readonly emptySize?: number;
    readonly excludedOpacity?: number;
    readonly excludedColor?: string;
    readonly excludedSize?: number;
    readonly symbolSize?: number;
    readonly highlightedSize?: number;
    readonly existenceAccessor?: BaseAccessor<any>;
}
