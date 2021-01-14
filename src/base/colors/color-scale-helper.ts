import { AbstractColorHelper } from './abstract-color-helper';
import { BaseAccessor } from '../../core/types';

export class ColorScaleHelper extends AbstractColorHelper {
    public colorAccessor: BaseAccessor<string>;
    public colorScale: BaseAccessor<string>;

    constructor(colorScale: BaseAccessor<string>) {
        super();
        this.colorScale = colorScale;
    }

    getColor(d, i?: number): string {
        return this.colorScale(this.colorAccessor(d, i));
    }

    /**
     * It is unlikely that it will be used directly.
     *
     * @category Ninja
     * @see {@link AbstractColorHelper.share}
     */
    share(colorAccessor: BaseAccessor<string>): AbstractColorHelper {
        const clonedScale = new ColorScaleHelper(this.colorScale);
        clonedScale.colorAccessor = colorAccessor;
        return clonedScale;
    }
}
