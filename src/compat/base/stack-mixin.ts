import { Constructor } from '../../core/types';
import { BaseMixinExt } from './base-mixin';
import { StackMixin as StackMixinNeo } from '../../base/stack-mixin';
import { MarginMixinExt } from './margin-mixin';
import { ColorMixinExt } from './color-mixin';
import { CoordinateGridMixinExt } from './coordinate-grid-mixin';

class Intermediate extends CoordinateGridMixinExt(MarginMixinExt(BaseMixinExt(StackMixinNeo))) {}

export function StackMixinExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }

        /**
         * Allow named stacks to be hidden or shown by clicking on legend items.
         * This does not affect the behavior of hideStack or showStack.
         * @param {Boolean} [hidableStacks=false]
         * @returns {Boolean|StackMixin}
         */
        public hidableStacks(hidableStacks) {
            if (!arguments.length) {
                return this._conf.hidableStacks;
            }
            this.configure({ hidableStacks: hidableStacks });
            return this;
        }

        /**
         * Since dc.js 2.0, there has been {@link https://github.com/dc-js/dc.js/issues/949 an issue}
         * where points are filtered to the current domain. While this is a useful optimization, it is
         * incorrectly implemented: the next point outside the domain is required in order to draw lines
         * that are clipped to the bounds, as well as bars that are partly clipped.
         *
         * A fix will be included in dc.js 2.1.x, but a workaround is needed for dc.js 2.0 and until
         * that fix is published, so set this flag to skip any filtering of points.
         *
         * Once the bug is fixed, this flag will have no effect, and it will be deprecated.
         * @param {Boolean} [evadeDomainFilter=false]
         * @returns {Boolean|StackMixin}
         */
        public evadeDomainFilter();
        public evadeDomainFilter(evadeDomainFilter): this;
        public evadeDomainFilter(evadeDomainFilter?) {
            if (!arguments.length) {
                return this._conf.evadeDomainFilter;
            }
            this.configure({ evadeDomainFilter: evadeDomainFilter });
            return this;
        }
    };
}

export const StackMixin = StackMixinExt(
    CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(StackMixinNeo))))
);
