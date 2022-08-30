import { BaseType, select, Selection } from 'd3-selection';
import { dispatch, Dispatch } from 'd3-dispatch';

import { isNumber, sortBy, uniqueId } from '../core/utils';
import { instanceOfChart } from '../core/core';
import { chartRegistry } from '../core/chart-registry';
import { constants } from '../core/constants';
import { events } from '../core/events';
import { logger } from '../core/logger';
import { printFilters } from '../core/printers';
import { InvalidStateException } from '../core/invalid-state-exception';
import { BadArgumentException } from '../core/bad-argument-exception';
import { CFGrouping, ChartGroupType, ChartParentType, LegendItem, SizeT } from '../core/types';
import { IBaseMixinConf } from './i-base-mixin-conf';
import { CFSimpleAdapter } from '../data/c-f-simple-adapter';
import { IChartGroup } from '../core/i-chart-group';
import { max } from 'd3-array';

/**
 * `BaseMixin` is an abstract functional object representing a basic `dc` chart object
 * for all chart and widget implementations. Methods from this class are inherited
 * and available on all chart implementations in the `dc` library.
 */
export class BaseMixin {
    /**
     * @hidden
     */
    protected _conf: IBaseMixinConf;

    // tslint:disable-next-line:variable-name
    private __dcFlag__: string;
    private _anchor: string | Element;
    private _root: Selection<Element, any, any, any>; // Do not assume much, allow any HTML or SVG element
    private _svg: Selection<SVGElement, any, any, any>; // from d3-selection
    private _isChild: boolean;
    private _calculatedWidth: number;
    private _calculatedHeight: number;
    private _resizeObserver: ResizeObserver;
    private _mandatoryAttributesList: string[];
    private _chartGroup: IChartGroup;
    private _listeners: Dispatch<BaseMixin>;
    private _legend; // TODO: figure out actual type
    /**
     * @hidden
     */
    protected _dataProvider: CFSimpleAdapter;

    /**
     * Create a new chart
     */
    constructor(parent, chartGroup: ChartGroupType) {
        this._anchor = undefined;
        this._root = undefined;
        this._svg = undefined;
        this._isChild = undefined;

        this.__dcFlag__ = uniqueId().toString();
        this._chartGroup = this._getChartGroup(chartGroup);
        this.anchor(parent);

        this.configure({
            minWidth: 200,
            minHeight: 200,
            useViewBoxResizing: false,
            filterPrinter: printFilters,
            controlsUseVisibility: false,
            transitionDuration: 750,
            transitionDelay: 0,
            commitHandler: undefined,
            keyAccessor: d => d.key,
            label: d => d.key,
            renderLabel: false,
            renderTitle: true,
            title: d => `${this._conf.keyAccessor(d)}: ${d._value}`,
        });

        this.dataProvider(new CFSimpleAdapter());

        this._calculatedWidth = undefined;
        this._calculatedHeight = undefined;

        this._mandatoryAttributesList = [];

        this._listeners = dispatch(
            'preRender',
            'postRender',
            'preRedraw',
            'postRedraw',
            'filtered',
            'zoomed',
            'renderlet',
            'pretransition'
        );

        this._legend = undefined;
    }

    /**
     * An opportunity to cleanup.
     *
     * @category Ninja
     */
    public dispose() {
        if (this._dataProvider) {
            this._dataProvider.dispose();
        }
    }

    /**
     * Configure this chart. The given options are merged with current options.
     */
    public configure(conf: IBaseMixinConf): this {
        this._conf = { ...this._conf, ...conf };
        return this;
    }

    /**
     * Get the current configuration.
     *
     * It returns reference to the internal structure.
     * Any changes made may have unintended consequences.
     *
     * @category Intermediate
     */
    public conf(): IBaseMixinConf {
        return this._conf;
    }

    /**
     * TODO add details
     */
    public dataProvider(): CFSimpleAdapter;
    public dataProvider(dataProvider): this;
    public dataProvider(dataProvider?) {
        if (!arguments.length) {
            return this._dataProvider;
        }

        // cleanup previous data provider
        if (this._dataProvider) {
            this._dataProvider.dispose();
        }

        this._dataProvider = dataProvider;

        this._dataProvider.configure({
            chartId: this.anchorName(),
            primaryChart: !this._isChild,
            filterStorage: this.chartGroup().filterStorage,
            onFiltersChanged: filter => this._filtersChanged(filter),
        });

        return this;
    }

