import {schemeCategory10} from 'd3-scale-chromatic';
import {timeDay} from 'd3-time';
import {max, min} from 'd3-array';
import {scaleBand, scaleLinear, scaleOrdinal} from 'd3-scale';
import {axisTop, axisBottom, axisLeft, axisRight} from 'd3-axis';
import {zoom, zoomIdentity} from 'd3-zoom';
import {brushX} from 'd3-brush';

import {ColorMixin} from './color-mixin';
import {MarginMixin} from './margin-mixin';
import {optionalTransition, transition} from '../core/core';
import {units} from '../core/units';
import {constants} from '../core/constants';
import {utils} from '../core/utils';
import {d3compat} from '../core/config';
import {logger} from '../core/logger';
import {filters} from '../core/filters';
import {events} from '../core/events';

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
    constructor () {
        super();

        this.colors(scaleOrdinal(schemeCategory10));
        this._mandatoryAttributes().push('x');
        this._parent = undefined;
        this._g = undefined;
        this._chartBodyG = undefined;

        this._x = undefined;
        this._origX = undefined; // Will hold original scale in case of zoom
        this._xOriginalDomain = undefined;
        this._xAxis = null;
        this._xUnits = units.integers;
        this._xAxisPadding = 0;
        this._xAxisPaddingUnit = timeDay;
        this._xElasticity = false;
        this._xAxisLabel = undefined;
        this._xAxisLabelPadding = 0;
        this._lastXDomain = undefined;

        this._y = undefined;
        this._yAxis = null;
        this._yAxisPadding = 0;
        this._yElasticity = false;
        this._yAxisLabel = undefined;
        this._yAxisLabelPadding = 0;

        this._brush = brushX();

        this._gBrush = undefined;
        this._brushOn = true;
        this._parentBrushOn = false;
        this._round = undefined;
        this._ignoreBrushEvents = false; // ignore when carrying out programmatic brush operations

        this._renderHorizontalGridLine = false;
        this._renderVerticalGridLine = false;

        this._resizing = false;
        this._unitCount = undefined;

        this._zoomScale = [1, Infinity];
        this._zoomOutRestrict = true;

        this._zoom = zoom().on('zoom', d3compat.eventHandler((d, evt) => this._onZoom(evt)));
        this._nullZoom = zoom().on('zoom', null);
        this._hasBeenMouseZoomable = false;
        this._ignoreZoomEvents = false; // ignore when carrying out programmatic zoom operations

        this._rangeChart = undefined;
        this._focusChart = undefined;

        this._mouseZoomable = false;
        this._clipPadding = 0;

        this._fOuterRangeBandPadding = 0.5;
        this._fRangeBandPadding = 0;

        this._useRightYAxis = false;
        this._useTopXAxis = false;
    }

    /**
     * When changing the domain of the x or y scale, it is necessary to tell the chart to recalculate
     * and redraw the axes. (`.rescale()` is called automatically when the x or y scale is replaced
     * with {@link CoordinateGridMixin+x .x()} or {@link CoordinateGridMixin#y .y()}, and has
     * no effect on elastic scales.)
     * @returns {CoordinateGridMixin}
     */
    rescale () {
        this._unitCount = undefined;
        this._resizing = true;
        return this;
    }

    resizing (resizing) {
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
    rangeChart (rangeChart) {
        if (!arguments.length) {
            return this._rangeChart;
        }
        this._rangeChart = rangeChart;
        this._rangeChart.focusChart(this);
        return this;
    }

    /**
     * Get or set the scale extent for mouse zooms.
     * @param {Array<Number|Date>} [extent=[1, Infinity]]
     * @returns {Array<Number|Date>|CoordinateGridMixin}
     */
    zoomScale (extent) {
        if (!arguments.length) {
            return this._zoomScale;
        }
        this._zoomScale = extent;
        return this;
    }

    /**
     * Get or set the zoom restriction for the chart. If true limits the zoom to origional domain of the chart.
     * @param {Boolean} [zoomOutRestrict=true]
     * @returns {Boolean|CoordinateGridMixin}
     */
    zoomOutRestrict (zoomOutRestrict) {
        if (!arguments.length) {
            return this._zoomOutRestrict;
        }
        this._zoomOutRestrict = zoomOutRestrict;
        return this;
    }

    _generateG (parent) {
        if (parent === undefined) {
            this._parent = this.svg();
        } else {
            this._parent = parent;
        }

        const href = window.location.href.split('#')[0];

        this._g = this._parent.append('g');

        this._chartBodyG = this._g.append('g').attr('class', 'chart-body')
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
    g (gElement) {
        if (!arguments.length) {
            return this._g;
        }
        this._g = gElement;
        return this;
    }

    /**
     * Set or get mouse zoom capability flag (default: false). When turned on the chart will be
     * zoomable using the mouse wheel. If the range selector chart is attached zooming will also update
     * the range selection brush on the associated range selector chart.
     * @param {Boolean} [mouseZoomable=false]
     * @returns {Boolean|CoordinateGridMixin}
     */
    mouseZoomable (mouseZoomable) {
        if (!arguments.length) {
            return this._mouseZoomable;
        }
        this._mouseZoomable = mouseZoomable;
        return this;
    }

    /**
     * Retrieve the svg group for the chart body.
     * @param {SVGElement} [chartBodyG]
     * @returns {SVGElement}
     */
    chartBodyG (chartBodyG) {
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
    x (xScale) {
        if (!arguments.length) {
            return this._x;
        }
        this._x = xScale;
        this._xOriginalDomain = this._x.domain();
        this.rescale();
        return this;
    }

    xOriginalDomain () {
        return this._xOriginalDomain;
    }

    /**
     * Set or get the xUnits function. The coordinate grid chart uses the xUnits function to calculate
     * the number of data projections on the x axis such as the number of bars for a bar chart or the
     * number of dots for a line chart.
     *
     * This function is expected to return a Javascript array of all data points on the x axis, or
     * the number of points on the axis. d3 time range functions [d3.timeDays, d3.timeMonths, and
     * d3.timeYears](https://github.com/d3/d3-time/blob/master/README.md#intervals) are all valid
     * xUnits functions.
     *
     * dc.js also provides a few units function, see the {@link units Units Namespace} for
     * a list of built-in units functions.
     *
     * Note that as of dc.js 3.0, `units.ordinal` is not a real function, because it is not
     * possible to define this function compliant with the d3 range functions. It was already a
     * magic value which caused charts to behave differently, and now it is completely so.
     * @example
     * // set x units to count days
     * chart.xUnits(d3.timeDays);
     * // set x units to count months
     * chart.xUnits(d3.timeMonths);
     *
     * // A custom xUnits function can be used as long as it follows the following interface:
     * // units in integer
     * function(start, end) {
     *      // simply calculates how many integers in the domain
     *      return Math.abs(end - start);
     * }
     *
     * // fixed units
     * function(start, end) {
     *      // be aware using fixed units will disable the focus/zoom ability on the chart
     *      return 1000;
     * }
     * @param {Function} [xUnits=units.integers]
     * @returns {Function|CoordinateGridMixin}
     */
    xUnits (xUnits) {
        if (!arguments.length) {
            return this._xUnits;
        }
        this._xUnits = xUnits;
        return this;
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
    xAxis (xAxis) {
        if (!arguments.length) {
            if (!this._xAxis) {
                this._xAxis = this._createXAxis();
            }
            return this._xAxis;
        }
        this._xAxis = xAxis;
        return this;
    }

    /**
     * Turn on/off elastic x axis behavior. If x axis elasticity is turned on, then the grid chart will
     * attempt to recalculate the x axis range whenever a redraw event is triggered.
     * @param {Boolean} [elasticX=false]
     * @returns {Boolean|CoordinateGridMixin}
     */
    elasticX (elasticX) {
        if (!arguments.length) {
            return this._xElasticity;
        }
        this._xElasticity = elasticX;
        return this;
    }

    /**
     * Set or get x axis padding for the elastic x axis. The padding will be added to both end of the x
     * axis if elasticX is turned on; otherwise it is ignored.
     *
     * Padding can be an integer or percentage in string (e.g. '10%'). Padding can be applied to
     * number or date x axes.  When padding a date axis, an integer represents number of units being padded
     * and a percentage string will be treated the same as an integer. The unit will be determined by the
     * xAxisPaddingUnit variable.
     * @param {Number|String} [padding=0]
     * @returns {Number|String|CoordinateGridMixin}
     */
    xAxisPadding (padding) {
        if (!arguments.length) {
            return this._xAxisPadding;
        }
        this._xAxisPadding = padding;
        return this;
    }

    /**
     * Set or get x axis padding unit for the elastic x axis. The padding unit will determine which unit to
     * use when applying xAxis padding if elasticX is turned on and if x-axis uses a time dimension;
     * otherwise it is ignored.
     *
     * The padding unit should be a
     * [d3 time interval](https://github.com/d3/d3-time/blob/master/README.md#self._interval).
     * For backward compatibility with dc.js 2.0, it can also be the name of a d3 time interval
     * ('day', 'hour', etc). Available arguments are the
     * [d3 time intervals](https://github.com/d3/d3-time/blob/master/README.md#intervals d3.timeInterval).
     * @param {String} [unit=d3.timeDay]
     * @returns {String|CoordinateGridMixin}
     */
    xAxisPaddingUnit (unit) {
        if (!arguments.length) {
            return this._xAxisPaddingUnit;
        }
        this._xAxisPaddingUnit = unit;
        return this;
    }

    /**
     * Returns the number of units displayed on the x axis. If the x axis is ordinal (`xUnits` is
     * `units.ordinal`), this is the number of items in the domain of the x scale. Otherwise, the
     * x unit count is calculated using the {@link CoordinateGridMixin#xUnits xUnits} function.
     * @returns {Number}
     */
    xUnitCount () {
        if (this._unitCount === undefined) {
            if (this.isOrdinal()) {
                // In this case it number of items in domain
                this._unitCount = this.x().domain().length;
            } else {
                this._unitCount = this.xUnits()(this.x().domain()[0], this.x().domain()[1]);

                // Sometimes xUnits() may return an array while sometimes directly the count
                if (this._unitCount instanceof Array) {
                    this._unitCount = this._unitCount.length;
                }
            }
        }

        return this._unitCount;
    }

    /**
     * Gets or sets whether the chart should be drawn with a right axis instead of a left axis. When
     * used with a chart in a composite chart, allows both left and right Y axes to be shown on a
     * chart.
     * @param {Boolean} [useRightYAxis=false]
     * @returns {Boolean|CoordinateGridMixin}
     */
    useRightYAxis (useRightYAxis) {
        if (!arguments.length) {
            return this._useRightYAxis;
        }

        // We need to warn if value is changing after self._yAxis was created
        if (this._useRightYAxis !== useRightYAxis && this._yAxis) {
            logger.warn('Value of useRightYAxis has been altered, after yAxis was created. ' +
                'You might get unexpected yAxis behavior. ' +
                'Make calls to useRightYAxis sooner in your chart creation process.');
        }

        this._useRightYAxis = useRightYAxis;
        return this;
    }

    /**
     * Gets or sets whether the chart should be drawn with a top axis instead of a bottom axis. When
     * used with a chart in a composite chart, allows both top and bottom X axes to be shown on a
     * chart.
     * @param {Boolean} [useTopXAxis=false]
     * @returns {Boolean|CoordinateGridMixin}
     */
    useTopXAxis (useTopXAxis) {
        if (!arguments.length) {
            return this._useTopXAxis;
        }

        // We need to warn if value is changing after self._yAxis was created
        if (this._useTopXAxis !== useTopXAxis && this._xAxis) {
            logger.warn('Value of useTopXAxis has been altered, after xAxis was created. ' +
                'You might get unexpected yAxis behavior. ' +
                'Make calls to useTopXAxis sooner in your chart creation process.');
        }

        this._useTopXAxis = useTopXAxis;
        return this;
    }

    /**
     * Returns true if the chart is using ordinal xUnits ({@link units.ordinal units.ordinal}, or false
     * otherwise. Most charts behave differently with ordinal data and use the result of this method to
     * trigger the appropriate logic.
     * @returns {Boolean}
     */
    isOrdinal () {
        return this.xUnits() === units.ordinal;
    }

    _useOuterPadding () {
        return true;
    }

    _ordinalXDomain () {
        const groups = this._computeOrderedGroups(this.data());
        return groups.map(this.keyAccessor());
    }

    _createXAxis () {
        return this._useTopXAxis ? axisTop() : axisBottom();
    }

    // eslint-disable-next-line complexity
    _prepareXAxis (g, render) {
        if (!this.isOrdinal()) {
            if (this.elasticX()) {
                this._x.domain([this.xAxisMin(), this.xAxisMax()]);
            }
        } else { // self._chart.isOrdinal()
            // D3v4 - Ordinal charts would need scaleBand
            // bandwidth is a method in scaleBand
            // (https://github.com/d3/d3-scale/blob/master/README.md#scaleBand)
            if (!this._x.bandwidth) {
                // If self._x is not a scaleBand create a new scale and
                // copy the original domain to the new scale
                logger.warn('For compatibility with d3v4+, dc.js d3.0 ordinal bar/line/bubble charts need ' +
                    'd3.scaleBand() for the x scale, instead of d3.scaleOrdinal(). ' +
                    'Replacing .x() with a d3.scaleBand with the same domain - ' +
                    'make the same change in your code to avoid this warning!');
                this._x = scaleBand().domain(this._x.domain());
            }

            if (this.elasticX() || this._x.domain().length === 0) {
                this._x.domain(this._ordinalXDomain());
            }
        }

        // has the domain changed?
        const xdom = this._x.domain();
        if (render || !utils.arraysEqual(this._lastXDomain, xdom)) {
            this.rescale();
        }
        this._lastXDomain = xdom;

        // please can't we always use rangeBands for bar charts?
        if (this.isOrdinal()) {
            this._x.range([0, this.xAxisLength()])
                .paddingInner(this._fRangeBandPadding)
                .paddingOuter(this._useOuterPadding() ? this._fOuterRangeBandPadding : 0);
        } else {
            this._x.range([0, this.xAxisLength()]);
        }

        if (!this._xAxis) {
            this._xAxis = this._createXAxis()
        }

        this._xAxis = this._xAxis.scale(this.x());

        this._renderVerticalGridLines(g);
    }

    renderXAxis (g) {
        let axisXG = g.select('g.x');

        if (axisXG.empty()) {
            axisXG = g.append('g')
                .attr('class', 'axis x')
                .attr('transform', `translate(${this.margins().left},${this._xAxisY()})`);
        }

        let axisXLab = g.select(`text.${X_AXIS_LABEL_CLASS}`);
        const axisXLabY = this._useTopXAxis ? this._xAxisLabelPadding : (this.height() - this._xAxisLabelPadding);
        if (axisXLab.empty() && this.xAxisLabel()) {
            axisXLab = g.append('text')
                .attr('class', X_AXIS_LABEL_CLASS)
                .attr('transform', `translate(${this.margins().left + this.xAxisLength() / 2},${axisXLabY})`)
                .attr('text-anchor', 'middle');
        }
        if (this.xAxisLabel() && axisXLab.text() !== this.xAxisLabel()) {
            axisXLab.text(this.xAxisLabel());
        }

        transition(axisXG, this.transitionDuration(), this.transitionDelay())
            .attr('transform', `translate(${this.margins().left},${this._xAxisY()})`)
            .call(this._xAxis);
        transition(axisXLab, this.transitionDuration(), this.transitionDelay())
            .attr('transform', `translate(${this.margins().left + this.xAxisLength() / 2},${axisXLabY})`);
    }

    _renderVerticalGridLines (g) {
        let gridLineG = g.select(`g.${VERTICAL_CLASS}`);

        if (this._renderVerticalGridLine) {
            if (gridLineG.empty()) {
                gridLineG = g.insert('g', ':first-child')
                    .attr('class', `${GRID_LINE_CLASS} ${VERTICAL_CLASS}`)
                    .attr('transform', `translate(${this.margins().left},${this.margins().top})`);
            }

            const ticks = this._xAxis.tickValues() ? this._xAxis.tickValues() :
                (typeof this._x.ticks === 'function' ? this._x.ticks.apply(this._x, this._xAxis.tickArguments()) : this._x.domain());

            const lines = gridLineG.selectAll('line')
                .data(ticks);

            // enter
            const linesGEnter = lines.enter()
                .append('line')
                .attr('x1', d => this._x(d))
                .attr('y1', this._xAxisY() - this.margins().top)
                .attr('x2', d => this._x(d))
                .attr('y2', 0)
                .attr('opacity', 0);
            transition(linesGEnter, this.transitionDuration(), this.transitionDelay())
                .attr('opacity', 0.5);

            // update
            transition(lines, this.transitionDuration(), this.transitionDelay())
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

    _xAxisY () {
        return this._useTopXAxis ? this.margins().top : this.height() - this.margins().bottom;
    }

    xAxisLength () {
        return this.effectiveWidth();
    }

    /**
     * Set or get the x axis label. If setting the label, you may optionally include additional padding to
     * the margin to make room for the label. By default the padded is set to 12 to accomodate the text height.
     * @param {String} [labelText]
     * @param {Number} [padding=12]
     * @returns {String}
     */
    xAxisLabel (labelText, padding) {
        if (!arguments.length) {
            return this._xAxisLabel;
        }
        this._xAxisLabel = labelText;
        this.margins().bottom -= this._xAxisLabelPadding;
        this._xAxisLabelPadding = (padding === undefined) ? DEFAULT_AXIS_LABEL_PADDING : padding;
        this.margins().bottom += this._xAxisLabelPadding;
        return this;
    }

    _createYAxis () {
        return this._useRightYAxis ? axisRight() : axisLeft();
    }

    _prepareYAxis (g) {
        if (this._y === undefined || this.elasticY()) {
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

    renderYAxisLabel (axisClass, text, rotation, labelXPosition) {
        labelXPosition = labelXPosition || this._yAxisLabelPadding;

        let axisYLab = this.g().select(`text.${Y_AXIS_LABEL_CLASS}.${axisClass}-label`);
        const labelYPosition = (this.margins().top + this.yAxisHeight() / 2);
        if (axisYLab.empty() && text) {
            axisYLab = this.g().append('text')
                .attr('transform', `translate(${labelXPosition},${labelYPosition}),rotate(${rotation})`)
                .attr('class', `${Y_AXIS_LABEL_CLASS} ${axisClass}-label`)
                .attr('text-anchor', 'middle')
                .text(text);
        }
        if (text && axisYLab.text() !== text) {
            axisYLab.text(text);
        }
        transition(axisYLab, this.transitionDuration(), this.transitionDelay())
            .attr('transform', `translate(${labelXPosition},${labelYPosition}),rotate(${rotation})`);
    }

    renderYAxisAt (axisClass, axis, position) {
        let axisYG = this.g().select(`g.${axisClass}`);
        if (axisYG.empty()) {
            axisYG = this.g().append('g')
                .attr('class', `axis ${axisClass}`)
                .attr('transform', `translate(${position},${this.margins().top})`);
        }

        transition(axisYG, this.transitionDuration(), this.transitionDelay())
            .attr('transform', `translate(${position},${this.margins().top})`)
            .call(axis);
    }

    renderYAxis () {
        const axisPosition = this._useRightYAxis ? (this.width() - this.margins().right) : this._yAxisX();
        this.renderYAxisAt('y', this._yAxis, axisPosition);
        const labelPosition = this._useRightYAxis ? (this.width() - this._yAxisLabelPadding) : this._yAxisLabelPadding;
        const rotation = this._useRightYAxis ? 90 : -90;
        this.renderYAxisLabel('y', this.yAxisLabel(), rotation, labelPosition);
    }

    _renderHorizontalGridLinesForAxis (g, scale, axis) {
        let gridLineG = g.select(`g.${HORIZONTAL_CLASS}`);

        if (this._renderHorizontalGridLine) {
            // see https://github.com/d3/d3-axis/blob/master/src/axis.js#L48
            const ticks = axis.tickValues() ? axis.tickValues() :
                (scale.ticks ? scale.ticks.apply(scale, axis.tickArguments()) : scale.domain());

            if (gridLineG.empty()) {
                gridLineG = g.insert('g', ':first-child')
                    .attr('class', `${GRID_LINE_CLASS} ${HORIZONTAL_CLASS}`)
                    .attr('transform', `translate(${this.margins().left},${this.margins().top})`);
            }

            const lines = gridLineG.selectAll('line')
                .data(ticks);

            // enter
            const linesGEnter = lines.enter()
                .append('line')
                .attr('x1', 1)
                .attr('y1', d => scale(d))
                .attr('x2', this.xAxisLength())
                .attr('y2', d => scale(d))
                .attr('opacity', 0);
            transition(linesGEnter, this.transitionDuration(), this.transitionDelay())
                .attr('opacity', 0.5);

            // update
            transition(lines, this.transitionDuration(), this.transitionDelay())
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

    _yAxisX () {
        return this.useRightYAxis() ? this.width() - this.margins().right : this.margins().left;
    }

    /**
     * Set or get the y axis label. If setting the label, you may optionally include additional padding
     * to the margin to make room for the label. By default the padding is set to 12 to accommodate the
     * text height.
     * @param {String} [labelText]
     * @param {Number} [padding=12]
     * @returns {String|CoordinateGridMixin}
     */
    yAxisLabel (labelText, padding) {
        if (!arguments.length) {
            return this._yAxisLabel;
        }
        this._yAxisLabel = labelText;
        this.margins().left -= this._yAxisLabelPadding;
        this._yAxisLabelPadding = (padding === undefined) ? DEFAULT_AXIS_LABEL_PADDING : padding;
        this.margins().left += this._yAxisLabelPadding;
        return this;
    }

    /**
     * Get or set the y scale. The y scale is typically automatically determined by the chart implementation.
     * @see {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale}
     * @param {d3.scale} [yScale]
     * @returns {d3.scale|CoordinateGridMixin}
     */
    y (yScale) {
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
    yAxis (yAxis) {
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
     * Turn on/off elastic y axis behavior. If y axis elasticity is turned on, then the grid chart will
     * attempt to recalculate the y axis range whenever a redraw event is triggered.
     * @param {Boolean} [elasticY=false]
     * @returns {Boolean|CoordinateGridMixin}
     */
    elasticY (elasticY) {
        if (!arguments.length) {
            return this._yElasticity;
        }
        this._yElasticity = elasticY;
        return this;
    }

    /**
     * Turn on/off horizontal grid lines.
     * @param {Boolean} [renderHorizontalGridLines=false]
     * @returns {Boolean|CoordinateGridMixin}
     */
    renderHorizontalGridLines (renderHorizontalGridLines) {
        if (!arguments.length) {
            return this._renderHorizontalGridLine;
        }
        this._renderHorizontalGridLine = renderHorizontalGridLines;
        return this;
    }

    /**
     * Turn on/off vertical grid lines.
     * @param {Boolean} [renderVerticalGridLines=false]
     * @returns {Boolean|CoordinateGridMixin}
     */
    renderVerticalGridLines (renderVerticalGridLines) {
        if (!arguments.length) {
            return this._renderVerticalGridLine;
        }
        this._renderVerticalGridLine = renderVerticalGridLines;
        return this;
    }

    /**
     * Calculates the minimum x value to display in the chart. Includes xAxisPadding if set.
     * @returns {*}
     */
    xAxisMin () {
        const m = min(this.data(), e => this.keyAccessor()(e));
        return utils.subtract(m, this._xAxisPadding, this._xAxisPaddingUnit);
    }

    /**
     * Calculates the maximum x value to display in the chart. Includes xAxisPadding if set.
     * @returns {*}
     */
    xAxisMax () {
        const m = max(this.data(), e => this.keyAccessor()(e));
        return utils.add(m, this._xAxisPadding, this._xAxisPaddingUnit);
    }

    /**
     * Calculates the minimum y value to display in the chart. Includes yAxisPadding if set.
     * @returns {*}
     */
    yAxisMin () {
        const m = min(this.data(), e => this.valueAccessor()(e));
        return utils.subtract(m, this._yAxisPadding);
    }

    /**
     * Calculates the maximum y value to display in the chart. Includes yAxisPadding if set.
     * @returns {*}
     */
    yAxisMax () {
        const m = max(this.data(), e => this.valueAccessor()(e));
        return utils.add(m, this._yAxisPadding);
    }

    /**
     * Set or get y axis padding for the elastic y axis. The padding will be added to the top and
     * bottom of the y axis if elasticY is turned on; otherwise it is ignored.
     *
     * Padding can be an integer or percentage in string (e.g. '10%'). Padding can be applied to
     * number or date axes. When padding a date axis, an integer represents number of days being padded
     * and a percentage string will be treated the same as an integer.
     * @param {Number|String} [padding=0]
     * @returns {Number|CoordinateGridMixin}
     */
    yAxisPadding (padding) {
        if (!arguments.length) {
            return this._yAxisPadding;
        }
        this._yAxisPadding = padding;
        return this;
    }

    yAxisHeight () {
        return this.effectiveHeight();
    }

    /**
     * Set or get the rounding function used to quantize the selection when brushing is enabled.
     * @example
     * // set x unit round to by month, this will make sure range selection brush will
     * // select whole months
     * chart.round(d3.timeMonth.round);
     * @param {Function} [round]
     * @returns {Function|CoordinateGridMixin}
     */
    round (round) {
        if (!arguments.length) {
            return this._round;
        }
        this._round = round;
        return this;
    }

    _rangeBandPadding (_) {
        if (!arguments.length) {
            return this._fRangeBandPadding;
        }
        this._fRangeBandPadding = _;
        return this;
    }

    _outerRangeBandPadding (_) {
        if (!arguments.length) {
            return this._fOuterRangeBandPadding;
        }
        this._fOuterRangeBandPadding = _;
        return this;
    }

    filter (_) {
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
    brush (_) {
        if (!arguments.length) {
            return this._brush;
        }
        this._brush = _;
        return this;
    }

    renderBrush (g, doTransition) {
        if (this._brushOn) {
            this._brush.on('start brush end', d3compat.eventHandler((d, evt) => this._brushing(evt)));

            // To retrieve selection we need self._gBrush
            this._gBrush = g.append('g')
                .attr('class', 'brush')
                .attr('transform', `translate(${this.margins().left},${this.margins().top})`);

            this.setBrushExtents();

            this.createBrushHandlePaths(this._gBrush, doTransition);

            this.redrawBrush(this.filter(), doTransition);
        }
    }

    createBrushHandlePaths (gBrush) {
        let brushHandles = gBrush.selectAll(`path.${CUSTOM_BRUSH_HANDLE_CLASS}`).data([{type: 'w'}, {type: 'e'}]);

        brushHandles = brushHandles
            .enter()
            .append('path')
            .attr('class', CUSTOM_BRUSH_HANDLE_CLASS)
            .merge(brushHandles);

        brushHandles
            .attr('d', d => this.resizeHandlePath(d));
    }

    extendBrush (brushSelection) {
        if (brushSelection && this.round()) {
            brushSelection[0] = this.round()(brushSelection[0]);
            brushSelection[1] = this.round()(brushSelection[1]);
        }
        return brushSelection;
    }

    brushIsEmpty (brushSelection) {
        return !brushSelection || brushSelection[1] <= brushSelection[0];
    }

    _brushing (evt) {
        if (this._ignoreBrushEvents) {
            return;
        }

        let brushSelection = evt.selection;
        if (brushSelection) {
            brushSelection = brushSelection.map(this.x().invert);
        }

        brushSelection = this.extendBrush(brushSelection);

        this.redrawBrush(brushSelection, false);

        const rangedFilter = this.brushIsEmpty(brushSelection) ? null : filters.RangedFilter(brushSelection[0], brushSelection[1]);

        events.trigger(() => {
            this.applyBrushSelection(rangedFilter);
        }, constants.EVENT_DELAY);
    }

    // This can be overridden in a derived chart. For example Composite chart overrides it
    applyBrushSelection (rangedFilter) {
        this.replaceFilter(rangedFilter);
        this.redrawGroup();
    }

    _withoutBrushEvents (closure) {
        const oldValue = this._ignoreBrushEvents;
        this._ignoreBrushEvents = true;

        try {
            closure();
        } finally {
            this._ignoreBrushEvents = oldValue;
        }
    }

    setBrushExtents (doTransition) {
        this._withoutBrushEvents(() => {
            // Set boundaries of the brush, must set it before applying to self._gBrush
            this._brush.extent([[0, 0], [this.effectiveWidth(), this.effectiveHeight()]]);
        });

        this._gBrush
            .call(this._brush);
    }

    redrawBrush (brushSelection, doTransition) {
        if (this._brushOn && this._gBrush) {
            if (this._resizing) {
                this.setBrushExtents(doTransition);
            }

            if (!brushSelection) {
                this._withoutBrushEvents(() => {
                    this._gBrush
                        .call(this._brush.move, null);
                })

                this._gBrush.selectAll(`path.${CUSTOM_BRUSH_HANDLE_CLASS}`)
                    .attr('display', 'none');
            } else {
                const scaledSelection = [this._x(brushSelection[0]), this._x(brushSelection[1])];

                const gBrush =
                    optionalTransition(doTransition, this.transitionDuration(), this.transitionDelay())(this._gBrush);

                this._withoutBrushEvents(() => {
                    gBrush
                        .call(this._brush.move, scaledSelection);
                });

                gBrush.selectAll(`path.${CUSTOM_BRUSH_HANDLE_CLASS}`)
                    .attr('display', null)
                    .attr('transform', (d, i) => `translate(${this._x(brushSelection[i])}, 0)`)
                    .attr('d', d => this.resizeHandlePath(d));
            }
        }
        this.fadeDeselectedArea(brushSelection);
    }

    fadeDeselectedArea (brushSelection) {
        // do nothing, sub-chart should override this function
    }

    // borrowed from Crossfilter example
    resizeHandlePath (d) {
        d = d.type;
        const e = +(d === 'e'), x = e ? 1 : -1, y = this.effectiveHeight() / 3;
        return `M${0.5 * x},${y 
        }A6,6 0 0 ${e} ${6.5 * x},${y + 6 
        }V${2 * y - 6 
        }A6,6 0 0 ${e} ${0.5 * x},${2 * y 
        }Z` +
            `M${2.5 * x},${y + 8 
            }V${2 * y - 8 
            }M${4.5 * x},${y + 8 
            }V${2 * y - 8}`;
    }

    _getClipPathId () {
        return `${this.anchorName().replace(/[ .#=\[\]"]/g, '-')}-clip`;
    }

    /**
     * Get or set the padding in pixels for the clip path. Once set padding will be applied evenly to
     * the top, left, right, and bottom when the clip path is generated. If set to zero, the clip area
     * will be exactly the chart body area minus the margins.
     * @param {Number} [padding=5]
     * @returns {Number|CoordinateGridMixin}
     */
    clipPadding (padding) {
        if (!arguments.length) {
            return this._clipPadding;
        }
        this._clipPadding = padding;
        return this;
    }

    _generateClipPath () {
        const defs = utils.appendOrSelect(this._parent, 'defs');
        // cannot select <clippath> elements; bug in WebKit, must select by id
        // https://groups.google.com/forum/#!topic/d3-js/6EpAzQ2gU9I
        const id = this._getClipPathId();
        const chartBodyClip = utils.appendOrSelect(defs, `#${id}`, 'clipPath').attr('id', id);

        const padding = this._clipPadding * 2;

        utils.appendOrSelect(chartBodyClip, 'rect')
            .attr('width', this.xAxisLength() + padding)
            .attr('height', this.yAxisHeight() + padding)
            .attr('transform', `translate(-${this._clipPadding}, -${this._clipPadding})`);
    }

    _preprocessData () {
    }

    _doRender () {
        this.resetSvg();

        this._preprocessData();

        this._generateG();
        this._generateClipPath();

        this._drawChart(true);

        this._configureMouseZoom();

        return this;
    }

    _doRedraw () {
        this._preprocessData();

        this._drawChart(false);
        this._generateClipPath();

        return this;
    }

    _drawChart (render) {
        if (this.isOrdinal()) {
            this._brushOn = false;
        }

        this._prepareXAxis(this.g(), render);
        this._prepareYAxis(this.g());

        this.plotData();

        if (this.elasticX() || this._resizing || render) {
            this.renderXAxis(this.g());
        }

        if (this.elasticY() || this._resizing || render) {
            this.renderYAxis(this.g());
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

    _configureMouseZoom () {
        // Save a copy of original x scale
        this._origX = this._x.copy();

        if (this._mouseZoomable) {
            this._enableMouseZoom();
        } else if (this._hasBeenMouseZoomable) {
            this._disableMouseZoom();
        }
    }

    _enableMouseZoom () {
        this._hasBeenMouseZoomable = true;

        const extent = [[0, 0], [this.effectiveWidth(), this.effectiveHeight()]];

        this._zoom
            .scaleExtent(this._zoomScale)
            .extent(extent)
            .duration(this.transitionDuration());

        if (this._zoomOutRestrict) {
            // Ensure minimum zoomScale is at least 1
            const zoomScaleMin = Math.max(this._zoomScale[0], 1);
            this._zoom
                .translateExtent(extent)
                .scaleExtent([zoomScaleMin, this._zoomScale[1]]);
        }

        this.root().call(this._zoom);

        // Tell D3 zoom our current zoom/pan status
        this._updateD3zoomTransform();
    }

    _disableMouseZoom () {
        this.root().call(this._nullZoom);
    }

    _zoomHandler (newDomain, noRaiseEvents) {
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
            if (this._rangeChart && !utils.arraysEqual(this.filter(), this._rangeChart.filter())) {
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
    _domainToZoomTransform (newDomain, origDomain, xScale) {
        const k = (origDomain[1] - origDomain[0]) / (newDomain[1] - newDomain[0]);
        const xt = -1 * xScale(newDomain[0]);

        return zoomIdentity.scale(k).translate(xt, 0);
    }

    // If we changing zoom status (for example by calling focus), tell D3 zoom about it
    _updateD3zoomTransform () {
        if (this._zoom) {
            this._withoutZoomEvents(() => {
                this._zoom.transform(this.root(), this._domainToZoomTransform(this.x().domain(), this._xOriginalDomain, this._origX));
            });
        }
    }

    _withoutZoomEvents (closure) {
        const oldValue = this._ignoreZoomEvents;
        this._ignoreZoomEvents = true;

        try {
            closure();
        } finally {
            this._ignoreZoomEvents = oldValue;
        }
    }

    _onZoom (evt) {
        // ignore zoom events if it was caused by a programmatic change
        if (this._ignoreZoomEvents) {
            return;
        }

        const newDomain = evt.transform.rescaleX(this._origX).domain();
        this.focus(newDomain, false);
    }

    _checkExtents (ext, outerLimits) {
        if (!ext || ext.length !== 2 || !outerLimits || outerLimits.length !== 2) {
            return ext;
        }

        if (ext[0] > outerLimits[1] || ext[1] < outerLimits[0]) {
            console.warn('Could not intersect extents, will reset');
        }
        // Math.max does not work (as the values may be dates as well)
        return [ext[0] > outerLimits[0] ? ext[0] : outerLimits[0], ext[1] < outerLimits[1] ? ext[1] : outerLimits[1]];
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
    focus (range, noRaiseEvents) {
        if (this._zoomOutRestrict) {
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

    refocused () {
        return !utils.arraysEqual(this.x().domain(), this._xOriginalDomain);
    }

    focusChart (c) {
        if (!arguments.length) {
            return this._focusChart;
        }
        this._focusChart = c;
        this.on('filtered.dcjs-range-chart', chart => {
            if (!chart.filter()) {
                events.trigger(() => {
                    this._focusChart.x().domain(this._focusChart.xOriginalDomain(), true);
                });
            } else if (!utils.arraysEqual(chart.filter(), this._focusChart.filter())) {
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
    brushOn (brushOn) {
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
    parentBrushOn (brushOn) {
        if (!arguments.length) {
            return this._parentBrushOn;
        }
        this._parentBrushOn = brushOn;
        return this;
    }

    // Get the SVG rendered brush
    gBrush () {
        return this._gBrush;
    }

    _hasRangeSelected (range) {
        return range instanceof Array && range.length > 1;
    }
}
