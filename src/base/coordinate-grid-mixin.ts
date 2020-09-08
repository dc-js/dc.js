import { schemeCategory10 } from 'd3-scale-chromatic';
import { timeDay } from 'd3-time';
import { max, min } from 'd3-array';
import { scaleBand, scaleLinear } from 'd3-scale';
import { Axis, axisBottom, axisLeft, axisRight } from 'd3-axis';
import { zoom, ZoomBehavior, zoomIdentity, ZoomTransform } from 'd3-zoom';
import { BrushBehavior, brushX } from 'd3-brush';
import { Selection } from 'd3-selection';

import { ColorMixin } from './color-mixin';
import { MarginMixin } from './margin-mixin';
import { optionalTransition, transition } from '../core/core';
import { units } from '../core/units';
import { constants } from '../core/constants';
import { add, appendOrSelect, arraysEqual, subtract } from '../core/utils';
import { logger } from '../core/logger';
import { filters } from '../core/filters';
import { events } from '../core/events';
import { DCBrushSelection, MinimalXYScale, SVGGElementSelection } from '../core/types';
import { ICoordinateGridMixinConf } from './i-coordinate-grid-mixin-conf';
import { OrdinalColors } from './colors/ordinal-colors';
import { adaptHandler } from '../core/d3compat';

const GRID_LINE_CLASS = 'grid-line';
const HORIZONTAL_CLASS = 'horizontal';
const VERTICAL_CLASS = 'vertical';
const Y_AXIS_LABEL_CLASS = 'y-axis-label';
const X_AXIS_LABEL_CLASS = 'x-axis-label';
const CUSTOM_BRUSH_HANDLE_CLASS = 'custom-brush-handle';
const DEFAULT_AXIS_LABEL_PADDING = 12;

/**
 * Coordinate Grid is an abstract base chart designed to support a number of coordinate grid based
 * concrete chart types, e.g. bar chart, line chart, and bubble chart.
 * @mixin CoordinateGridMixin
 * @mixes ColorMixin
 * @mixes MarginMixin
 */
export class CoordinateGridMixin extends ColorMixin(MarginMixin) {
    public _conf: ICoordinateGridMixinConf;

    private _parent: Selection<SVGElement, any, any, any>;
    private _g: SVGGElementSelection;
    private _chartBodyG: SVGGElementSelection;
    private _x: MinimalXYScale;
    private _origX: MinimalXYScale;
    private _xOriginalDomain: [number, number];
    private _xAxis: Axis<any>; // TODO: can we do better
    private _xAxisLabel: string;
    private _xAxisLabelPadding: number;
    private _lastXDomain: [number, number];
    private _y: MinimalXYScale;
    private _yAxis: Axis<any>; // TODO: can we do better
    private _yAxisLabel: string;
    private _yAxisLabelPadding: number;
    private _brush: BrushBehavior<unknown>;
    private _gBrush: SVGGElementSelection;
    private _brushOn: boolean;
    private _parentBrushOn: boolean;
    protected _ignoreBrushEvents: boolean; // needed by ScatterPlot
    private _resizing: boolean;
    private _unitCount: number;
    private _zoom: ZoomBehavior<Element, unknown>;
    private _nullZoom: ZoomBehavior<Element, unknown>;
    private _hasBeenMouseZoomable: boolean;
    private _ignoreZoomEvents: boolean;
    private _rangeChart: CoordinateGridMixin;
    private _focusChart: CoordinateGridMixin;
    private _fOuterRangeBandPadding: number;
    private _fRangeBandPadding: number;

    constructor() {
        super();

        this.colorHelper(
            new OrdinalColors({ colors: schemeCategory10, colorAccessor: this._conf.colorAccessor })
        );
        this._mandatoryAttributes().push('x');
        this._parent = undefined;
        this._g = undefined;
        this._chartBodyG = undefined;

        this.configure({
            xUnits: units.integers,
            xAxisPadding: 0,
            xAxisPaddingUnit: timeDay,
            elasticX: false,
            yAxisPadding: 0,
            elasticY: false,
            round: undefined,
            renderHorizontalGridLine: false,
            renderVerticalGridLines: false,
            zoomScale: [1, Infinity],
            zoomOutRestrict: true,
            mouseZoomable: false,
            clipPadding: 0,
            useRightYAxis: false,
        });

        this._x = undefined;
        this._origX = undefined; // Will hold original scale in case of zoom
        this._xOriginalDomain = undefined;
        this._xAxis = axisBottom(undefined);
        // TODO: xAxisLabel and xAxisLabelPadding are linked to the same function, in addition the call updates margins
        // TODO: recheck in next iteration
        this._xAxisLabel = undefined;
        this._xAxisLabelPadding = 0;

        this._lastXDomain = undefined;

        this._y = undefined;
        this._yAxis = null;

        // TODO: see remarks for xAxisLabel and xAxisLabelPadding
        this._yAxisLabel = undefined;
        this._yAxisLabelPadding = 0;

        this._brush = brushX();

        this._gBrush = undefined;
        this._brushOn = true; // Can not be moved to conf, gets reassigned within dc code
        this._parentBrushOn = false;
        this._ignoreBrushEvents = false; // ignore when carrying out programmatic brush operations

        this._resizing = false;
        this._unitCount = undefined;

        this._zoom = zoom().on(
            'zoom',
            adaptHandler((d, evt) => this._onZoom(evt))
        );
        this._nullZoom = zoom().on('zoom', null);
        this._hasBeenMouseZoomable = false;
        this._ignoreZoomEvents = false; // ignore when carrying out programmatic zoom operations

        this._rangeChart = undefined;
        this._focusChart = undefined;

        // TODO: These two parameters have been exposed differently in BarChart and BoxPlot. In addition _gap in BoxPlot
        // TODO: also interact with these. Need to change consistently
        this._fOuterRangeBandPadding = 0.5;
        this._fRangeBandPadding = 0;
    }