    /**
     * Current height of the chart.
     *
     * To explicitly set height, please set {@link IBaseMixinConf.height} as part of the
     * chart configuration.
     *
     * If not set explicitly the size will be as per the anchor HTML element subject to a minimum
     * as set in {@link IBaseMixinConf.minHeight}.
     * In that case it will keep automatically resizing as well.
     *
     * @see {@link width}
     * @see {@link IBaseMixinConf.minHeight}
     */
    public height(): number {
        if (isNumber(this.conf().height)) {
            return this.conf().height;
        }
        return this._calculatedHeight;
    }

    /**
     * Current width of the chart.
     *
     * To explicitly set width, please set {@link IBaseMixinConf.width} as part of the
     * chart configuration.
     *
     * If not set explicitly the size will be as per the anchor HTML element subject to a minimum
     * as set in {@link IBaseMixinConf.minWidth}.
     * In that case it will keep automatically resizing as well.
     *
     * @see {@link height}
     * @see {@link IBaseMixinConf.minWidth}
     */
    public width(): number {
        if (isNumber(this.conf().width)) {
            return this.conf().width;
        }
        return this._calculatedWidth;
    }

    /**
     * This is called to determine size of the chart based on the bounding rectangle.
     * The default implementation ensures that the chart is at least as big as the minimums defined
     * by {@link IBaseMixinConf.minWidth} and {@link IBaseMixinConf.minHeight}.
     *
     * @category Ninja
     */
    protected onResize(rect: SizeT): SizeT {
        const width = max([rect.width, this.conf().minWidth]);
        const height = max([rect.height, this.conf().minHeight]);
        rect = { width, height };
        if (this.conf().beforeResize) {
            this.conf().beforeResize(rect);
        }
        return rect;
    }

    /**
     * Handle the actual resizing of the chart if the size needs to change based on bounding
     * rectangle.
     *
     * @category Ninja
     */
    protected handleResize(rect: SizeT) {
        this.withoutTransitions(() => {
            this._calculatedWidth = rect.width;
            this._calculatedHeight = rect.height;
            this.redraw();
        });
    }

    /**
     * Return charts data, typically `group.all()`. Some charts override this method.
     * The derived classes may even use different return type.
     *
     * @category Ninja
     */
    public data(): CFGrouping[] {
        return this._dataProvider.data();
    }

    /**
     * @hidden
     */
    protected _computeOrderedGroups(data) {
        return sortBy(data, this._dataProvider.conf().ordering);
    }

    /**
     * Clear all filters associated with this chart. The same effect can be achieved by calling
     * {@link filter | chart.filter(null)}.
     *
     * @category Intermediate
     */
    public filterAll() {
        return this.filter(null);
    }

    /**
     * Execute d3 single selection in the chart's scope using the given selector and return the d3
     * selection.
     *
     * This function is **not chainable** since it does not return a chart instance; however the d3
     * selection result can be chained to d3 function calls.
     *
     * This is typically used in augmenting/modifying a chart.
     *
     * TODO link to example
     *
     * @see {@link https://github.com/d3/d3-selection/blob/master/README.md#select | d3.select}
     *
     * @example
     * ```
     * // Has the same effect as d3.select('#chart-id').select(selector)
     * chart.select(selector)
     *
     * ```
     *
     * @category Intermediate
     * @param sel CSS selector string
     */
    public select<DescElement extends BaseType>(sel) {
        return this._root.select<DescElement>(sel);
    }

    /**
     * Execute in scope d3 selectAll using the given selector and return d3 selection result.
     *
     * This function is **not chainable** since it does not return a chart instance; however the d3
     * selection result can be chained to d3 function calls.
     *
     * This is typically used in augmenting/modifying a chart.
     *
     * TODO link to example
     *
     * @see {@link https://github.com/d3/d3-selection/blob/master/README.md#selectAll | d3.selectAll}
     *
     * @example
     * ```
     * // Has the same effect as d3.select('#chart-id').selectAll(selector)
     * chart.selectAll(selector)
     * ```
     * @category Intermediate
     * @param sel CSS selector string
     */
    public selectAll<DescElement extends BaseType, OldDatum>(sel) {
        return this._root ? this._root.selectAll<DescElement, OldDatum>(sel) : null;
    }

