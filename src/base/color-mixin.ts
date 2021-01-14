import { extent } from 'd3-array';

import { config } from '../core/config';
import { Constructor, MinimalColorScale } from '../core/types';
import { IColorMixinConf } from './i-color-mixin-conf';
import { AbstractColorHelper } from './colors/abstract-color-helper';
import { ColorScaleHelper } from './colors/color-scale-helper';
import { OrdinalColors } from './colors/ordinal-colors';
import { IBaseMixinConf } from './i-base-mixin-conf';

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
        public _conf: IColorMixinConf;

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
         * Different implementations of ColorAccessors provide different functionality:
         *
         * * {@link OrdinalColors} - this is the default. It needs fixed list of colors.
         * * {@link LinearColors} - it provides interpolated colors.
         * * {@link ColorScaleHelper} - it allows any of {@link https://github.com/d3/d3-scale | d3-scales} to be used.
         *   {@link OrdinalColors} and {@link LinearColors} are specialization of this.
         * * {@link ColorCalculator} - It allows skipping {@link colorAccessor} while computing the color.
         *   It ignores even if a {@link colorAccessor} is provided.
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
         * Set the domain by determining the min and max values as retrieved by
         * {@link IColorMixinConf.colorAccessor | .colorAccessor} over the chart's dataset.
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
