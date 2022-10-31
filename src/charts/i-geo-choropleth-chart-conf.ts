import { IColorMixinConf } from '../base/i-color-mixin-conf.js';
import { IGeoJson } from '../core/types.js';

export interface IGeoChoroplethChartConf extends IColorMixinConf {
    readonly geoJsons?: IGeoJson[];
}