    /**
     * Set the root SVGElement to either be an existing chart's root; or any valid [d3 single
     * selector](https://github.com/d3/d3-selection/blob/master/README.md#selecting-elements) specifying a dom
     * block element such as a div; or a dom element or d3 selection.
     *
     * This is internally managed. Invoking it directly may have unintended consequences.
     *
     * @category Ninja
     */
    public anchor(): string | Element;
    public anchor(parent: ChartParentType): this;
    public anchor(parent?) {
        if (!arguments.length) {
            return this._anchor;
        }
        if (instanceOfChart(parent)) {
            this._anchor = parent.anchor();
            if ((this._anchor as any).children) {
                // is _anchor a div?
                this._anchor = `#${parent.anchorName()}`;
            }
            this._root = parent.root();
            this._isChild = true;
        } else if (parent) {
            if (parent.select && parent.classed) {
                // detect d3 selection
                this._anchor = parent.node();
            } else {
                this._anchor = parent;
            }
            this._root = select(this._anchor as any); // _anchor can be either string or an Element, both are valid
            this._root.classed(constants.CHART_CLASS, true);
            this._chartGroup.register(this);
            this._isChild = false;
        } else {
            throw new BadArgumentException('parent must be defined');
        }
        return this;
    }

    private _getChartGroup(chartGroup: ChartGroupType): IChartGroup {
        return !chartGroup || typeof chartGroup === 'string'
            ? chartRegistry.chartGroup(chartGroup as string)
            : chartGroup;
    }

    /**
     * Returns the DOM id for the chart's anchored location.
     * @category Intermediate
     */
    public anchorName(): string {
        const a: string | Element = this.anchor();
        if (a) {
            if (typeof a === 'string') {
                return a.replace('#', '');
            } else if (a.id) {
                return a.id;
            }
        }
        return `dc-chart${this.chartID()}`;
    }

    /**
     * Returns the root element where a chart resides. Usually it will be the parent div element where
     * the SVGElement was created.
     *
     * Resetting the root element on a chart outside of dc internals may have
     * unexpected consequences.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement | HTMLElement}
     *
     * @category Ninja
     */
    public root(): Selection<Element, any, any, any>;
    public root(rootElement: Selection<Element, any, any, any>): this;
    public root(rootElement?) {
        if (!arguments.length) {
            return this._root;
        }
        this._root = rootElement;
        return this;
    }

    /**
     * Returns the top SVGElement for this specific chart.
     *
     * Usually generating an SVG Element is handled handled by dc internally.
     * The {@link BubbleOverlay}, however, needs an SVG Element to be passed explicitly.
     *
     * Resetting the SVGElement on a chart outside
     * of dc internals may have unexpected consequences.
     *
     * @category Ninja
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/SVGElement | SVGElement}
     */
    public svg(): Selection<SVGElement, any, any, any>;
    public svg(svgElement): this;
    public svg(svgElement?) {
        if (!arguments.length) {
            return this._svg;
        }
        this._svg = svgElement;
        return this;
    }

    /**
     * Remove the chart's SVGElements from the dom and recreate the container SVGElement.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/SVGElement | SVGElement}
     *
     * @hidden
     */
    protected resetSvg(): Selection<SVGElement, any, any, any> {
        this.select('svg').remove();
        return this.generateSvg();
    }

    /**
     * @hidden
     */
    protected sizeSvg(): void {
        if (this._svg) {
            if (!this._conf.useViewBoxResizing) {
                this._svg.attr('width', this.width()).attr('height', this.height());
            } else if (!this._svg.attr('viewBox')) {
                this._svg.attr('viewBox', `0 0 ${this.width()} ${this.height()}`);
            }
        }
    }

    /**
     * @hidden
     */
    protected generateSvg(): Selection<SVGElement, any, any, any> {
        this._svg = this.root().append('svg');
        this.sizeSvg();
        return this._svg;
    }

