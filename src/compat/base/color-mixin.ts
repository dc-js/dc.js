import {Constructor} from '../../core/types';
import {BaseMixinExt} from './base-mixin';
import {ColorMixin as ColorMixinNeo} from '../../base/color-mixin';
import {BaseMixin as BaseMixinNeo} from '../../base/base-mixin';

class Intermediate extends BaseMixinExt(ColorMixinNeo(BaseMixinNeo)) { }

export function ColorMixinExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }
    }
}

export function ColorMixin<TBase extends Constructor<BaseMixinNeo>>(Base: TBase) {
    return class extends ColorMixinExt(ColorMixinNeo(Base)) {
        constructor(...args: any[]) {
            super(...args);
        }
    }
}
