import { BaseAccessor } from '../../core/types';

export class AbstractColorHelper {
    /**
     * Set or the get color accessor function. This function will be used to map a data point
     * to a color value on the color scale. The default function uses the key accessor.
     *
     * @example
     * ```
     * // index based color accessor
     * chart.colorAccessor((d, i) => i)
     *
     * // color accessor for a multi-value crossfilter reduction
     * chart.colorAccessor(d => d.value.absGain)
     * ```
     */
    public colorAccessor: BaseAccessor<string>;

    /**
     * Charts call this method to lookup actual colors.
     *
     * @category Intermediate
     */
    public getColor(d, i?: number): string {
        return undefined;
    }

    /**
     * Composite charts need the same underlying scale, however, with a different {@link colorAccessor}.
     * It is unlikely that it will be used directly.
     *
     * @category Ninja
     */
    public share(colorAccessor: BaseAccessor<string>): AbstractColorHelper{
        return this;
    }
}
