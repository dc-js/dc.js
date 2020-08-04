import {Constructor, MinimalCFDimension} from '../../core/types';

import {BaseMixin as BaseMixinNeo} from '../../base/base-mixin';

export function BaseMixinExt<TBase extends Constructor<BaseMixinNeo>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }
        /**
         * Set or get the minimum width attribute of a chart. This only has effect when used with the default
         * {@link BaseMixin#width width} function.
         * @see {@link BaseMixin#width width}
         * @param {Number} [minWidth=200]
         * @returns {Number|BaseMixin}
         */
        public minWidth (): number;
        public minWidth (minWidth: number): this;
        public minWidth (minWidth?) {
            if (!arguments.length) {
                return this._conf.minWidth;
            }
            this._conf.minWidth = minWidth;
            return this;
        }

        /**
         * Set or get the minimum height attribute of a chart. This only has effect when used with the default
         * {@link BaseMixin#height height} function.
         * @see {@link BaseMixin#height height}
         * @param {Number} [minHeight=200]
         * @returns {Number|BaseMixin}
         */
        public minHeight (): number;
        public minHeight (minHeight: number): this;
        public minHeight (minHeight?) {
            if (!arguments.length) {
                return this._conf.minHeight;
            }
            this._conf.minHeight = minHeight;
            return this;
        }

        /**
         * Turn on/off using the SVG
         * {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox `viewBox` attribute}.
         * When enabled, `viewBox` will be set on the svg root element instead of `width` and `height`.
         * Requires that the chart aspect ratio be defined using chart.width(w) and chart.height(h).
         *
         * This will maintain the aspect ratio while enabling the chart to resize responsively to the
         * space given to the chart using CSS. For example, the chart can use `width: 100%; height:
         * 100%` or absolute positioning to resize to its parent div.
         *
         * Since the text will be sized as if the chart is drawn according to the width and height, and
         * will be resized if the chart is any other size, you need to set the chart width and height so
         * that the text looks good. In practice, 600x400 seems to work pretty well for most charts.
         *
         * You can see examples of this resizing strategy in the [Chart Resizing
         * Examples](http://dc-js.github.io/dc.js/resizing/); just add `?resize=viewbox` to any of the
         * one-chart examples to enable `useViewBoxResizing`.
         * @param {Boolean} [useViewBoxResizing=false]
         * @returns {Boolean|BaseMixin}
         */
        public useViewBoxResizing (): boolean;
        public useViewBoxResizing (useViewBoxResizing: boolean): this;
        public useViewBoxResizing (useViewBoxResizing?) {
            if (!arguments.length) {
                return this._conf.useViewBoxResizing;
            }
            this._conf.useViewBoxResizing = useViewBoxResizing;
            return this;
        }

        /**
         * **mandatory**
         *
         * Set or get the dimension attribute of a chart. In `dc`, a dimension can be any valid
         * {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#dimension crossfilter dimension}
         *
         * If a value is given, then it will be used as the new dimension. If no value is specified then
         * the current dimension will be returned.
         * @see {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#dimension crossfilter.dimension}
         * @example
         * var index = crossfilter([]);
         * var dimension = index.dimension(pluck('key'));
         * chart.dimension(dimension);
         * @param {crossfilter.dimension} [dimension]
         * @returns {crossfilter.dimension|BaseMixin}
         */
        public dimension (): MinimalCFDimension;
        public dimension (dimension: MinimalCFDimension): this;
        public dimension (dimension?) {
            if (!arguments.length) {
                return this._conf.dimension;
            }
            this._conf.dimension = dimension;
            this.expireCache();
            return this;
        }



    }
}

export const BaseMixin = BaseMixinExt(BaseMixinNeo);

export const baseMixin = () => new BaseMixin();