    public configure(conf: ICoordinateGridMixinConf): this {
        super.configure(conf);
        return this;
    }

    public conf(): ICoordinateGridMixinConf {
        return this._conf;
    }

    /**
     * When changing the domain of the x or y scale, it is necessary to tell the chart to recalculate
     * and redraw the axes. (`.rescale()` is called automatically when the x or y scale is replaced
     * with {@link CoordinateGridMixin+x .x()} or {@link CoordinateGridMixin#y .y()}, and has
     * no effect on elastic scales.)
     * @returns {CoordinateGridMixin}
     */
    public rescale(): this {
        this._unitCount = undefined;
        this._resizing = true;
        return this;
    }

    public resizing(): boolean;
    public resizing(resizing: boolean): this;
    public resizing(resizing?) {
        if (!arguments.length) {
            return this._resizing;
        }
        this._resizing = resizing;
        return this;
    }

    /**
     * Get or set the range selection chart associated with this instance. Setting the range selection
     * chart using this function will automatically update its selection brush when the current chart
     * zooms in. In return the given range chart will also automatically attach this chart as its focus
     * chart hence zoom in when range brush updates.
     *
     * Usually the range and focus charts will share a dimension. The range chart will set the zoom
     * boundaries for the focus chart, so its dimension values must be compatible with the domain of
     * the focus chart.
     *
     * See the [Nasdaq 100 Index](http://dc-js.github.com/dc.js/) example for this effect in action.
     * @param {CoordinateGridMixin} [rangeChart]
     * @returns {CoordinateGridMixin}
     */
    public rangeChart(): CoordinateGridMixin;
    public rangeChart(rangeChart: CoordinateGridMixin): this;
    public rangeChart(rangeChart?) {
        if (!arguments.length) {
            return this._rangeChart;
        }
        this._rangeChart = rangeChart;
        this._rangeChart.focusChart(this);
        return this;
    }

    public _generateG(parent?: Selection<SVGElement, any, any, any>): SVGGElementSelection {
        if (parent === undefined) {
            this._parent = this.svg();
        } else {
            this._parent = parent;
        }

        const href = window.location.href.split('#')[0];

        this._g = this._parent.append('g');

        this._chartBodyG = this._g
            .append('g')
            .attr('class', 'chart-body')
            .attr('transform', `translate(${this.margins().left}, ${this.margins().top})`)
            .attr('clip-path', `url(${href}#${this._getClipPathId()})`);

        return this._g;
    }

    /**
     * Get or set the root g element. This method is usually used to retrieve the g element in order to
     * overlay custom svg drawing programatically. **Caution**: The root g element is usually generated
     * by dc.js internals, and resetting it might produce unpredictable result.
     * @param {SVGElement} [gElement]
     * @returns {SVGElement|CoordinateGridMixin}
     */
    public g(): SVGGElementSelection;
    public g(gElement: SVGGElementSelection): this;
    public g(gElement?) {
        if (!arguments.length) {
            return this._g;
        }
        this._g = gElement;
        return this;
    }

    /**
     * Retrieve the svg group for the chart body.
     * @param {SVGElement} [chartBodyG]
     * @returns {SVGElement}
     */
    public chartBodyG(); // TODO: figure out correct type
    public chartBodyG(chartBodyG): this;
    public chartBodyG(chartBodyG?) {
        if (!arguments.length) {
            return this._chartBodyG;
        }
        this._chartBodyG = chartBodyG;
        return this;
    }

    /**
     * **mandatory**
     *
     * Get or set the x scale. The x scale can be any d3
     * {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale} or
     * {@link https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales ordinal scale}
     * @see {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale}
     * @example
     * // set x to a linear scale
     * chart.x(d3.scaleLinear().domain([-2500, 2500]))
     * // set x to a time scale to generate histogram
     * chart.x(d3.scaleTime().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)]))
     * @param {d3.scale} [xScale]
     * @returns {d3.scale|CoordinateGridMixin}
     */
    public x(): MinimalXYScale;
    public x(xScale: MinimalXYScale): this;
    public x(xScale?) {
        if (!arguments.length) {
            return this._x;
        }
        this._x = xScale;
        this._xOriginalDomain = this._x.domain();
        this.rescale();
        return this;
    }

    public xOriginalDomain(): [number, number] {
        return this._xOriginalDomain;
    }

    /**
     * Set or get the x axis used by a particular coordinate grid chart instance. This function is most
     * useful when x axis customization is required. The x axis in dc.js is an instance of a
     * {@link https://github.com/d3/d3-axis/blob/master/README.md#axisBottom d3 bottom axis object};
     * therefore it supports any valid d3 axisBottom manipulation.
     *
     * **Caution**: The x axis is usually generated internally by dc; resetting it may cause
     * unexpected results. Note also that when used as a getter, this function is not chainable:
     * it returns the axis, not the chart,
     * {@link https://github.com/dc-js/dc.js/wiki/FAQ#why-does-everything-break-after-a-call-to-xaxis-or-yaxis
     * so attempting to call chart functions after calling `.xAxis()` will fail}.
     * @see {@link https://github.com/d3/d3-axis/blob/master/README.md#axisBottom d3.axisBottom}
     * @example
     * // customize x axis tick format
     * chart.xAxis().tickFormat(function(v) {return v + '%';});
     * // customize x axis tick values
     * chart.xAxis().tickValues([0, 100, 200, 300]);
     * @param {d3.axis} [xAxis=d3.axisBottom()]
     * @returns {d3.axis|CoordinateGridMixin}
     */
    public xAxis(): Axis<any>;
    public xAxis(xAxis: Axis<any>): this;
    public xAxis(xAxis?) {
        if (!arguments.length) {
            return this._xAxis;
        }
        this._xAxis = xAxis;
        return this;
    }

