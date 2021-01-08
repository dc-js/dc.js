import { extent } from 'd3-array';

import { config } from '../core/config';
import { Constructor, MinimalColorScale } from '../core/types';
import { IColorMixinConf } from './i-color-mixin-conf';
import { IColorHelper } from './colors/i-color-helper';
import { ColorScaleHelper } from './colors/color-scale-helper';
import { OrdinalColors } from './colors/ordinal-colors';
import { IBaseMixinConf } from './i-base-mixin-conf';
import { BaseMixin } from './base-mixin';

interface MinimalBase {
    configure(conf: IBaseMixinConf);
    data();
}

export interface IColorMixin extends BaseMixin {
    configure(conf: IColorMixinConf): this;

    conf(): IColorMixinConf;

    colorHelper(): IColorHelper;

    colorHelper(colorHelper: IColorHelper): this;

    colorHelper(colorHelper?): any;

    /**
     * Get the color for the datum d and counter i. This is used internally by charts to retrieve a color.
     * @method getColor
     */
    getColor(d, i?: number): string;

    /**
     * Set the domain by determining the min and max values as retrieved by
     * {@link IColorMixinConf.colorAccessor .colorAccessor} over the chart's dataset.
     */
    calculateColorDomain(): this;
}

/**
 * The Color Mixin is an abstract chart functional class providing universal coloring support
 * as a mix-in for any concrete chart implementation.
 */
// tslint:disable-next-line:variable-name
export function ColorMixin<TBase extends Constructor<MinimalBase>>(Base: TBase) {
    return class extends Base {
        public _conf: IColorMixinConf;

        public _colorHelper: IColorHelper;

        constructor(...args: any[]) {
            super(...args);

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
         */
        public getColor(d, i?: number): string {
            return this._colorHelper.getColor(d, i);
        }

        /**
         * Set the domain by determining the min and max values as retrieved by
         * {@link IColorMixinConf.colorAccessor .colorAccessor} over the chart's dataset.
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
