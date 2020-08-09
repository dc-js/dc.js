import {Constructor, RValueAccessor} from '../../core/types';
import {BaseMixinExt} from './base-mixin';
import {BubbleMixin as BubbleMixinNeo} from '../../base/bubble-mixin';
import {BaseMixin as BaseMixinNeo} from '../../base/base-mixin';

class Intermediate extends BaseMixinExt(BubbleMixinNeo(BaseMixinNeo)) { }

export function BubbleMixinExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }

        /**
         * Turn on or off the bubble sorting feature, or return the value of the flag. If enabled,
         * bubbles will be sorted by their radius, with smaller bubbles in front.
         * @memberof BubbleChart
         * @instance
         * @param {Boolean} [sortBubbleSize=false]
         * @returns {Boolean|BubbleChart}
         */
        public sortBubbleSize (): boolean;
        public sortBubbleSize (sortBubbleSize: boolean);
        public sortBubbleSize (sortBubbleSize?) {
            if (!arguments.length) {
                return this._conf.sortBubbleSize;
            }
            this.configure({sortBubbleSize: sortBubbleSize});
            return this;
        }

        /**
         * Get or set the radius value accessor function. If set, the radius value accessor function will
         * be used to retrieve a data value for each bubble. The data retrieved then will be mapped using
         * the r scale to the actual bubble radius. This allows you to encode a data dimension using bubble
         * size.
         * @memberof BubbleMixin
         * @instance
         * @param {Function} [radiusValueAccessor]
         * @returns {Function|BubbleMixin}
         */
        public radiusValueAccessor (): RValueAccessor;
        public radiusValueAccessor (radiusValueAccessor: RValueAccessor);
        public radiusValueAccessor (radiusValueAccessor?) {
            if (!arguments.length) {
                return this._conf.radiusValueAccessor;
            }
            this.configure({radiusValueAccessor: radiusValueAccessor});
            return this;
        }

        /**
         * Get or set the minimum radius for label rendering. If a bubble's radius is less than this value
         * then no label will be rendered.
         * @memberof BubbleMixin
         * @instance
         * @param {Number} [radius=10]
         * @returns {Number|BubbleMixin}
         */
        public minRadiusWithLabel (): number;
        public minRadiusWithLabel (radius: number);
        public minRadiusWithLabel (radius?) {
            if (!arguments.length) {
                return this._conf.minRadiusWithLabel;
            }
            this.configure({minRadiusWithLabel: radius});
            return this;
        }

        /**
         * Get or set the maximum relative size of a bubble to the length of x axis. This value is useful
         * when the difference in radius between bubbles is too great.
         * @memberof BubbleMixin
         * @instance
         * @param {Number} [relativeSize=0.3]
         * @returns {Number|BubbleMixin}
         */
        public maxBubbleRelativeSize (): number;
        public maxBubbleRelativeSize (relativeSize: number);
        public maxBubbleRelativeSize (relativeSize?) {
            if (!arguments.length) {
                return this._conf.maxBubbleRelativeSize;
            }
            this.configure({maxBubbleRelativeSize: relativeSize});
            return this;
        }

        /**
         * Turn on or off the elastic bubble radius feature, or return the value of the flag. If this
         * feature is turned on, then bubble radii will be automatically rescaled to fit the chart better.
         * @memberof BubbleMixin
         * @instance
         * @param {Boolean} [elasticRadius=false]
         * @returns {Boolean|BubbleChart}
         */
        public elasticRadius (): boolean;
        public elasticRadius (elasticRadius: boolean);
        public elasticRadius (elasticRadius?) {
            if (!arguments.length) {
                return this._conf.elasticRadius;
            }
            this.configure({elasticRadius: elasticRadius});
            return this;
        }

        /**
         * Should the chart exclude zero when calculating elastic bubble radius?
         * @memberof BubbleMixin
         * @instance
         * @param  {Boolean} [excludeZero=true]
         * @returns {Boolean|BubbleMixin}
         */
        public excludeElasticZero (): boolean;
        public excludeElasticZero (excludeZero: boolean);
        public excludeElasticZero (excludeZero?) {
            if (!arguments.length) {
                return this._conf.excludeElasticZero;
            }
            this.configure({excludeElasticZero: excludeZero});
            return this;
        }
    }
}