    /**
     * Turn on optional control elements within the root element. dc currently supports the
     * following html control elements.
     * * root.selectAll('.reset') - elements are turned on if the chart has an active filter. This type
     * of control element is usually used to store a reset link to allow user to reset filter on a
     * certain chart. This element will be turned off automatically if the filter is cleared.
     * * root.selectAll('.filter') elements are turned on if the chart has an active filter. The text
     * content of this element is then replaced with the current filter value using the filter printer
     * function. This type of element will be turned off automatically if the filter is cleared.
     *
     * @see {@link turnOffControls}
     * @category Intermediate
     */
    public turnOnControls(): this {
        if (this._root) {
            const attribute = this._conf.controlsUseVisibility ? 'visibility' : 'display';
            this.selectAll('.reset').style(attribute, null);
            this.selectAll('.filter')
                .text(this._conf.filterPrinter(this.filters()))
                .style(attribute, null);
        }
        return this;
    }

    /**
     * Turn off optional control elements within the root element.
     *
     * @see {@link turnOnControls}
     * @category Intermediate
     */
    public turnOffControls(): this {
        if (this._root) {
            const attribute = this._conf.controlsUseVisibility ? 'visibility' : 'display';
            const value = this._conf.controlsUseVisibility ? 'hidden' : 'none';
            this.selectAll('.reset').style(attribute, value);
            this.selectAll('.filter').style(attribute, value).text(this.filter());
        }
        return this;
    }

    /**
     * @hidden
     */
    protected _mandatoryAttributes(): string[];
    /**
     * @hidden
     */
    protected _mandatoryAttributes(_: string[]): this;
    /**
     * @hidden
     */
    protected _mandatoryAttributes(_?) {
        if (!arguments.length) {
            return this._mandatoryAttributesList;
        }
        this._mandatoryAttributesList = _;
        return this;
    }

    /**
     * @hidden
     */
    protected checkForMandatoryAttributes(a): void {
        if (!this[a] || !this[a]()) {
            throw new InvalidStateException(
                `Mandatory attribute chart.${a} is missing on chart[#${this.anchorName()}]`
            );
        }
    }

    /**
     * Invoking this method will force the chart to re-render everything from scratch. Generally it
     * should only be used to render the chart for the first time on the page or if you want to make
     * sure everything is redrawn from scratch instead of relying on the default incremental redrawing
     * behaviour.
     *
     * Typically you would invoke {@link renderGroup} which will redraw all charts within the {@link chartGroup}.
     */
    public render(): this {
        // the HTML element
        const elem = this.root() && this.root().node();

        // if there is a root HTML element, calculate initial size
        if (elem) {
            let { width, height } = this._calculateSize(elem);

            this._calculatedWidth = width;
            this._calculatedHeight = height;
        }

        this._listeners.call('preRender', this, this);

        // if (this._mandatoryAttributesList) {
        //     this._mandatoryAttributesList.forEach(e => this.checkForMandatoryAttributes(e));
        // }

        this._doRender();

        if (this._legend) {
            this._legend.render();
        }

        this._activateRenderlets('postRender');
        this._registerResizeObserver(elem);

        return this;
    }

    private _calculateSize(elem: Element) {
        const rect = elem.getBoundingClientRect();
        const cs = getComputedStyle(elem);

        const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

        const borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
        const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

        const width = rect.width - paddingX - borderX;
        const height = rect.height - paddingY - borderY;

        return this.onResize({ width, height });
    }

    private _registerResizeObserver(elem: Element) {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }

        let firstTime = true;

