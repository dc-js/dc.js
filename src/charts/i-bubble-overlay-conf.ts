import { IBubbleMixinConf } from '../base/i-bubble-mixin-conf';
import { BubblePoint } from '../core/types';

export interface IBubbleOverlayConf extends IBubbleMixinConf {
    readonly points?: BubblePoint[];
}
