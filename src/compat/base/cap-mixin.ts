import {Constructor} from '../../core/types';
import {BaseMixinExt} from './base-mixin';
import {CapMixin as CapMixinNeo} from '../../base/cap-mixin';
import {BaseMixin as BaseMixinNeo} from '../../base/base-mixin';

class Intermediate extends BaseMixinExt(CapMixinNeo(BaseMixinNeo)) { }

export function CapMixinExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }
    }
}

export function CapMixin<TBase extends Constructor<BaseMixinNeo>>(Base: TBase) {
    return class extends CapMixinExt(CapMixinNeo(BaseMixinExt(Base))) {
        constructor(...args: any[]) {
            super(...args);
        }
    }
}