    /**
     * Returns the number of units displayed on the x axis. If the x axis is ordinal (`xUnits` is
     * `units.ordinal`), this is the number of items in the domain of the x scale. Otherwise, the
     * x unit count is calculated using the {@link CoordinateGridMixin#xUnits xUnits} function.
     * @returns {Number}
     */
    public xUnitCount() {
        if (this._unitCount === undefined) {
            if (this.isOrdinal()) {
                // In this case it number of items in domain
                this._unitCount = this.x().domain().length;
            } else {
                const [first, second] = this.x().domain();
                const unitCount = this._conf.xUnits(first, second);

                // Sometimes xUnits() may return an array while sometimes directly the count
                this._unitCount = unitCount instanceof Array ? unitCount.length : unitCount;
            }
        }

        return this._unitCount;
    }

    /**
     * Returns true if the chart is using ordinal xUnits ({@link units.ordinal units.ordinal}, or false
     * otherwise. Most charts behave differently with ordinal data and use the result of this method to
     * trigger the appropriate logic.
     * @returns {Boolean}
     */
    public isOrdinal(): boolean {
        return this._conf.xUnits === units.ordinal;
    }

    public _useOuterPadding(): boolean {
        return true;
    }

    public _ordinalXDomain(): any[] {
        const groups = this._computeOrderedGroups(this.data());
        return groups.map(this._conf.keyAccessor);
    }

    public _prepareXAxis(g: SVGGElementSelection, render: boolean) {
        if (!this.isOrdinal()) {
            if (this._conf.elasticX) {
                this._x.domain([this.xAxisMin(), this.xAxisMax()]);
            }
        } else {
            // self._chart.isOrdinal()
            // D3v4 - Ordinal charts would need scaleBand
            // bandwidth is a method in scaleBand
            // (https://github.com/d3/d3-scale/blob/master/README.md#scaleBand)
            if (!this._x.bandwidth) {
                // If self._x is not a scaleBand create a new scale and
                // copy the original domain to the new scale
                logger.warn(
                    'For compatibility with d3v4+, dc.js d3.0 ordinal bar/line/bubble charts need ' +
                        'd3.scaleBand() for the x scale, instead of d3.scaleOrdinal(). ' +
                        'Replacing .x() with a d3.scaleBand with the same domain - ' +
                        'make the same change in your code to avoid this warning!'
                );
                this._x = scaleBand().domain(this._x.domain());
            }

            if (this._conf.elasticX || this._x.domain().length === 0) {
                this._x.domain(this._ordinalXDomain());
            }
        }

        // has the domain changed?
        const xdom = this._x.domain();
        if (render || !arraysEqual(this._lastXDomain, xdom)) {
            this.rescale();
        }
        this._lastXDomain = xdom;

        // please can't we always use rangeBands for bar charts?
        if (this.isOrdinal()) {
            this._x
                .range([0, this.xAxisLength()])
                .paddingInner(this._fRangeBandPadding)
                .paddingOuter(this._useOuterPadding() ? this._fOuterRangeBandPadding : 0);
        } else {
            this._x.range([0, this.xAxisLength()]);
        }

        this._xAxis = this._xAxis.scale(this.x());

        this._renderVerticalGridLines(g);
    }

    public renderXAxis(g: SVGGElementSelection): void {
        let axisXG = g.select('g.x');

        if (axisXG.empty()) {
            axisXG = g
                .append('g')
                .attr('class', 'axis x')
                .attr('transform', `translate(${this.margins().left},${this._xAxisY()})`);
        }

        let axisXLab = g.select(`text.${X_AXIS_LABEL_CLASS}`);
        if (axisXLab.empty() && this.xAxisLabel()) {
            axisXLab = g
                .append('text')
                .attr('class', X_AXIS_LABEL_CLASS)
                .attr(
                    'transform',
                    `translate(${this.margins().left + this.xAxisLength() / 2},${
                        this.height() - this._xAxisLabelPadding
                    })`
                )
                .attr('text-anchor', 'middle');
        }
        if (this.xAxisLabel() && axisXLab.text() !== this.xAxisLabel()) {
            axisXLab.text(this.xAxisLabel());
        }

        transition(axisXG, this._conf.transitionDuration, this._conf.transitionDelay)
            .attr('transform', `translate(${this.margins().left},${this._xAxisY()})`)
            .call(this._xAxis);
        transition(axisXLab, this._conf.transitionDuration, this._conf.transitionDelay).attr(
            'transform',
            `translate(${this.margins().left + this.xAxisLength() / 2},${
                this.height() - this._xAxisLabelPadding
            })`
        );
    }

