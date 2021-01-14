import { ColorScaleHelper } from './color-scale-helper';
import { scaleLinear } from 'd3-scale';
import { interpolateHcl } from 'd3-interpolate';

export class LinearColors extends ColorScaleHelper {
    constructor(range: [string, string]) {
        const scale = scaleLinear<any, string>().range(range).interpolate(interpolateHcl);
        super(scale);
    }
}
