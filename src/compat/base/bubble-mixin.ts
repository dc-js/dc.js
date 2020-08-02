import {Constructor} from '../../core/types';
import {BaseMixinExt} from './base-mixin';
import {BubbleMixin as BubbleMixinNeo} from '../../base/bubble-mixin';
import {BaseMixin as BaseMixinNeo} from '../../base/base-mixin';

class Intermediate extends BaseMixinExt(BubbleMixinNeo(BaseMixinNeo)) { }

export function BubbleMixinExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }
    }
}