    public _renderVerticalGridLines(g: SVGGElementSelection) {
        let gridLineG = g.select(`g.${VERTICAL_CLASS}`);

        if (this._conf.renderVerticalGridLines) {
            if (gridLineG.empty()) {
                gridLineG = g
                    .insert('g', ':first-child')
                    .attr('class', `${GRID_LINE_CLASS} ${VERTICAL_CLASS}`)
                    .attr('transform', `translate(${this.margins().left},${this.margins().top})`);
            }

            let ticks;
            if (this._xAxis.tickValues()) {
                ticks = this._xAxis.tickValues();
            } else if (typeof this._x.ticks === 'function') {
                ticks = this._x.ticks.apply(this._x, this._xAxis.tickArguments());
            } else {
                ticks = this._x.domain();
            }

            const lines = gridLineG.selectAll('line').data(ticks);

            // enter
            const linesGEnter = lines
                .enter()
                .append('line')
                .attr('x1', d => this._x(d))
                .attr('y1', this._xAxisY() - this.margins().top)
                .attr('x2', d => this._x(d))
                .attr('y2', 0)
                .attr('opacity', 0);
            transition(linesGEnter, this._conf.transitionDuration, this._conf.transitionDelay).attr(
                'opacity',
                0.5
            );

            // update
            transition(lines, this._conf.transitionDuration, this._conf.transitionDelay)
                .attr('x1', d => this._x(d))
                .attr('y1', this._xAxisY() - this.margins().top)
                .attr('x2', d => this._x(d))
                .attr('y2', 0);

            // exit
            lines.exit().remove();
        } else {
            gridLineG.selectAll('line').remove();
        }
    }

    private _xAxisY(): number {
        return this.height() - this.margins().bottom;
    }

    public xAxisLength(): number {
        return this.effectiveWidth();
    }

    /**
     * Set or get the x axis label. If setting the label, you may optionally include additional padding to
     * the margin to make room for the label. By default the padded is set to 12 to accommodate the text height.
     * @param {String} [labelText]
     * @param {Number} [padding=12]
     * @returns {String}
     */
    public xAxisLabel(): string;
    public xAxisLabel(labelText: string, padding?: number): this;
    public xAxisLabel(labelText?, padding?) {
        if (!arguments.length) {
            return this._xAxisLabel;
        }
        this._xAxisLabel = labelText;
        this.margins().bottom -= this._xAxisLabelPadding;
        this._xAxisLabelPadding = padding === undefined ? DEFAULT_AXIS_LABEL_PADDING : padding;
        this.margins().bottom += this._xAxisLabelPadding;
        return this;
    }

    public _createYAxis(): Axis<undefined> {
        return this._conf.useRightYAxis ? axisRight(undefined) : axisLeft(undefined);
    }

    public _prepareYAxis(g: SVGGElementSelection) {
        if (this._y === undefined || this._conf.elasticY) {
            if (this._y === undefined) {
                this._y = scaleLinear();
            }
            const _min = this.yAxisMin() || 0;
            const _max = this.yAxisMax() || 0;
            this._y.domain([_min, _max]).rangeRound([this.yAxisHeight(), 0]);
        }

        this._y.range([this.yAxisHeight(), 0]);

        if (!this._yAxis) {
            this._yAxis = this._createYAxis();
        }

        this._yAxis.scale(this._y);

        this._renderHorizontalGridLinesForAxis(g, this._y, this._yAxis);
    }

    public renderYAxisLabel(
        axisClass: string,
        text: string,
        rotation: number,
        labelXPosition?: number
    ): void {
        labelXPosition = labelXPosition || this._yAxisLabelPadding;

        let axisYLab = this.g().select(`text.${Y_AXIS_LABEL_CLASS}.${axisClass}-label`);
        const labelYPosition = this.margins().top + this.yAxisHeight() / 2;
        if (axisYLab.empty() && text) {
            axisYLab = this.g()
                .append('text')
                .attr(
                    'transform',
                    `translate(${labelXPosition},${labelYPosition}),rotate(${rotation})`
                )
                .attr('class', `${Y_AXIS_LABEL_CLASS} ${axisClass}-label`)
                .attr('text-anchor', 'middle')
                .text(text);
        }
        if (text && axisYLab.text() !== text) {
            axisYLab.text(text);
        }
        transition(axisYLab, this._conf.transitionDuration, this._conf.transitionDelay).attr(
            'transform',
            `translate(${labelXPosition},${labelYPosition}),rotate(${rotation})`
        );
    }

    public renderYAxisAt(axisClass: string, axis: Axis<any>, position: number): void {
        let axisYG: SVGGElementSelection = this.g().select(`g.${axisClass}`);
        if (axisYG.empty()) {
            axisYG = this.g()
                .append('g')
                .attr('class', `axis ${axisClass}`)
                .attr('transform', `translate(${position},${this.margins().top})`);
        }

        transition(axisYG, this._conf.transitionDuration, this._conf.transitionDelay)
            .attr('transform', `translate(${position},${this.margins().top})`)
            .call(axis);
    }

    public renderYAxis() {
        const axisPosition: number = this._conf.useRightYAxis
            ? this.width() - this.margins().right
            : this._yAxisX();
        this.renderYAxisAt('y', this._yAxis, axisPosition);
        const labelPosition: number = this._conf.useRightYAxis
            ? this.width() - this._yAxisLabelPadding
            : this._yAxisLabelPadding;
        const rotation: number = this._conf.useRightYAxis ? 90 : -90;
        this.renderYAxisLabel('y', this.yAxisLabel(), rotation, labelPosition);
    }

