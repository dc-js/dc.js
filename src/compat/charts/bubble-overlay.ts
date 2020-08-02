import {BubbleOverlay as BubbleOverlayNeo} from '../../charts/bubble-overlay';
import {BaseMixinExt} from '../base/base-mixin';
import {ColorMixinExt} from '../base/color-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';
import {BubbleMixinExt} from '../base/bubble-mixin';

export class BubbleOverlay extends BubbleMixinExt(ColorMixinExt(BaseMixinExt(BubbleOverlayNeo))) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }
}

export const bubbleOverlay = (parent, chartGroup) => new BubbleOverlay(parent, chartGroup);
