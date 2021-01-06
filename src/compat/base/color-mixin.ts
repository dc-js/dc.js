import { BaseAccessor, ColorAccessor, Constructor, MinimalColorScale } from '../../core/types';
import { BaseMixinExt } from './base-mixin';
import { ColorMixin as ColorMixinNeo } from '../../base/color-mixin';
import { BaseMixin as BaseMixinNeo } from '../../base/base-mixin';
import { ColorCalculator } from '../../base/colors/color-calculator';
import { ColorScaleHelper } from '../../base/colors/color-scale-helper';
import { scaleQuantize } from 'd3-scale';
import { OrdinalColors } from '../../base/colors/ordinal-colors';
import { LinearColors } from '../../base/colors/linear-colors';

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
         * Overrides the color selection algorithm, replacing it with a simple function.
         *
         * Normally colors will be determined by calling the `colorAccessor` to get a value, and then passing that
         * value through the `colorScale`.
         *
         * But sometimes it is difficult to get a color scale to produce the desired effect. The `colorCalculator`
         * takes the datum and index and returns a color directly.
         */
        public colorCalculator(): ColorAccessor;
        public colorCalculator(colorCalculator: ColorAccessor): this;
        public colorCalculator(colorCalculator?) {
            if (!arguments.length) {
                return this.colorHelper().getColor;
            }
            this.colorHelper(new ColorCalculator(colorCalculator));
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
                return (this.colorHelper() as ColorScaleHelper).scale;
            }
            let newScale;
            if (colorScale instanceof Array) {
                newScale = scaleQuantize<string>().range(colorScale); // deprecated legacy support, note: this fails for ordinal domains
            } else {
                newScale = typeof colorScale === 'function' ? colorScale : () => colorScale;
            }

            this.colorHelper(
                new ColorScaleHelper({
                    scale: newScale,
                    colorAccessor: this._conf.colorAccessor,
                })
            );
            return this;
        }

        /**
         * Convenience method to set the color scale to
         * {@link https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales d3.scaleOrdinal} with
         * range `r`.
         */
        public ordinalColors(r: string[]): this {
            this.colorHelper(
                new OrdinalColors({
                    colors: r,
                    colorAccessor: this._conf.colorAccessor,
                })
            );
            return this;
        }

        /**
         * Convenience method to set the color scale to an Hcl interpolated linear scale with range `r`.
         */
        public linearColors(r: [string, string]): this {
            this.colorHelper(
                new LinearColors({
                    range: r,
                    colorAccessor: this._conf.colorAccessor,
                })
            );
            return this;
        }

        /**
         * Set or get the current domain for the color mapping function. The domain must be supplied as an
         * array.
         *
         * Note: previously this method accepted a callback function. Instead you may use a custom scale
         * set by {@link ColorMixin#colors .colors}.
         */
        public colorDomain(): string[];
        public colorDomain(domain: string[]): this;
        public colorDomain(domain?) {
            const scale = (this.colorHelper() as ColorScaleHelper).scale as MinimalColorScale;
            if (!arguments.length) {
                return scale.domain();
            }
            scale.domain(domain);
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
