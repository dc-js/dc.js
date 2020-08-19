import { ColorScaleHelper } from './color-scale-helper';
import { BaseAccessor } from '../../core/types';
import { scaleLinear } from 'd3-scale';
import { interpolateHcl } from 'd3-interpolate';

export class LinearColors extends ColorScaleHelper {
    constructor({
        range,
        colorAccessor,
    }: {
        range: [string, string];
        colorAccessor?: BaseAccessor<string>;
    }) {
        const scale = scaleLinear<any, string>().range(range).interpolate(interpolateHcl);
        super({ scale, colorAccessor });
    }
}
