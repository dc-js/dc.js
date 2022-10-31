import { Constructor } from '../../core/types.js';
import { BaseMixinExt } from './base-mixin.js';
import { MarginMixin as MarginMixinNeo } from '../../base/margin-mixin.js';

class Intermediate extends BaseMixinExt(MarginMixinNeo) {}

export function MarginMixinExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }
    };
}
