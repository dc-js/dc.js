import {ColorAccessor, Constructor} from '../../core/types';
import {BaseMixinExt} from './base-mixin';
import {ColorMixin as ColorMixinNeo} from '../../base/color-mixin';
import {BaseMixin as BaseMixinNeo} from '../../base/base-mixin';

class Intermediate extends BaseMixinExt(ColorMixinNeo(BaseMixinNeo)) { }

export function ColorMixinExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }

        /**
         * Set or the get color accessor function. This function will be used to map a data point in a
         * crossfilter group to a color value on the color scale. The default function uses the key
         * accessor.
         * @memberof ColorMixin
         * @instance
         * @example
         * // default index based color accessor
         * .colorAccessor(function (d, i){return i;})
         * // color accessor for a multi-value crossfilter reduction
         * .colorAccessor(function (d){return d.value.absGain;})
         * @param {Function} [colorAccessor]
         * @returns {Function|ColorMixin}
         */
        public colorAccessor (): ColorAccessor;
        public colorAccessor (colorAccessor: ColorAccessor): this;
        public colorAccessor (colorAccessor?) {
            if (!arguments.length) {
                return this._conf.colorAccessor;
            }
            this.configure({colorAccessor: colorAccessor});
            return this;
        }

        /**
         * Overrides the color selection algorithm, replacing it with a simple function.
         *
         * Normally colors will be determined by calling the `colorAccessor` to get a value, and then passing that
         * value through the `colorScale`.
         *
         * But sometimes it is difficult to get a color scale to produce the desired effect. The `colorCalculator`
         * takes the datum and index and returns a color directly.
         * @memberof ColorMixin
         * @instance
         * @param {*} [colorCalculator]
         * @returns {Function|ColorMixin}
         */
        public colorCalculator (): ColorAccessor;
        public colorCalculator (colorCalculator: ColorAccessor): this;
        public colorCalculator (colorCalculator?) {
            if (!arguments.length) {
                return this._conf.colorCalculator || this.getColor;
            }
            this.configure({colorCalculator: colorCalculator});
            return this;
        }
    }
}

export function ColorMixin<TBase extends Constructor<BaseMixinNeo>>(Base: TBase) {
    return class extends ColorMixinExt(ColorMixinNeo(BaseMixinExt(Base))) {
        constructor(...args: any[]) {
            super(...args);
        }
    }
}
