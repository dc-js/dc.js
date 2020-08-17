import { BubbleOverlay as BubbleOverlayNeo } from '../../charts/bubble-overlay';
import { BaseMixinExt } from '../base/base-mixin';
import { ColorMixinExt } from '../base/color-mixin';
import { ChartGroupType, ChartParentType } from '../../core/types';
import { BubbleMixinExt } from '../base/bubble-mixin';

export class BubbleOverlay extends BubbleMixinExt(ColorMixinExt(BaseMixinExt(BubbleOverlayNeo))) {
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }

    /**
     * **mandatory**
     *
     * Set up a data point on the overlay. The name of a data point should match a specific 'key' among
     * data groups generated using keyAccessor.  If a match is found (point name <-> data group key)
     * then a bubble will be generated at the position specified by the function. x and y
     * value specified here are relative to the underlying svg.
     * @param {String} name
     * @param {Number} x
     * @param {Number} y
     * @returns {BubbleOverlay}
     */
    public point(name: string, x: number, y: number): this {
        this._conf.points.push({ name, x, y });
        return this;
    }
}

export const bubbleOverlay = (parent, chartGroup) => new BubbleOverlay(parent, chartGroup);
