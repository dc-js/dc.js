import { extent } from 'd3-array';

import { config } from '../core/config';
import { BaseMixin } from './base-mixin';
import { Constructor, MinimalColorScale } from '../core/types';
import { IColorMixinConf } from './i-color-mixin-conf';
import { IColorHelper } from './colors/i-color-helper';
import { ColorScaleHelper } from './colors/color-scale-helper';
import { OrdinalColors } from './colors/ordinal-colors';
import { IBaseMixinConf } from "./i-base-mixin-conf";

interface MinimalBase {
    configure(conf: IBaseMixinConf);
    data();
    data(callback): this;
}

/**
 * The Color Mixin is an abstract chart functional class providing universal coloring support
 * as a mix-in for any concrete chart implementation.
 * @mixin ColorMixin
 * @param {Object} Base
 * @returns {ColorMixin}
 */
// tslint:disable-next-line:variable-name
export function ColorMixin<TBase extends Constructor<MinimalBase>>(Base: TBase) {
    return class extends Base {
        protected _conf: IColorMixinConf;

        private _colorHelper: IColorHelper;

        constructor(...args: any[]) {
            super();

            this.configure({
                colorAccessor: (d, i?) => this._conf.keyAccessor(d),
            });

            this._colorHelper = new OrdinalColors({
                colors: config.defaultColors(),
                colorAccessor: this._conf.colorAccessor,
            });
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

        public colorHelper(): IColorHelper;
        public colorHelper(colorHelper: IColorHelper): this;
        public colorHelper(colorHelper?) {
            if (!arguments.length) {
                return this._colorHelper;
            }
            this._colorHelper = colorHelper;
            return this;
        }

        /**
         * Get the color for the datum d and counter i. This is used internally by charts to retrieve a color.
         * @method getColor
         * @memberof ColorMixin
         * @instance
         * @param {*} d
         * @param {Number} [i]
         * @returns {String}
         */
        public getColor(d, i?: number): string {
            return this._colorHelper.getColor(d, i);
        }

        /**
         * Set the domain by determining the min and max values as retrieved by
         * {@link ColorMixin#colorAccessor .colorAccessor} over the chart's dataset.
         * @memberof ColorMixin
         * @instance
         * @returns {ColorMixin}
         */
        public calculateColorDomain(): this {
            const scale: MinimalColorScale = (this._colorHelper as ColorScaleHelper)
                .scale as MinimalColorScale;

            if (scale && scale.domain) {
                scale.domain(extent(this.data(), this._conf.colorAccessor));
            }

            return this;
        }
    };
}
