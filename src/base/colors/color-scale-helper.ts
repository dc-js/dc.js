import { IColorHelper } from './i-color-helper';
import { BaseAccessor } from '../../core/types';

export class ColorScaleHelper implements IColorHelper {
    public colorAccessor: BaseAccessor<string>;
    public scale: BaseAccessor<string>;

    constructor({
        scale,
        colorAccessor,
    }: {
        scale: BaseAccessor<string>;
        colorAccessor?: BaseAccessor<string>;
    }) {
        this.colorAccessor = colorAccessor;
        this.scale = scale;
    }

    getColor(d, i?: number): string {
        return this.scale(this.colorAccessor(d, i));
    }

    share(colorAccessor: BaseAccessor<string>): IColorHelper {
        return new ColorScaleHelper({ scale: this.scale, colorAccessor });
    }
}
