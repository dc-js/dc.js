import { IBubbleMixinConf } from '../base/i-bubble-mixin-conf.js';
import { BubblePoint } from '../core/types.js';

export interface IBubbleOverlayConf extends IBubbleMixinConf {
    readonly points?: BubblePoint[];
}
