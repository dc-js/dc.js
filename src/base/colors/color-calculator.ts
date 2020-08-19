import { IColorHelper } from './i-color-helper';
import { BaseAccessor } from '../../core/types';

export class ColorCalculator implements IColorHelper {
    public colorAccessor: BaseAccessor<string>;
    public getColor: BaseAccessor<string>;

    constructor(colorCalculator: BaseAccessor<string>) {
        this.getColor = colorCalculator;
    }

    public share(colorAccessor: BaseAccessor<string>): IColorHelper {
        return this;
    }
}
