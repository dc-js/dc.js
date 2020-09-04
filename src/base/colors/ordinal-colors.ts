import { ColorScaleHelper } from './color-scale-helper';
import { BaseAccessor } from '../../core/types';
import { scaleOrdinal } from 'd3-scale';

export class OrdinalColors extends ColorScaleHelper {
    constructor({
        colors,
        colorAccessor,
    }: {
        colors: readonly string[];
        colorAccessor?: BaseAccessor<string>;
    }) {
        const scale = scaleOrdinal<any, string>().range(colors);
        super({ scale, colorAccessor });
    }
}
