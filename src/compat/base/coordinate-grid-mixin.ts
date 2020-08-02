import {Constructor} from '../../core/types';
import {BaseMixinExt} from './base-mixin';
import {CoordinateGridMixin as CoordinateGridMixinNeo} from '../../base/coordinate-grid-mixin';
import {MarginMixinExt} from './margin-mixin';
import {ColorMixinExt} from './color-mixin';

class Intermediate extends MarginMixinExt(BaseMixinExt(CoordinateGridMixinNeo)) { }

export function CoordinateGridMixinExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }
    }
}

export const CoordinateGridMixin = CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(CoordinateGridMixinNeo))));
