import {Constructor} from '../../core/types';

import {BaseMixin as BaseMixinNeo} from '../../base/base-mixin';

export function BaseMixinExt<TBase extends Constructor<BaseMixinNeo>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }
        /**
         * Set or get the minimum width attribute of a chart. This only has effect when used with the default
         * {@link BaseMixin#width width} function.
         * @see {@link BaseMixin#width width}
         * @param {Number} [minWidth=200]
         * @returns {Number|BaseMixin}
         */
        public minWidth (): number;
        public minWidth (minWidth: number): this;
        public minWidth (minWidth?) {
            if (!arguments.length) {
                return this._conf.minWidth;
            }
            this._conf.minWidth = minWidth;
            return this;
        }

        /**
         * Set or get the minimum height attribute of a chart. This only has effect when used with the default
         * {@link BaseMixin#height height} function.
         * @see {@link BaseMixin#height height}
         * @param {Number} [minHeight=200]
         * @returns {Number|BaseMixin}
         */
        public minHeight (): number;
        public minHeight (minHeight: number): this;
        public minHeight (minHeight?) {
            if (!arguments.length) {
                return this._conf.minHeight;
            }
            this._conf.minHeight = minHeight;
            return this;
        }

    }
}

export const BaseMixin = BaseMixinExt(BaseMixinNeo);

export const baseMixin = () => new BaseMixin();