    public _renderHorizontalGridLinesForAxis(
        g: SVGGElementSelection,
        scale: MinimalXYScale,
        axis: Axis<any>
    ) {
        let gridLineG: SVGGElementSelection = g.select(`g.${HORIZONTAL_CLASS}`);

        if (this._conf.renderHorizontalGridLine) {
            // see https://github.com/d3/d3-axis/blob/master/src/axis.js#L48
            let ticks: any;
            if (axis.tickValues()) {
                ticks = axis.tickValues();
            } else if (scale.ticks) {
                ticks = scale.ticks.apply(scale, axis.tickArguments());
            } else {
                ticks = scale.domain();
            }

            if (gridLineG.empty()) {
                gridLineG = g
                    .insert('g', ':first-child')
                    .attr('class', `${GRID_LINE_CLASS} ${HORIZONTAL_CLASS}`)
                    .attr('transform', `translate(${this.margins().left},${this.margins().top})`);
            }

            const lines = gridLineG.selectAll('line').data(ticks);

            // enter
            const linesGEnter = lines
                .enter()
                .append('line')
                .attr('x1', 1)
                .attr('y1', d => scale(d))
                .attr('x2', this.xAxisLength())
                .attr('y2', d => scale(d))
                .attr('opacity', 0);
            transition(linesGEnter, this._conf.transitionDuration, this._conf.transitionDelay).attr(
                'opacity',
                0.5
            );

            // update
            transition(lines, this._conf.transitionDuration, this._conf.transitionDelay)
                .attr('x1', 1)
                .attr('y1', d => scale(d))
                .attr('x2', this.xAxisLength())
                .attr('y2', d => scale(d));

            // exit
            lines.exit().remove();
        } else {
            gridLineG.selectAll('line').remove();
        }
    }

    public _yAxisX(): number {
        return this._conf.useRightYAxis ? this.width() - this.margins().right : this.margins().left;
    }

    /**
     * Set or get the y axis label. If setting the label, you may optionally include additional padding
     * to the margin to make room for the label. By default the padding is set to 12 to accommodate the
     * text height.
     * @param {String} [labelText]
     * @param {Number} [padding=12]
     * @returns {String|CoordinateGridMixin}
     */
    public yAxisLabel(): string;
    public yAxisLabel(labelText: string, padding?: number): this;
    public yAxisLabel(labelText?, padding?) {
        if (!arguments.length) {
            return this._yAxisLabel;
        }
        this._yAxisLabel = labelText;
        this.margins().left -= this._yAxisLabelPadding;
        this._yAxisLabelPadding = padding === undefined ? DEFAULT_AXIS_LABEL_PADDING : padding;
        this.margins().left += this._yAxisLabelPadding;
        return this;
    }

    /**
     * Get or set the y scale. The y scale is typically automatically determined by the chart implementation.
     * @see {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale}
     * @param {d3.scale} [yScale]
     * @returns {d3.scale|CoordinateGridMixin}
     */
    public y(): MinimalXYScale;
    public y(yScale: MinimalXYScale): this;
    public y(yScale?) {
        if (!arguments.length) {
            return this._y;
        }
        this._y = yScale;
        this.rescale();
        return this;
    }

    /**
     * Set or get the y axis used by the coordinate grid chart instance. This function is most useful
     * when y axis customization is required. Depending on `useRightYAxis` the y axis in dc.js is an instance of
     * either [d3.axisLeft](https://github.com/d3/d3-axis/blob/master/README.md#axisLeft) or
     * [d3.axisRight](https://github.com/d3/d3-axis/blob/master/README.md#axisRight); therefore it supports any
     * valid d3 axis manipulation.
     *
     * **Caution**: The y axis is usually generated internally by dc; resetting it may cause
     * unexpected results.  Note also that when used as a getter, this function is not chainable: it
     * returns the axis, not the chart,
     * {@link https://github.com/dc-js/dc.js/wiki/FAQ#why-does-everything-break-after-a-call-to-xaxis-or-yaxis
     * so attempting to call chart functions after calling `.yAxis()` will fail}.
     * In addition, depending on whether you are going to use the axis on left or right
     * you need to appropriately pass [d3.axisLeft](https://github.com/d3/d3-axis/blob/master/README.md#axisLeft)
     * or [d3.axisRight](https://github.com/d3/d3-axis/blob/master/README.md#axisRight)
     * @see {@link https://github.com/d3/d3-axis/blob/master/README.md d3.axis}
     * @example
     * // customize y axis tick format
     * chart.yAxis().tickFormat(function(v) {return v + '%';});
     * // customize y axis tick values
     * chart.yAxis().tickValues([0, 100, 200, 300]);
     * @param {d3.axisLeft|d3.axisRight} [yAxis]
     * @returns {d3.axisLeft|d3.axisRight|CoordinateGridMixin}
     */
    public yAxis(): Axis<any>;
    public yAxis(yAxis: Axis<any>): this;
    public yAxis(yAxis?) {
        if (!arguments.length) {
            if (!this._yAxis) {
                this._yAxis = this._createYAxis();
            }
            return this._yAxis;
        }
        this._yAxis = yAxis;
        return this;
    }

    /**
     * Calculates the minimum x value to display in the chart. Includes xAxisPadding if set.
     * @returns {*}
     */
    public xAxisMin() {
        // TODO: can these be anything other than number and Date
        const m = min(this.data(), e => this._conf.keyAccessor(e));
        return subtract(m, this._conf.xAxisPadding, this._conf.xAxisPaddingUnit);
    }

    /**
     * Calculates the maximum x value to display in the chart. Includes xAxisPadding if set.
     * @returns {*}
     */
    public xAxisMax() {
        // TODO: can these be anything other than number and Date
        const m = max(this.data(), e => this._conf.keyAccessor(e));
        return add(m, this._conf.xAxisPadding, this._conf.xAxisPaddingUnit);
    }

    /**
     * Calculates the minimum y value to display in the chart. Includes yAxisPadding if set.
     * @returns {*}
     */
    public yAxisMin() {
        // TODO: can these be anything other than number
        // @ts-ignore
        const m = min(this.data(), e => e._value);
        return subtract(m, this._conf.yAxisPadding);
    }

