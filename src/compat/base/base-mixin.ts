import {
    BaseAccessor,
    Constructor,
    KeyAccessor,
    LabelAccessor,
    MinimalCFDimension,
    MinimalCFGroup,
    TitleAccessor,
    ValueAccessor,
} from '../../core/types';

import { BaseMixin as BaseMixinNeo } from '../../base/base-mixin';

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
        public minWidth(): number;
        public minWidth(minWidth: number): this;
        public minWidth(minWidth?) {
            if (!arguments.length) {
                return this._conf.minWidth;
            }
            this.configure({ minWidth: minWidth });
            return this;
        }

        /**
         * Set or get the minimum height attribute of a chart. This only has effect when used with the default
         * {@link BaseMixin#height height} function.
         * @see {@link BaseMixin#height height}
         * @param {Number} [minHeight=200]
         * @returns {Number|BaseMixin}
         */
        public minHeight(): number;
        public minHeight(minHeight: number): this;
        public minHeight(minHeight?) {
            if (!arguments.length) {
                return this._conf.minHeight;
            }
            this.configure({ minHeight: minHeight });
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
        public useViewBoxResizing(): boolean;
        public useViewBoxResizing(useViewBoxResizing: boolean): this;
        public useViewBoxResizing(useViewBoxResizing?) {
            if (!arguments.length) {
                return this._conf.useViewBoxResizing;
            }
            this.configure({ useViewBoxResizing: useViewBoxResizing });
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
        public dimension(): MinimalCFDimension;
        public dimension(dimension: MinimalCFDimension): this;
        public dimension(dimension?) {
            if (!arguments.length) {
                return this.dataProvider().conf().dimension;
            }
            this.dataProvider().configure({ dimension: dimension });
            this.expireCache();
            return this;
        }

        /**
         * **mandatory**
         *
         * Set or get the group attribute of a chart. In `dc` a group is a
         * {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#group-map-reduce crossfilter group}.
         * Usually the group should be created from the particular dimension associated with the same chart. If a value is
         * given, then it will be used as the new group.
         *
         * If no value specified then the current group will be returned.
         * If `name` is specified then it will be used to generate legend label.
         * @see {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#group-map-reduce crossfilter.group}
         * @example
         * var index = crossfilter([]);
         * var dimension = index.dimension(pluck('key'));
         * chart.dimension(dimension);
         * chart.group(dimension.group().reduceSum());
         * @param {crossfilter.group} [group]
         * @param {String} [name]
         * @returns {crossfilter.group|BaseMixin}
         */
        public group(): MinimalCFGroup;
        public group(group: MinimalCFGroup, name?: string, accessor?: BaseAccessor<any>): this;
        public group(group?, name?, accessor?) {
            if (!arguments.length) {
                return this._dataProvider.conf().group;
            }
            this._dataProvider.configure({ group });
            this.configure({
                groupName: name,
            });
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
        public ordering(): BaseAccessor<any>;
        public ordering(orderFunction: BaseAccessor<any>): this;
        public ordering(orderFunction?) {
            if (!arguments.length) {
                return this._dataProvider.conf().ordering;
            }
            this._dataProvider.configure({ ordering: orderFunction });
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
        public filterPrinter();
        public filterPrinter(filterPrinterFunction): this;
        public filterPrinter(filterPrinterFunction?) {
            if (!arguments.length) {
                return this._conf.filterPrinter;
            }
            this.configure({ filterPrinter: filterPrinterFunction });
            return this;
        }

        /**
         * Set or get the animation transition duration (in milliseconds) for this chart instance.
         * @param {Number} [duration=750]
         * @returns {Number|BaseMixin}
         */
        public transitionDuration(): number;
        public transitionDuration(duration: number): this;
        public transitionDuration(duration?) {
            if (!arguments.length) {
                return this._conf.transitionDuration;
            }
            this.configure({ transitionDuration: duration });
            return this;
        }

        /**
         * Set or get the animation transition delay (in milliseconds) for this chart instance.
         * @param {Number} [delay=0]
         * @returns {Number|BaseMixin}
         */
        public transitionDelay(): number;
        public transitionDelay(delay: number): this;
        public transitionDelay(delay?) {
            if (!arguments.length) {
                return this._conf.transitionDelay;
            }
            this.configure({ transitionDelay: delay });
            return this;
        }

        /**
         * If set, use the `visibility` attribute instead of the `display` attribute for showing/hiding
         * chart reset and filter controls, for less disruption to the layout.
         * @param {Boolean} [controlsUseVisibility=false]
         * @returns {Boolean|BaseMixin}
         */
        public controlsUseVisibility(): boolean;
        public controlsUseVisibility(controlsUseVisibility: boolean): this;
        public controlsUseVisibility(controlsUseVisibility?) {
            if (!arguments.length) {
                return this._conf.controlsUseVisibility;
            }
            this.configure({ controlsUseVisibility: controlsUseVisibility });
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
        public commitHandler(): () => void;
        public commitHandler(commitHandler: () => void): this;
        public commitHandler(commitHandler?) {
            if (!arguments.length) {
                return this._conf.commitHandler;
            }
            this.configure({ commitHandler: commitHandler });
            return this;
        }

        /**
         * Set or get the label function. The chart class will use this function to render labels for each
         * child element in the chart, e.g. slices in a pie chart or bubbles in a bubble chart. Not every
         * chart supports the label function, for example line chart does not use this function
         * at all. By default, enables labels; pass false for the second parameter if this is not desired.
         * @example
         * // default label function just return the key
         * chart.label(function(d) { return d.key; });
         * // label function has access to the standard d3 data binding and can get quite complicated
         * chart.label(function(d) { return d.data.key + '(' + Math.floor(d.data.value / all.value() * 100) + '%)'; });
         * @param {Function} [labelFunction]
         * @param {Boolean} [enableLabels=true]
         * @returns {Function|BaseMixin}
         */
        public label(): LabelAccessor;
        public label(labelFunction: LabelAccessor, enableLabels?: boolean): this;
        public label(labelFunction?, enableLabels?) {
            if (!arguments.length) {
                return this._conf.label;
            }
            this.configure({ label: labelFunction });
            if (enableLabels === undefined || enableLabels) {
                this.configure({ renderLabel: true });
            }
            return this;
        }

        /**
         * Turn on/off label rendering
         * @param {Boolean} [renderLabel=false]
         * @returns {Boolean|BaseMixin}
         */
        public renderLabel(): boolean;
        public renderLabel(renderLabel: boolean): this;
        public renderLabel(renderLabel?) {
            if (!arguments.length) {
                return this._conf.renderLabel;
            }
            this.configure({ renderLabel: renderLabel });
            return this;
        }

        /**
         * Turn on/off title rendering, or return the state of the render title flag if no arguments are
         * given.
         * @param {Boolean} [renderTitle=true]
         * @returns {Boolean|BaseMixin}
         */
        public renderTitle(): boolean;
        public renderTitle(renderTitle: boolean): this;
        public renderTitle(renderTitle?) {
            if (!arguments.length) {
                return this._conf.renderTitle;
            }
            this.configure({ renderTitle: renderTitle });
            return this;
        }

        /**
         * Set or get the title function. The chart class will use this function to render the SVGElement title
         * (usually interpreted by browser as tooltips) for each child element in the chart, e.g. a slice
         * in a pie chart or a bubble in a bubble chart. Almost every chart supports the title function;
         * however in grid coordinate charts you need to turn off the brush in order to see titles, because
         * otherwise the brush layer will block tooltip triggering.
         * @example
         * // default title function shows "key: value"
         * chart.title(function(d) { return d.key + ': ' + d.value; });
         * // title function has access to the standard d3 data binding and can get quite complicated
         * chart.title(function(p) {
         *    return p.key.getFullYear()
         *        + '\n'
         *        + 'Index Gain: ' + numberFormat(p.value.absGain) + '\n'
         *        + 'Index Gain in Percentage: ' + numberFormat(p.value.percentageGain) + '%\n'
         *        + 'Fluctuation / Index Ratio: ' + numberFormat(p.value.fluctuationPercentage) + '%';
         * });
         * @param {Function} [titleFunction]
         * @returns {Function|BaseMixin}
         */
        public title(): TitleAccessor;
        public title(titleFunction: TitleAccessor): this;
        public title(titleFunction?) {
            if (!arguments.length) {
                return this._conf.title;
            }
            this.configure({
                title: titleFunction,
            });
            return this;
        }

        /**
         * Set or get the key accessor function. The key accessor function is used to retrieve the key
         * value from the crossfilter group. Key values are used differently in different charts, for
         * example keys correspond to slices in a pie chart and x axis positions in a grid coordinate chart.
         * @example
         * // default key accessor
         * chart.keyAccessor(function(d) { return d.key; });
         * // custom key accessor for a multi-value crossfilter reduction
         * chart.keyAccessor(function(p) { return p.value.absGain; });
         * @param {Function} [keyAccessor]
         * @returns {Function|BaseMixin}
         */
        public keyAccessor(): KeyAccessor;
        public keyAccessor(keyAccessor: KeyAccessor): this;
        public keyAccessor(keyAccessor?) {
            if (!arguments.length) {
                return this._conf.keyAccessor;
            }
            this.configure({ keyAccessor: keyAccessor });
            return this;
        }

        /**
         * Set or get the value accessor function. The value accessor function is used to retrieve the
         * value from the crossfilter group. Group values are used differently in different charts, for
         * example values correspond to slice sizes in a pie chart and y axis positions in a grid
         * coordinate chart.
         * @example
         * // default value accessor
         * chart.valueAccessor(function(d) { return d.value; });
         * // custom value accessor for a multi-value crossfilter reduction
         * chart.valueAccessor(function(p) { return p.value.percentageGain; });
         * @param {Function} [valueAccessor]
         * @returns {Function|BaseMixin}
         */
        public valueAccessor(): ValueAccessor;
        public valueAccessor(valueAccessor: ValueAccessor): this;
        public valueAccessor(valueAccessor?) {
            if (!arguments.length) {
                return this.dataProvider().conf().valueAccessor;
            }
            this.dataProvider().configure({ valueAccessor: valueAccessor });
            return this;
        }
    };
}

export const BaseMixin = BaseMixinExt(BaseMixinNeo);

export const baseMixin = () => new BaseMixin(undefined);
