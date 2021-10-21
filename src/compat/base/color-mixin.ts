import { BaseAccessor, ColorAccessor, Constructor } from '../../core/types';
import { BaseMixinExt } from './base-mixin';
import { ColorMixin as ColorMixinNeo } from '../../base/color-mixin';
import { BaseMixin as BaseMixinNeo } from '../../base/base-mixin';
import { ColorScaleHelper } from '../../base/colors/color-scale-helper';
import { scaleQuantize } from 'd3-scale';

class Intermediate extends BaseMixinExt(ColorMixinNeo(BaseMixinNeo)) {}

export function ColorMixinExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }

        /**
         * Set or the get color accessor function. This function will be used to map a data point in a
         * crossfilter group to a color value on the color scale. The default function uses the key
         * accessor.
         * @example
         * // default index based color accessor
         * .colorAccessor(function (d, i){return i;})
         * // color accessor for a multi-value crossfilter reduction
         * .colorAccessor(function (d){return d.value.absGain;})
         */
        public colorAccessor(): ColorAccessor;
        public colorAccessor(colorAccessor: ColorAccessor): this;
        public colorAccessor(colorAccessor?) {
            if (!arguments.length) {
                return this._conf.colorAccessor;
            }
            this.configure({ colorAccessor: colorAccessor });
            return this;
        }

        /**
         * Retrieve current color scale or set a new color scale. This methods accepts any function that
         * operates like a d3 scale.
         * @see {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale}
         * @example
         * // alternate categorical scale
         * chart.colors(d3.scale.category20b());
         * // ordinal scale
         * chart.colors(d3.scaleOrdinal().range(['red','green','blue']));
         * // convenience method, the same as above
         * chart.ordinalColors(['red','green','blue']);
         * // set a linear scale
         * chart.linearColors(["#4575b4", "#ffffbf", "#a50026"]);
         */
        public colors(): BaseAccessor<string>;
        public colors(colorScale: BaseAccessor<string>): this;
        public colors(colorScale?) {
            if (!arguments.length) {
                return (this.colorHelper() as ColorScaleHelper).colorScale;
            }
            let newScale;
            if (colorScale instanceof Array) {
                newScale = scaleQuantize<string>().range(colorScale); // deprecated legacy support, note: this fails for ordinal domains
            } else {
                newScale = typeof colorScale === 'function' ? colorScale : () => colorScale;
            }

            this.colorHelper(new ColorScaleHelper(newScale));
            return this;
        }
    };
}

export function ColorMixin<TBase extends Constructor<BaseMixinNeo>>(Base: TBase) {
    return class extends ColorMixinExt(ColorMixinNeo(BaseMixinExt(Base))) {
        constructor(...args: any[]) {
            super(...args);
        }
    };
}
