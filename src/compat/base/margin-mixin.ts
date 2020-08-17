import { Constructor } from '../../core/types';
import { BaseMixinExt } from './base-mixin';
import { MarginMixin as MarginMixinNeo } from '../../base/margin-mixin';

class Intermediate extends BaseMixinExt(MarginMixinNeo) {}

export function MarginMixinExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }
    };
}
