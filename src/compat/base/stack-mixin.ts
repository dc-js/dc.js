import {Constructor} from '../../core/types';
import {BaseMixinExt} from './base-mixin';
import {StackMixin as StackMixinNeo} from '../../base/stack-mixin';
import {MarginMixinExt} from './margin-mixin';
import {ColorMixinExt} from './color-mixin';
import {CoordinateGridMixinExt} from './coordinate-grid-mixin';

class Intermediate extends CoordinateGridMixinExt(MarginMixinExt(BaseMixinExt(StackMixinNeo))) { }

export function StackMixinExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }
    }
}

export const StackMixin = StackMixinExt(CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(StackMixinNeo)))));
