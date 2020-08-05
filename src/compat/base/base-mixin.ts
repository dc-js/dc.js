import {BaseAccessor, Constructor, MinimalCFDimension} from '../../core/types';

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

        /**
         * Get or set an accessor to order ordinal dimensions.  The chart uses
         * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort Array.sort}
         * to sort elements; this accessor returns the value to order on.
         * @example
         * // Default ordering accessor
         * _chart.ordering(pluck('key'));
         * @param {Function} [orderFunction]
         * @returns {Function|BaseMixin}
         */
        public ordering (): BaseAccessor<any>;
        public ordering (orderFunction: BaseAccessor<any>): this;
        public ordering (orderFunction?) {
            if (!arguments.length) {
                return this._conf.ordering;
            }
            this._conf.ordering = orderFunction;
            this.expireCache();
            return this;
        }

        /**
         * Set or get the filter printer function. The filter printer function is used to generate human
         * friendly text for filter value(s) associated with the chart instance. The text will get shown
         * in the `.filter element; see {@link BaseMixin#turnOnControls turnOnControls}.
         *
         * By default dc charts use a default filter printer {@link printers.filters printers.filters}
         * that provides simple printing support for both single value and ranged filters.
         * @example
         * // for a chart with an ordinal brush, print the filters in upper case
         * chart.filterPrinter(function(filters) {
         *   return filters.map(function(f) { return f.toUpperCase(); }).join(', ');
         * });
         * // for a chart with a range brush, print the filter as start and extent
         * chart.filterPrinter(function(filters) {
         *   return 'start ' + printSingleValue(filters[0][0]) +
         *     ' extent ' + printSingleValue(filters[0][1] - filters[0][0]);
         * });
         * @param {Function} [filterPrinterFunction=printers.filters]
         * @returns {Function|BaseMixin}
         */
        public filterPrinter ();
        public filterPrinter (filterPrinterFunction): this;
        public filterPrinter (filterPrinterFunction?) {
            if (!arguments.length) {
                return this._conf.filterPrinter;
            }
            this._conf.filterPrinter = filterPrinterFunction;
            return this;
        }

        /**
         * Set or get the animation transition duration (in milliseconds) for this chart instance.
         * @param {Number} [duration=750]
         * @returns {Number|BaseMixin}
         */
        public transitionDuration (): number;
        public transitionDuration (duration: number): this;
        public transitionDuration (duration?) {
            if (!arguments.length) {
                return this._conf.transitionDuration;
            }
            this._conf.transitionDuration = duration;
            return this;
        }

        /**
         * Set or get the animation transition delay (in milliseconds) for this chart instance.
         * @param {Number} [delay=0]
         * @returns {Number|BaseMixin}
         */
        public transitionDelay (): number;
        public transitionDelay (delay: number): this;
        public transitionDelay (delay?) {
            if (!arguments.length) {
                return this._conf.transitionDelay;
            }
            this._conf.transitionDelay = delay;
            return this;
        }

        /**
         * If set, use the `visibility` attribute instead of the `display` attribute for showing/hiding
         * chart reset and filter controls, for less disruption to the layout.
         * @param {Boolean} [controlsUseVisibility=false]
         * @returns {Boolean|BaseMixin}
         */
        public controlsUseVisibility (): boolean;
        public controlsUseVisibility (controlsUseVisibility: boolean): this;
        public controlsUseVisibility (controlsUseVisibility?) {
            if (!arguments.length) {
                return this._conf.controlsUseVisibility;
            }
            this._conf.controlsUseVisibility = controlsUseVisibility;
            return this;
        }

        /**
         * Gets/sets the commit handler. If the chart has a commit handler, the handler will be called when
         * the chart's filters have changed, in order to send the filter data asynchronously to a server.
         *
         * Unlike other functions in dc.js, the commit handler is asynchronous. It takes two arguments:
         * a flag indicating whether this is a render (true) or a redraw (false), and a callback to be
         * triggered once the commit is done. The callback has the standard node.js continuation signature
         * with error first and result second.
         * @param {Function} commitHandler
         * @returns {BaseMixin}
         */
        public commitHandler (): () => void;
        public commitHandler (commitHandler: () => void): this;
        public commitHandler (commitHandler?) {
            if (!arguments.length) {
                return this._conf.commitHandler;
            }
            this._conf.commitHandler = commitHandler;
            return this;
        }
    }
}

export const BaseMixin = BaseMixinExt(BaseMixinNeo);

export const baseMixin = () => new BaseMixin();