        if (elem) {
            // If both width and height have been explicitly specified, do not install
            // the resizeObserver
            if (!isNumber(this.conf().width) || !isNumber(this.conf().height)) {
                this._resizeObserver = new ResizeObserver(entries => {
                    // It is called just after we start observing, ignore the first call
                    if (firstTime) {
                        firstTime = false;
                    } else {
                        const rect = this.onResize(entries[0].contentRect);
                        this.handleResize(rect);
                    }
                });

                this._resizeObserver.observe(elem);
            }
        }
    }

    /**
     * It needs to be public as it is used by Composite Charts
     * @hidden
     */
    public _activateRenderlets(event?): void {
        this._listeners.call('pretransition', this, this);
        if (this._conf.transitionDuration > 0 && this._svg) {
            this._svg
                .transition()
                .duration(this._conf.transitionDuration)
                .delay(this._conf.transitionDelay)
                .on('end', () => {
                    this._listeners.call('renderlet', this, this);
                    if (event) {
                        this._listeners.call(event, this, this);
                    }
                });
        } else {
            this._listeners.call('renderlet', this, this);
            if (event) {
                this._listeners.call(event, this, this);
            }
        }
    }

    /**
     * Calling redraw will cause the chart to re-render data changes incrementally. If there is no
     * change in the underlying data dimension then calling this method will have no effect on the
     * chart. Most chart interaction in dc will automatically trigger this method through internal
     * events; therefore, you only need to
     * manually invoke this function if data is manipulated outside of dc's control (for example if
     * data is loaded in the background using
     * {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#crossfilter_add | crossfilter.add}).
     *
     * Typically you would invoke {@link redrawGroup} which will redraw all charts within the {@link chartGroup}.
     */
    public redraw(): this {
        this.sizeSvg();
        this._listeners.call('preRedraw', this, this);

        const result = this._doRedraw();

        if (this._legend) {
            this._legend.render();
        }

        this._activateRenderlets('postRedraw');

        return result;
    }

    /**
     * Redraw all charts in the same group as this chart, typically in reaction to a filter
     * change. If the chart has a {@link IBaseMixinConf.commitHandler commitHandler}, it will
     * be executed and waited for. It internally calls {@link ChartGroup.redrawAll}
     *
     * @see {@link redraw}
     * @see {@link chartGroup}
     */
    public redrawGroup(): this {
        if (this._conf.commitHandler) {
            this._conf.commitHandler(false, (error, result) => {
                if (error) {
                    console.log(error);
                } else {
                    this.chartGroup().redrawAll();
                }
            });
        } else {
            this.chartGroup().redrawAll();
        }
        return this;
    }

    /**
     * Renders all charts in the same group as this chart. If the chart has a
     * {@link IBaseMixinConf.commitHandler commitHandler}, it will be executed and waited for.
     * It internally calls {@link ChartGroup.redrawAll}
     *
     * @see {@link render}
     * @see {@link chartGroup}
     */
    public renderGroup(): this {
        if (this._conf.commitHandler) {
            this._conf.commitHandler(false, (error, result) => {
                if (error) {
                    console.log(error);
                } else {
                    this.chartGroup().renderAll();
                }
            });
        } else {
            this.chartGroup().renderAll();
        }
        return this;
    }

    /**
     * @hidden
     */
    protected _invokeFilteredListener(f): void {
        if (f !== undefined) {
            this._listeners.call('filtered', this, this, f);
        }
    }

    /**
     * @hidden
     */
    protected _invokeZoomedListener(): void {
        this._listeners.call('zoomed', this, this);
    }

    /**
     * Check whether any active filter or a specific filter is associated with particular chart instance.
     * This function is **not chainable**.
     *
     * Starting version 5, filtering is provided by DataProvider.
     *
     * @see {@link CFSimpleAdapter.hasFilter}.
     * @category Intermediate
     */
    public hasFilter(filter?): boolean {
        return this._dataProvider.hasFilter(filter);
    }

    /**
     * Replace the chart filter. This is equivalent to calling `chart.filter(null).filter(filter)`
     * but more efficient because the filter is only applied once.
     *
     * Starting version 5, filtering is provided by DataProvider.
     *
     * @see {@link CFSimpleAdapter.resetFilters}.
     * @category Intermediate
     */
    public replaceFilter(filter): this {
        // The following call resets the filters without actually applying those
        this._dataProvider.resetFilters();

        this.filter(filter);
        return this;
    }

    /**
     * Filter the chart by the given parameter, or return the current filter if no input parameter
     * is given.
     *
     * Starting version 5, filtering is provided by DataProvider.
     *
     * @see {@link CFSimpleAdapter.filter}.
     * @category Intermediate
     */
    public filter();
    public filter(filter): this;
    public filter(filter?) {
        if (!arguments.length) {
            return this._dataProvider.filter();
        }
        this._dataProvider.filter(filter);

        return this;
    }

    /**
     * TODO check if it can be made private
     *
     * @hidden
     */
    protected _filtersChanged(filters) {
        this._invokeFilteredListener(filters);

        if (this._root !== null && this.hasFilter()) {
            this.turnOnControls();
        } else {
            this.turnOffControls();
        }
    }

    /**
     * Returns all current filters. This method does not perform defensive cloning of the internal
     * filter array before returning, therefore any modification of the returned array will effect the
     * chart's internal filter storage.
     *
     * Starting version 5, filtering is provided by DataProvider.
     *
     * @see {@link CFSimpleAdapter.filters}.
     * @category Intermediate
     */
    public filters() {
        return this._dataProvider.filters;
    }

    /**
     * @hidden
     */
    public highlightSelected(e): void {
        select(e).classed(constants.SELECTED_CLASS, true);
        select(e).classed(constants.DESELECTED_CLASS, false);
    }

    /**
     * @hidden
     */
    public fadeDeselected(e): void {
        select(e).classed(constants.SELECTED_CLASS, false);
        select(e).classed(constants.DESELECTED_CLASS, true);
    }

    /**
     * @hidden
     */
    public resetHighlight(e): void {
        select(e).classed(constants.SELECTED_CLASS, false);
        select(e).classed(constants.DESELECTED_CLASS, false);
    }

    /**
     * This function is passed to d3 as the onClick handler for each chart. The default behavior is to
     * filter on the clicked datum (passed to the callback) and redraw the chart group.
     *
     * This function can be replaced in order to change the click behavior (but first look at
     * @example
     * ```
     * const oldHandler = chart.onClick;
     * chart.onClick = function(datum) {
     *   // use datum.
     * }
     * ```
     *
     * @category Ninja
     */
    public onClick(datum: any, i?: number): void {
        const filter = this._conf.keyAccessor(datum);
        events.trigger(() => {
            this.filter(filter);
            this.redrawGroup();
        });
    }

    /**
     * abstract function stub
     *
     * @hidden
     */
    protected _doRender(): this {
        // do nothing in base, should be overridden by sub-function
        return this;
    }

    /**
     * abstract function stub
     *
     * @hidden
     */
    protected _doRedraw(): this {
        // do nothing in base, should be overridden by sub-function
        return this;
    }

    /**
     * List of items that will show as legends.
     * The charts implement this method.
     *
     * @category Ninja
     */
    public legendables(): LegendItem[] {
        // do nothing in base, should be overridden by sub-function
        return [];
    }

    /**
     * Need to be public as legend methods are used by Composite Charts
     *
     * @hidden
     */
    public legendHighlight(d?: LegendItem) {
        // do nothing in base, should be overridden by sub-function
    }

    /**
     * Need to be public as legend methods are used by Composite Charts
     *
     * @hidden
     */
    public legendReset(d?: LegendItem) {
        // do nothing in base, should be overridden by sub-function
    }

    /**
     * Need to be public as legend methods are used by Composite Charts
     *
     * @hidden
     */
    public legendToggle(d?: LegendItem) {
        // do nothing in base, should be overriden by sub-function
    }

    /**
     * Need to be public as legend methods are used by Composite Charts
     *
     * @hidden
     */
    public isLegendableHidden(d?: LegendItem): boolean {
        // do nothing in base, should be overridden by sub-function
        return false;
    }

    /**
     * Chart groups are rendered or redrawn
     * together since it is expected they share the same underlying data set.
     *
     * chartGroup is passed to teh chart constructor.
     * Setting it directly can have unintended consequences.
     */
    public chartGroup(): IChartGroup;
    public chartGroup(chartGroup: ChartGroupType): this;
    public chartGroup(chartGroup?) {
        if (!arguments.length) {
            return this._chartGroup;
        }
        if (!this._isChild) {
            this._chartGroup.deregister(this);
        }
        this._chartGroup = this._getChartGroup(chartGroup);
        if (!this._isChild) {
            this._chartGroup.register(this);
        }
        return this;
    }

    /**
     * Expire the internal chart cache. dc charts cache some data internally on a per chart basis to
     * speed up rendering and avoid unnecessary calculation; however it might be useful to clear the
     * cache if you have changed state which will affect rendering.  For example, if you invoke
     * {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#crossfilter_add | crossfilter.add}
     * function or reset group or dimension after rendering, it is a good idea to
     * clear the cache to make sure charts are rendered properly.
     *
     * TODO determine if it can be removed, does not seem to be used
     * @category Ninja
     */
    protected expireCache(): this {
        // do nothing in base, should be overridden by sub-function
        return this;
    }

    /**
     * Attach a Legend widget to this chart. The legend widget will automatically draw legend labels
     * based on the color setting and names associated with each group.
     *
     * @example
     * ```
     * chart.legend(new Legend().x(400).y(10).itemHeight(13).gap(5))
     * ```
     */
    public legend();
    public legend(legend): this;
    public legend(legend?) {
        if (!arguments.length) {
            return this._legend;
        }
        this._legend = legend;
        this._legend.parent(this);
        return this;
    }

    /**
     * Returns the internal numeric ID of the chart.
     *
     * @category Intermediate
     */
    public chartID(): string {
        return this.__dcFlag__;
    }

    /**
     * Set chart options using a configuration object. Each key in the object will cause the method of
     * the same name to be called with the value to set that attribute for the chart.
     * TODO: With concept of conf, this is less relevant now, consider moving it to compat.
     * @example
     * ```
     * chart.options({dimension: myDimension, group: myGroup});
     * ```
     * @category Ninja
     */
    public options(opts) {
        const applyOptions = [
            'anchor',
            'group',
            'xAxisLabel',
            'yAxisLabel',
            'stack',
            'title',
            'point',
            'getColor',
            'overlayGeoJson',
        ];

        for (const o in opts) {
            if (typeof this[o] === 'function') {
                if (opts[o] instanceof Array && applyOptions.indexOf(o) !== -1) {
                    this[o].apply(this, opts[o]);
                } else {
                    this[o].call(this, opts[o]);
                }
            } else {
                logger.debug(`Not a valid option setter name: ${o}`);
            }
        }
        return this;
    }

    /**
     * All dc chart instance supports the following listeners.
     * Supports the following events:
     * * `renderlet` - This listener function will be invoked after transitions after redraw and render. Replaces the
     * deprecated {@link renderlet} method.
     * * `pretransition` - Like `.on('renderlet', ...)` but the event is fired before transitions start.
     * * `preRender` - This listener function will be invoked before chart rendering.
     * * `postRender` - This listener function will be invoked after chart finish rendering including
     * all renderlets' logic.
     * * `preRedraw` - This listener function will be invoked before chart redrawing.
     * * `postRedraw` - This listener function will be invoked after chart finish redrawing
     * including all renderlets' logic.
     * * `filtered` - This listener function will be invoked after a filter is applied, added or removed.
     * * `zoomed` - This listener function will be invoked after a zoom is triggered.
     * @see {@link https://github.com/d3/d3-dispatch/blob/master/README.md#dispatch_on | d3.dispatch.on}
     * @example
     * ```
     * .on('renderlet', function(chart, filter){...})
     * .on('pretransition', function(chart, filter){...})
     * .on('preRender', function(chart){...})
     * .on('postRender', function(chart){...})
     * .on('preRedraw', function(chart){...})
     * .on('postRedraw', function(chart){...})
     * .on('filtered', function(chart, filter){...})
     * .on('zoomed', function(chart, filter){...})
     * ```
     * @category Intermediate
     */
    public on(event, listener): this {
        this._listeners.on(event, listener);
        return this;
    }

    /**
     * Execute the callback without transitions.
     * Internally it sets {@link IBaseMixinConf.transitionDuration} to 0 and restores it after
     * the `callback()`.
     */
    public withoutTransitions(callback) {
        const oldVal = this.conf().transitionDuration;
        this.configure({ transitionDuration: 0 });
        callback();
        this.configure({ transitionDuration: oldVal });
    }

    /**
     * A renderlet is similar to an event listener on rendering event. Multiple renderlets can be added
     * to an individual chart.  Each time a chart is rerendered or redrawn the renderlets are invoked
     * right after the chart finishes its transitions, giving you a way to modify the SVGElements.
     * Renderlet functions take the chart instance as the only input parameter and you can
     * use the dc API or use raw d3 to achieve pretty much any effect.
     *
     * Use {@link on} with a 'renderlet' prefix.
     * Generates a random key for the renderlet, which makes it hard to remove.
     * @deprecated chart.renderlet has been deprecated. Please use chart.on("renderlet.<renderletKey>", renderletFunction)
     * @example
     * ```
     * // do this instead of .renderlet(function(chart) { ... })
     * chart.on("renderlet", function(chart){
     *     // mix of dc API and d3 manipulation
     *     chart.select('g.y').style('display', 'none');
     *     // its a closure so you can also access other chart variable available in the closure scope
     *     moveChart.filter(chart.filter());
     * });
     * ```
     *
     * TODO move to compat
     */
    public renderlet(renderletFunction): this {
        logger.warnOnce(
            'chart.renderlet has been deprecated. Please use chart.on("renderlet.<renderletKey>", renderletFunction)'
        );
        this.on(`renderlet.${uniqueId()}`, renderletFunction);
        return this;
    }
}
