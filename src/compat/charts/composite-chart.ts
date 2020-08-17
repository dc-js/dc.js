import { Constructor } from '../../core/types';
import { CompositeChart as CompositeChartNeo } from '../../charts/composite-chart';
import { BaseMixinExt } from '../base/base-mixin';
import { MarginMixinExt } from '../base/margin-mixin';
import { ColorMixinExt } from '../base/color-mixin';
import { CoordinateGridMixinExt } from '../base/coordinate-grid-mixin';

class Intermediate extends CoordinateGridMixinExt(
    ColorMixinExt(MarginMixinExt(BaseMixinExt(CompositeChartNeo)))
) {}

export function CompositeChartExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }

        /**
         * Get or set color sharing for the chart. If set, the {@link ColorMixin#colors .colors()} value from this chart
         * will be shared with composed children. Additionally if the child chart implements
         * Stackable and has not set a custom .colorAccessor, then it will generate a color
         * specific to its order in the composition.
         * @param {Boolean} [shareColors=false]
         * @returns {Boolean|CompositeChart}
         */
        public shareColors(): boolean;
        public shareColors(shareColors: boolean): this;
        public shareColors(shareColors?) {
            if (!arguments.length) {
                return this._conf.shareColors;
            }
            this.configure({ shareColors: shareColors });
            return this;
        }

        /**
         * Get or set title sharing for the chart. If set, the {@link BaseMixin#title .title()} value from
         * this chart will be shared with composed children.
         *
         * Note: currently you must call this before `compose` or the child will still get the parent's
         * `title` function!
         * @param {Boolean} [shareTitle=true]
         * @returns {Boolean|CompositeChart}
         */
        public shareTitle(): boolean;
        public shareTitle(shareTitle: boolean): this;
        public shareTitle(shareTitle?) {
            if (!arguments.length) {
                return this._conf.shareTitle;
            }
            this.configure({ shareTitle: shareTitle });
            return this;
        }
    };
}

export const CompositeChart = CompositeChartExt(
    CoordinateGridMixinExt(ColorMixinExt(MarginMixinExt(BaseMixinExt(CompositeChartNeo))))
);

export const compositeChart = (parent, chartGroup) => new CompositeChart(parent, chartGroup);
