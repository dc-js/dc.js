import { BaseAccessor } from '../../core/types.js';

export class AbstractColorHelper {
    /**
     * Set or get color accessor function.
     * Chart will assign this, not assigned in user code.
     *
     * @category Intermediate
     */
    public colorAccessor: BaseAccessor<string>;

    /**
     * Charts call this method to lookup actual colors.
     * Rarely called in user code.
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
    public share(colorAccessor: BaseAccessor<string>): AbstractColorHelper {
        return this;
    }
}
