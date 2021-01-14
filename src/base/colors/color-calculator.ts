import { AbstractColorHelper } from './abstract-color-helper';
import { BaseAccessor } from '../../core/types';

/**
 * Overrides the color selection algorithm, replacing it with a simple function.
 *
 * Normally colors will be determined by calling the {@linkcode AbstractColorHelper.colorAccessor | colorAccessor}
 * to get a value, and then passing that value through the {@linkcode ColorScaleHelper.colorScale | colorScale}.
 *
 * But sometimes it is difficult to get a color scale to produce the desired effect. The `colorCalculator`
 * takes the datum and index and returns a color directly.
 */
export class ColorCalculator extends AbstractColorHelper {
    public colorAccessor: BaseAccessor<string>;
    public getColor: BaseAccessor<string>;

    /**
     * Create a new instance
     */
    constructor(colorCalculator: BaseAccessor<string>) {
        super();
        this.getColor = colorCalculator;
    }
}
