import { Constructor, TitleAccessor } from '../../core/types';
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
         * Set or get the title function. Chart class will use this function to render svg title (usually interpreted by
         * browser as tooltips) for each child element in the chart, i.e. a slice in a pie chart or a bubble in a bubble chart.
         * Almost every chart supports title function however in grid coordinate chart you need to turn off brush in order to
         * use title otherwise the brush layer will block tooltip trigger.
         *
         * If the first argument is a stack name, the title function will get or set the title for that stack. If stackName
         * is not provided, the first stack is implied.
         * @example
         * // set a title function on 'first stack'
         * chart.title('first stack', function(d) { return d.key + ': ' + d.value; });
         * // get a title function from 'second stack'
         * var secondTitleFunction = chart.title('second stack');
         * @param {String} [stackName]
         * @param {Function} [titleAccessor]
         * @returns {String|StackMixin}
         */
        public title(): TitleAccessor;
        public title(stackName); // TODO: actually TitleAccessor, however conflicts with base class signature
        public title(stackName, titleAccessor): this;
        public title(stackName?, titleAccessor?) {
            if (!stackName) {
                return super.title();
            }

            if (typeof stackName === 'function') {
                return super.title(stackName);
            }
            if (stackName === this._groupName && typeof titleAccessor === 'function') {
                return super.title(titleAccessor);
            }

            if (typeof titleAccessor !== 'function') {
                return this._conf.titles[stackName] || super.title();
            }

            this._conf.titles[stackName] = titleAccessor;

            return this;
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
