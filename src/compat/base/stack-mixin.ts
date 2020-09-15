import { BaseAccessor, Constructor, MinimalCFGroup, TitleAccessor } from '../../core/types';
import { BaseMixinExt } from './base-mixin';
import { StackMixin as StackMixinNeo } from '../../base/stack-mixin';
import { MarginMixinExt } from './margin-mixin';
import { ColorMixinExt } from './color-mixin';
import { CoordinateGridMixinExt } from './coordinate-grid-mixin';
import { LayerSpec } from '../../data';

class Intermediate extends CoordinateGridMixinExt(MarginMixinExt(BaseMixinExt(StackMixinNeo))) {}

export function StackMixinExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }

        /**
         * Stack a new crossfilter group onto this chart with an optional custom value accessor. All stacks
         * in the same chart will share the same key accessor and therefore the same set of keys.
         *
         * For example, in a stacked bar chart, the bars of each stack will be positioned using the same set
         * of keys on the x axis, while stacked vertically. If name is specified then it will be used to
         * generate the legend label.
         * @see {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#group-map-reduce crossfilter.group}
         * @example
         * // stack group using default accessor
         * chart.stack(valueSumGroup)
         * // stack group using custom accessor
         * .stack(avgByDayGroup, function(d){return d.value.avgByDay;});
         * @param {crossfilter.group} group
         * @param {String} [name]
         * @param {Function} [accessor]
         * @returns {Array<{group: crossfilter.group, name: String, accessor: Function}>|StackMixin}
         */
        public stack();
        public stack(group, name?, accessor?): this;
        public stack(group?, name?, accessor?) {
            const stack = this._dataProvider.layers();
            if (!arguments.length) {
                return stack;
            }

            if (arguments.length <= 2) {
                accessor = name;
            }

            name = typeof name === 'string' ? name : String(stack.length);
            const layer: LayerSpec = { group, name };
            if (typeof accessor === 'function') {
                layer.valueAccessor = accessor;
            }
            // @ts-ignore
            stack.push(layer);

            return this;
        }

        public group(): MinimalCFGroup;
        public group(g: MinimalCFGroup, n?: string, f?: BaseAccessor<any>): this;
        public group(g?, n?, f?) {
            if (!arguments.length) {
                return super.group();
            }
            this._dataProvider.configure({
                layers: [],
            });
            this.configure({
                titles: {},
            });
            this.stack(g, n);
            if (f) {
                this._dataProvider.configure({ valueAccessor: f });
            }
            return super.group(g, n);
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
            if (stackName === this._conf.groupName && typeof titleAccessor === 'function') {
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