    /**
     * Calculates the maximum y value to display in the chart. Includes yAxisPadding if set.
     * @returns {*}
     */
    public yAxisMax() {
        // TODO: can these be anything other than number
        // @ts-ignore
        const m = max(this.data(), e => e._value);
        return add(m, this._conf.yAxisPadding);
    }

    public yAxisHeight() {
        return this.effectiveHeight();
    }

    public _rangeBandPadding(): number;
    public _rangeBandPadding(_: number): this;
    public _rangeBandPadding(_?) {
        if (!arguments.length) {
            return this._fRangeBandPadding;
        }
        this._fRangeBandPadding = _;
        return this;
    }

    public _outerRangeBandPadding(): number;
    public _outerRangeBandPadding(_: number): this;
    public _outerRangeBandPadding(_?) {
        if (!arguments.length) {
            return this._fOuterRangeBandPadding;
        }
        this._fOuterRangeBandPadding = _;
        return this;
    }

    public filter();
    public filter(_): this;
    public filter(_?) {
        if (!arguments.length) {
            return super.filter();
        }

        super.filter(_);

        this.redrawBrush(_, false);

        return this;
    }

    /**
     * Get or set the brush. Brush must be an instance of d3 brushes
     * https://github.com/d3/d3-brush/blob/master/README.md
     * You will use this only if you are writing a new chart type that supports brushing.
     *
     * **Caution**: dc creates and manages brushes internally. Go through and understand the source code
     * if you want to pass a new brush object. Even if you are only using the getter,
     * the brush object may not behave the way you expect.
     *
     * @param {d3.brush} [_]
     * @returns {d3.brush|CoordinateGridMixin}
     */
    public brush();
    public brush(_): this;
    public brush(_?) {
        if (!arguments.length) {
            return this._brush;
        }
        this._brush = _;
        return this;
    }

    public renderBrush(g: SVGGElementSelection, doTransition: boolean) {
        if (this._brushOn) {
            this._brush.on(
                'start brush end',
                adaptHandler((d, evt) => this._brushing(evt))
            );

            // To retrieve selection we need self._gBrush
            this._gBrush = g
                .append('g')
                .attr('class', 'brush')
                .attr('transform', `translate(${this.margins().left},${this.margins().top})`);

            this.setBrushExtents(doTransition);

            this.createBrushHandlePaths(this._gBrush, doTransition);

            this.redrawBrush(this.filter(), doTransition);
        }
    }

    public createBrushHandlePaths(gBrush: SVGGElementSelection, doTransition: boolean) {
        let brushHandles: Selection<SVGPathElement, any, SVGGElement, any> = gBrush
            .selectAll<SVGPathElement, any>(`path.${CUSTOM_BRUSH_HANDLE_CLASS}`)
            .data([{ type: 'w' }, { type: 'e' }]);

        brushHandles = brushHandles
            .enter()
            .append('path')
            .attr('class', CUSTOM_BRUSH_HANDLE_CLASS)
            .merge(brushHandles);

        brushHandles.attr('d', d => this.resizeHandlePath(d));
    }

    public extendBrush(brushSelection: DCBrushSelection) {
        if (brushSelection && this._conf.round) {
            brushSelection[0] = this._conf.round(brushSelection[0]);
            brushSelection[1] = this._conf.round(brushSelection[1]);
        }
        return brushSelection;
    }

    public brushIsEmpty(brushSelection: DCBrushSelection) {
        return !brushSelection || brushSelection[1] <= brushSelection[0];
    }

    public _brushing(evt): void {
        if (this._ignoreBrushEvents) {
            return;
        }

        const rawBrushSelection = evt.selection;
        let brushSelection: DCBrushSelection;

        if (rawBrushSelection) {
            brushSelection = rawBrushSelection.map(this.x().invert);
        }

        brushSelection = this.extendBrush(brushSelection);

        this.redrawBrush(brushSelection, false);

        const rangedFilter = this.brushIsEmpty(brushSelection)
            ? null
            : filters.RangedFilter(brushSelection[0], brushSelection[1]);

        events.trigger(() => {
            this.applyBrushSelection(rangedFilter);
        }, constants.EVENT_DELAY);
    }

    // This can be overridden in a derived chart. For example Composite chart overrides it
    public applyBrushSelection(rangedFilter): void {
        this.replaceFilter(rangedFilter);
        this.redrawGroup();
    }

    protected _withoutBrushEvents(closure) {
        const oldValue = this._ignoreBrushEvents;
        this._ignoreBrushEvents = true;

        try {
            closure();
        } finally {
            this._ignoreBrushEvents = oldValue;
        }
    }

    public setBrushExtents(doTransition: boolean): void {
        this._withoutBrushEvents(() => {
            // Set boundaries of the brush, must set it before applying to self._gBrush
            this._brush.extent([
                [0, 0],
                [this.effectiveWidth(), this.effectiveHeight()],
            ]);
        });

        this._gBrush.call(this._brush);
    }

    public redrawBrush(brushSelection: DCBrushSelection, doTransition: boolean): void {
        if (this._brushOn && this._gBrush) {
            if (this._resizing) {
                this.setBrushExtents(doTransition);
            }

            if (!brushSelection) {
                this._withoutBrushEvents(() => {
                    this._gBrush.call(this._brush.move, null);
                });

                this._gBrush.selectAll(`path.${CUSTOM_BRUSH_HANDLE_CLASS}`).attr('display', 'none');
            } else {
                const scaledSelection = [this._x(brushSelection[0]), this._x(brushSelection[1])];

                const gBrush = optionalTransition(
                    doTransition,
                    this._conf.transitionDuration,
                    this._conf.transitionDelay
                )(this._gBrush);

                this._withoutBrushEvents(() => {
                    gBrush.call(this._brush.move, scaledSelection);
                });

                gBrush
                    .selectAll(`path.${CUSTOM_BRUSH_HANDLE_CLASS}`)
                    .attr('display', null)
                    .attr('transform', (d, i) => `translate(${this._x(brushSelection[i])}, 0)`)
                    .attr('d', d => this.resizeHandlePath(d));
            }
        }
        this.fadeDeselectedArea(brushSelection);
    }

