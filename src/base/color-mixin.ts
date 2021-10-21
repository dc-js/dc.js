import { extent } from 'd3-array';

import { config } from '../core/config';
import { BaseAccessor, ColorAccessor, Constructor, MinimalColorScale } from '../core/types';
import { IColorMixinConf } from './i-color-mixin-conf';
import { AbstractColorHelper } from './colors/abstract-color-helper';
import { ColorScaleHelper } from './colors/color-scale-helper';
import { OrdinalColors } from './colors/ordinal-colors';
import { IBaseMixinConf } from './i-base-mixin-conf';
import { LinearColors } from './colors/linear-colors';
import { ColorCalculator } from './colors/color-calculator';

interface MinimalBase {
    configure(conf: IBaseMixinConf);

    data();
}

/**
 * The Color Mixin is an abstract chart functional class providing universal coloring support
 * as a mix-in for any concrete chart implementation.
 */
// tslint:disable-next-line:variable-name
export function ColorMixin<TBase extends Constructor<MinimalBase>>(Base: TBase) {
    return class extends Base {
        /**
         * @hidden
         */
        public _conf: IColorMixinConf;

        /**
         * @hidden
         */
        public _colorHelper: AbstractColorHelper;

        constructor(...args: any[]) {
            super(...args);

            this.configure({
                colorAccessor: (d, i?) => this._conf.keyAccessor(d),
            });

            this.colorHelper(new OrdinalColors(config.defaultColors()));
        }

        public configure(conf: IColorMixinConf): this {
            super.configure(conf);
            if ('colorAccessor' in conf && this._colorHelper) {
                this._colorHelper.colorAccessor = conf.colorAccessor;
            }
            return this;
        }

        public conf(): IColorMixinConf {
            return this._conf;
        }

        /**
         * `dc` charts use on the ColorHelpers for color.
         * To color chart elements (like Pie slice, a row, a bar, etc.), typically
         * the underlying data element will be used to determine the color.
         * In most of the cases output of {@linkcode colorAccessor | colorAccessor(d, i)} will be used to determine the color.
         *
         * Usually charts would used use one of
         *
         * Different implementations of ColorAccessors provide different functionality:
         *
         * * {@link OrdinalColors} - this is the default. It needs fixed list of colors.
         * * {@link LinearColors} - it provides interpolated colors.
         * * {@link ColorScaleHelper} - it allows any of {@link https://github.com/d3/d3-scale | d3-scales} to be used.
         *   {@link OrdinalColors} and {@link LinearColors} are specialization of this.
         * * {@link ColorCalculator} - It allows skipping {@link colorAccessor} while computing the color.
         *   Even if a {@link colorAccessor} is provided, it will be ignored.
         *
         * ```
         * // TODO example
         * ```
         */
        public colorHelper(): AbstractColorHelper;
        public colorHelper(colorHelper: AbstractColorHelper): this;
        public colorHelper(colorHelper?) {
            if (!arguments.length) {
                return this._colorHelper;
            }
            this._colorHelper = colorHelper;
            this._colorHelper.colorAccessor = this._conf.colorAccessor;
            return this;
        }

        /**
         * Ordinal colors are used most commonly in `dc` charts.
         * This call is a shorthand for using an {@linkcode OrdinalColors} instance
         * as {@linkcode colorHelper}.
         *
         * ```
         * chart.ordinalColors(colorList); // same as chart.colorHelper(new OrdinalColors(colorList));
         * ```
         *
         * @see {@link OrdinalColors}
         * @see {@link https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales}
         */
        public ordinalColors(colorList: string[]): this {
            this.colorHelper(new OrdinalColors(colorList));
            return this;
        }

        /**
         * Use any of d3 scales for color. This method is a shorthand for the following:
         *
         * ```
         * chart.scaledColors(scale); // same as chart.colorHelper(new ColorScaleHelper(scale));
         * ```
         *
         * Depending on type of scale, it will need eaither setting domain for the scale or
         * compute it se per your data using {@linkcode calculateColorDomain}.
         *
         * @see {@link ColorScaleHelper}
         * @see {@link https://github.com/d3/d3-scale/}
         */
        public colorScale(scale: BaseAccessor<string>): this {
            return this.colorHelper(new ColorScaleHelper(scale));
        }

        /**
         * Convenience method to set the color scale to an Hcl interpolated linear scale with range `r`.
         */
        public linearColors(r: [string, string]): this {
            this.colorHelper(new LinearColors(r));
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
         * Set or get the current domain for the color mapping function. The domain must be supplied as an
         * array.
         *
         * Note: previously this method accepted a callback function. Instead you may use a custom scale
         * set by {@link ColorMixin.colors .colors}.
         */
        public colorDomain(): string[];
        public colorDomain(domain: string[]): this;
        public colorDomain(domain?) {
            const scale = (this.colorHelper() as ColorScaleHelper).colorScale as MinimalColorScale;
            if (!arguments.length) {
                return scale.domain();
            }
            scale.domain(domain);
            return this;
        }

        /**
         * Set the domain by determining the min and max values as retrieved by
         * {@link IColorMixinConf.colorAccessor | .colorAccessor} over the chart's dataset.
         *
         * This is useful only for certain type of color scales.
         * In particular it will not work with {@linkcode ordinalColors}.
         *
         * @category Intermediate
         */
        public calculateColorDomain(): this {
            const scale: MinimalColorScale = (this._colorHelper as ColorScaleHelper)
                .colorScale as MinimalColorScale;

            if (scale && scale.domain) {
                scale.domain(extent(this.data(), this._conf.colorAccessor));
            }

            return this;
        }
    };
}
