import {Constructor} from '../../core/types';

import {BaseMixin as BaseMixinNeo} from '../../base/base-mixin';

export function BaseMixinExt<TBase extends Constructor<BaseMixinNeo>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }
    }
}

export const BaseMixin = BaseMixinExt(BaseMixinNeo);

export const baseMixin = () => new BaseMixin();