    public fadeDeselectedArea(brushSelection: DCBrushSelection): void {
        // do nothing, sub-chart should override this function
    }

    // borrowed from Crossfilter example
    public resizeHandlePath(d): string {
        d = d.type;
        const e = +(d === 'e');
        const x = e ? 1 : -1;
        const y = this.effectiveHeight() / 3;

        // TODO: revisit to see if + can be omitted
        return (
            `M${0.5 * x},${y}A6,6 0 0 ${e} ${6.5 * x},${y + 6}V${2 * y - 6}A6,6 0 0 ${e} ${
                0.5 * x
            },${2 * y}Z` + `M${2.5 * x},${y + 8}V${2 * y - 8}M${4.5 * x},${y + 8}V${2 * y - 8}`
        );
    }

    public _getClipPathId(): string {
        return `${this.anchorName().replace(/[ .#=\[\]"]/g, '-')}-clip`;
    }

    public _generateClipPath(): void {
        const defs = appendOrSelect(this._parent, 'defs');
        // cannot select <clippath> elements; bug in WebKit, must select by id
        // https://groups.google.com/forum/#!topic/d3-js/6EpAzQ2gU9I
        const id = this._getClipPathId();
        const chartBodyClip = appendOrSelect(defs, `#${id}`, 'clipPath').attr('id', id);

        const padding = this._conf.clipPadding * 2;

        appendOrSelect(chartBodyClip, 'rect')
            .attr('width', this.xAxisLength() + padding)
            .attr('height', this.yAxisHeight() + padding)
            .attr('transform', `translate(-${this._conf.clipPadding}, -${this._conf.clipPadding})`);
    }

    protected _preprocessData(): void {}

    protected _doRender(): this {
        this.resetSvg();

        this._preprocessData();

        this._generateG();
        this._generateClipPath();

        this._drawChart(true);

        this._configureMouseZoom();

        return this;
    }

    protected _doRedraw(): this {
        this._preprocessData();

        this._drawChart(false);
        this._generateClipPath();

        return this;
    }

    public _drawChart(render: boolean): void {
        if (this.isOrdinal()) {
            this._brushOn = false;
        }

        this._prepareXAxis(this.g(), render);
        this._prepareYAxis(this.g());

        this.plotData();

        if (this._conf.elasticX || this._resizing || render) {
            this.renderXAxis(this.g());
        }

        if (this._conf.elasticY || this._resizing || render) {
            this.renderYAxis();
        }

        if (render) {
            this.renderBrush(this.g(), false);
        } else {
            // Animate the brush only while resizing
            this.redrawBrush(this.filter(), this._resizing);
        }
        this.fadeDeselectedArea(this.filter());
        this.resizing(false);
    }

    public plotData(): void {
        // To be implemented in derived class
        throw new Error('Method not implemented.');
    }

    public _configureMouseZoom(): void {
        // Save a copy of original x scale
        this._origX = this._x.copy();

        if (this._conf.mouseZoomable) {
            this._enableMouseZoom();
        } else if (this._hasBeenMouseZoomable) {
            this._disableMouseZoom();
        }
    }

    public _enableMouseZoom() {
        this._hasBeenMouseZoomable = true;

        const extent: [[number, number], [number, number]] = [
            [0, 0],
            [this.effectiveWidth(), this.effectiveHeight()],
        ];

        this._zoom
            .scaleExtent(this._conf.zoomScale)
            .extent(extent)
            .duration(this._conf.transitionDuration);

        if (this._conf.zoomOutRestrict) {
            // Ensure minimum zoomScale is at least 1
            const zoomScaleMin = Math.max(this._conf.zoomScale[0], 1);
            this._zoom.translateExtent(extent).scaleExtent([zoomScaleMin, this._conf.zoomScale[1]]);
        }

        this.root().call(this._zoom);

        // Tell D3 zoom our current zoom/pan status
        this._updateD3zoomTransform();
    }

    public _disableMouseZoom() {
        this.root().call(this._nullZoom);
    }

    public _zoomHandler(newDomain, noRaiseEvents: boolean) {
        let domFilter;

        if (this._hasRangeSelected(newDomain)) {
            this.x().domain(newDomain);
            domFilter = filters.RangedFilter(newDomain[0], newDomain[1]);
        } else {
            this.x().domain(this._xOriginalDomain);
            domFilter = null;
        }

        this.replaceFilter(domFilter);
        this.rescale();
        this.redraw();

        if (!noRaiseEvents) {
            if (this._rangeChart && !arraysEqual(this.filter(), this._rangeChart.filter())) {
                events.trigger(() => {
                    this._rangeChart.replaceFilter(domFilter);
                    this._rangeChart.redraw();
                });
            }

            this._invokeZoomedListener();
            events.trigger(() => {
                this.redrawGroup();
            }, constants.EVENT_DELAY);
        }
    }

