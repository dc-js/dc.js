import {IColorMixinConf} from '../base/i-color-mixin-conf';
import {IGeoJson} from '../core/types';

export interface IGeoChoroplethChartConf extends IColorMixinConf {
    readonly geoJsons?: IGeoJson[];
}