    // event.transform.rescaleX(self._origX).domain() should give back newDomain
    public _domainToZoomTransform(newDomain, origDomain, xScale): ZoomTransform {
        const k = (origDomain[1] - origDomain[0]) / (newDomain[1] - newDomain[0]);
        const xt = -1 * xScale(newDomain[0]);

        return zoomIdentity.scale(k).translate(xt, 0);
    }

    // If we changing zoom status (for example by calling focus), tell D3 zoom about it
    public _updateD3zoomTransform(): void {
        if (this._zoom) {
            this._withoutZoomEvents(() => {
                this._zoom.transform(
                    this.root(),
                    this._domainToZoomTransform(
                        this.x().domain(),
                        this._xOriginalDomain,
                        this._origX
                    )
                );
            });
        }
    }

    protected _withoutZoomEvents(closure) {
        const oldValue = this._ignoreZoomEvents;
        this._ignoreZoomEvents = true;

        try {
            closure();
        } finally {
            this._ignoreZoomEvents = oldValue;
        }
    }

    public _onZoom(evt): void {
        // ignore zoom events if it was caused by a programmatic change
        if (this._ignoreZoomEvents) {
            return;
        }

        const newDomain = evt.transform.rescaleX(this._origX).domain();
        this.focus(newDomain, false);
    }

    // TODO: come back for return type, currently forced, but generics may help
    public _checkExtents(ext: DCBrushSelection, outerLimits: DCBrushSelection): DCBrushSelection {
        if (!ext || ext.length !== 2 || !outerLimits || outerLimits.length !== 2) {
            return ext;
        }

        if (ext[0] > outerLimits[1] || ext[1] < outerLimits[0]) {
            console.warn('Could not intersect extents, will reset');
        }
        // Math.max does not work (as the values may be dates as well)
        return [
            ext[0] > outerLimits[0] ? ext[0] : outerLimits[0],
            ext[1] < outerLimits[1] ? ext[1] : outerLimits[1],
        ] as DCBrushSelection;
    }

    /**
     * Zoom this chart to focus on the given range. The given range should be an array containing only
     * 2 elements (`[start, end]`) defining a range in the x domain. If the range is not given or set
     * to null, then the zoom will be reset. _For focus to work elasticX has to be turned off;
     * otherwise focus will be ignored.
     *
     * To avoid ping-pong volley of events between a pair of range and focus charts please set
     * `noRaiseEvents` to `true`. In that case it will update this chart but will not fire `zoom` event
     * and not try to update back the associated range chart.
     * If you are calling it manually - typically you will leave it to `false` (the default).
     *
     * @example
     * chart.on('renderlet', function(chart) {
     *     // smooth the rendering through event throttling
     *     events.trigger(function(){
     *          // focus some other chart to the range selected by user on this chart
     *          someOtherChart.focus(chart.filter());
     *     });
     * })
     * @param {Array<Number>} [range]
     * @param {Boolean} [noRaiseEvents = false]
     * @return {undefined}
     */
    public focus(range: DCBrushSelection, noRaiseEvents: boolean): void {
        if (this._conf.zoomOutRestrict) {
            // ensure range is within self._xOriginalDomain
            range = this._checkExtents(range, this._xOriginalDomain);

            // If it has an associated range chart ensure range is within domain of that rangeChart
            if (this._rangeChart) {
                range = this._checkExtents(range, this._rangeChart.x().domain());
            }
        }

        this._zoomHandler(range, noRaiseEvents);
        this._updateD3zoomTransform();
    }

    public refocused(): boolean {
        return !arraysEqual(this.x().domain(), this._xOriginalDomain);
    }

    public focusChart(): CoordinateGridMixin;
    public focusChart(c: CoordinateGridMixin): this;
    public focusChart(c?) {
        if (!arguments.length) {
            return this._focusChart;
        }
        this._focusChart = c;
        this.on('filtered.dcjs-range-chart', chart => {
            if (!chart.filter()) {
                events.trigger(() => {
                    this._focusChart.x().domain(this._focusChart.xOriginalDomain());
                });
            } else if (!arraysEqual(chart.filter(), this._focusChart.filter())) {
                events.trigger(() => {
                    this._focusChart.focus(chart.filter(), true);
                });
            }
        });
        return this;
    }

    /**
     * Turn on/off the brush-based range filter. When brushing is on then user can drag the mouse
     * across a chart with a quantitative scale to perform range filtering based on the extent of the
     * brush, or click on the bars of an ordinal bar chart or slices of a pie chart to filter and
     * un-filter them. However turning on the brush filter will disable other interactive elements on
     * the chart such as highlighting, tool tips, and reference lines. Zooming will still be possible
     * if enabled, but only via scrolling (panning will be disabled.)
     * @param {Boolean} [brushOn=true]
     * @returns {Boolean|CoordinateGridMixin}
     */
    public brushOn(): boolean;
    public brushOn(brushOn: boolean): this;
    public brushOn(brushOn?) {
        if (!arguments.length) {
            return this._brushOn;
        }
        this._brushOn = brushOn;
        return this;
    }

    /**
     * This will be internally used by composite chart onto children. Please go not invoke directly.
     *
     * @protected
     * @param {Boolean} [brushOn=false]
     * @returns {Boolean|CoordinateGridMixin}
     */
    public parentBrushOn(): boolean;
    public parentBrushOn(brushOn: boolean): this;
    public parentBrushOn(brushOn?) {
        if (!arguments.length) {
            return this._parentBrushOn;
        }
        this._parentBrushOn = brushOn;
        return this;
    }

    // Get the SVG rendered brush
    public gBrush(): SVGGElementSelection {
        return this._gBrush;
    }

    public _hasRangeSelected(range): boolean {
        return range instanceof Array && range.length > 1;
    }
}
