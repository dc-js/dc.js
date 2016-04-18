import * as d3 from 'd3';
import colorMixin from './color-mixin';
import marginMixin from './margin-mixin';
import baseMixin from './base-mixin';
import {RangedFilter} from './filters';
import trigger from './events';
import {constants, optionalTransition, override, transition, units} from './core';
import {utils} from './utils';

/**
 * Coordinate Grid is an abstract base chart designed to support a number of coordinate grid based
 * concrete chart types, e.g. bar chart, line chart, and bubble chart.
 * @name coordinateGridMixin
 * @memberof dc
 * @mixin
 * @mixes dc.colorMixin
 * @mixes dc.marginMixin
 * @mixes dc.baseMixin
 * @param {Object} _chart
 * @returns {dc.coordinateGridMixin}
 */
export default function coordinateGridMixin (_chart) {
    const GRID_LINE_CLASS = 'grid-line';
    const HORIZONTAL_CLASS = 'horizontal';
    const VERTICAL_CLASS = 'vertical';
    const Y_AXIS_LABEL_CLASS = 'y-axis-label';
    const X_AXIS_LABEL_CLASS = 'x-axis-label';
    const DEFAULT_AXIS_LABEL_PADDING = 12;

    _chart = colorMixin(marginMixin(baseMixin(_chart)));

    _chart.colors(d3.scale.category10());
    _chart._mandatoryAttributes().push('x');
    let _parent;
    let _g;
    let _chartBodyG;

    let _x;
    let _xOriginalDomain;
    let _xAxis = d3.svg.axis().orient('bottom');
    let _xUnits = units.integers;
    let _xAxisPadding = 0;
    let _xAxisPaddingUnit = 'day';
    let _xElasticity = false;
    let _xAxisLabel;
    let _xAxisLabelPadding = 0;
    let _lastXDomain;

    let _y;
    let _yAxis = d3.svg.axis().orient('left');
    let _yAxisPadding = 0;
    let _yElasticity = false;
    let _yAxisLabel;
    let _yAxisLabelPadding = 0;

    let _brush = d3.svg.brush();
    let _brushOn = true;
    let _round;

    let _renderHorizontalGridLine = false;
    let _renderVerticalGridLine = false;

    let _refocused = false,
        _resizing = false;
    let _unitCount;

    let _zoomScale = [1, Infinity];
    let _zoomOutRestrict = true;

    const _zoom = d3.behavior.zoom().on('zoom', zoomHandler);
    const _nullZoom = d3.behavior.zoom().on('zoom', null);
    let _hasBeenMouseZoomable = false;

    let _rangeChart;
    let _focusChart;

    let _mouseZoomable = false;
    let _clipPadding = 0;

    let _outerRangeBandPadding = 0.5;
    let _rangeBandPadding = 0;

    let _useRightYAxis = false;

    /**
     * When changing the domain of the x or y scale, it is necessary to tell the chart to recalculate
     * and redraw the axes. (`.rescale()` is called automatically when the x or y scale is replaced
     * with {@link dc.coordinateGridMixin+x .x()} or {@link dc.coordinateGridMixin#y .y()}, and has
     * no effect on elastic scales.)
     * @method rescale
     * @memberof dc.coordinateGridMixin
     * @instance
     * @returns {dc.coordinateGridMixin}
     */
    _chart.rescale = function () {
        _unitCount = undefined;
        _resizing = true;
        return _chart;
    };

    _chart.resizing = function () {
        return _resizing;
    };

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
     * @method rangeChart
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {dc.coordinateGridMixin} [rangeChart]
     * @returns {dc.coordinateGridMixin}
     */
    _chart.rangeChart = function (rangeChart) {
        if (!arguments.length) {
            return _rangeChart;
        }
        _rangeChart = rangeChart;
        _rangeChart.focusChart(_chart);
        return _chart;
    };

    /**
     * Get or set the scale extent for mouse zooms.
     * @method zoomScale
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {Array<Number|Date>} [extent=[1, Infinity]]
     * @returns {Array<Number|Date>|dc.coordinateGridMixin}
     */
    _chart.zoomScale = function (extent) {
        if (!arguments.length) {
            return _zoomScale;
        }
        _zoomScale = extent;
        return _chart;
    };

    /**
     * Get or set the zoom restriction for the chart. If true limits the zoom to origional domain of the chart.
     * @method zoomOutRestrict
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {Boolean} [zoomOutRestrict=true]
     * @returns {Boolean|dc.coordinateGridMixin}
     */
    _chart.zoomOutRestrict = function (zoomOutRestrict) {
        if (!arguments.length) {
            return _zoomOutRestrict;
        }
        _zoomScale[0] = zoomOutRestrict ? 1 : 0;
        _zoomOutRestrict = zoomOutRestrict;
        return _chart;
    };

    _chart._generateG = function (parent) {
        if (parent === undefined) {
            _parent = _chart.svg();
        } else {
            _parent = parent;
        }

        const href = window.location.href.split('#')[0];

        _g = _parent.append('g');

        _chartBodyG = _g.append('g').attr('class', 'chart-body')
            .attr('transform', `translate(${_chart.margins().left}, ${_chart.margins().top})`)
            .attr('clip-path', `url(${href}#${getClipPathId()})`);

        return _g;
    };

    /**
     * Get or set the root g element. This method is usually used to retrieve the g element in order to
     * overlay custom svg drawing programatically. **Caution**: The root g element is usually generated
     * by dc.js internals, and resetting it might produce unpredictable result.
     * @method g
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {SVGElement} [gElement]
     * @returns {SVGElement|dc.coordinateGridMixin}
     */
    _chart.g = function (gElement) {
        if (!arguments.length) {
            return _g;
        }
        _g = gElement;
        return _chart;
    };

    /**
     * Set or get mouse zoom capability flag (default: false). When turned on the chart will be
     * zoomable using the mouse wheel. If the range selector chart is attached zooming will also update
     * the range selection brush on the associated range selector chart.
     * @method mouseZoomable
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {Boolean} [mouseZoomable=false]
     * @returns {Boolean|dc.coordinateGridMixin}
     */
    _chart.mouseZoomable = function (mouseZoomable) {
        if (!arguments.length) {
            return _mouseZoomable;
        }
        _mouseZoomable = mouseZoomable;
        return _chart;
    };

    /**
     * Retrieve the svg group for the chart body.
     * @method chartBodyG
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {SVGElement} [chartBodyG]
     * @returns {SVGElement}
     */
    _chart.chartBodyG = function (chartBodyG) {
        if (!arguments.length) {
            return _chartBodyG;
        }
        _chartBodyG = chartBodyG;
        return _chart;
    };

    /**
     * **mandatory**
     *
     * Get or set the x scale. The x scale can be any d3
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Quantitative-Scales.md quantitive scale} or
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md ordinal scale}.
     * @method x
     * @memberof dc.coordinateGridMixin
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Scales.md d3.scale}
     * @example
     * // set x to a linear scale
     * chart.x(d3.scale.linear().domain([-2500, 2500]))
     * // set x to a time scale to generate histogram
     * chart.x(d3.time.scale().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)]))
     * @param {d3.scale} [xScale]
     * @returns {d3.scale|dc.coordinateGridMixin}
     */
    _chart.x = function (xScale) {
        if (!arguments.length) {
            return _x;
        }
        _x = xScale;
        _xOriginalDomain = _x.domain();
        _chart.rescale();
        return _chart;
    };

    _chart.xOriginalDomain = function () {
        return _xOriginalDomain;
    };

    /**
     * Set or get the xUnits function. The coordinate grid chart uses the xUnits function to calculate
     * the number of data projections on x axis such as the number of bars for a bar chart or the
     * number of dots for a line chart. This function is expected to return a Javascript array of all
     * data points on x axis, or the number of points on the axis. [d3 time range functions
     * d3.time.days, d3.time.months, and
     * d3.time.years](https://github.com/d3/d3-3.x-api-reference/blob/master/Time-Intervals.md#aliases) are all valid xUnits
     * function. dc.js also provides a few units function, see the {@link dc.units Units Namespace} for
     * a list of built-in units functions.
     * @method xUnits
     * @memberof dc.coordinateGridMixin
     * @instance
     * @todo Add docs for utilities
     * @example
     * // set x units to count days
     * chart.xUnits(d3.time.days);
     * // set x units to count months
     * chart.xUnits(d3.time.months);
     *
     * // A custom xUnits function can be used as long as it follows the following interface:
     * // units in integer
     * function(start, end, xDomain) {
     *      // simply calculates how many integers in the domain
     *      return Math.abs(end - start);
     * };
     *
     * // fixed units
     * function(start, end, xDomain) {
     *      // be aware using fixed units will disable the focus/zoom ability on the chart
     *      return 1000;
     * @param {Function} [xUnits=dc.units.integers]
     * @returns {Function|dc.coordinateGridMixin}
     */
    _chart.xUnits = function (xUnits) {
        if (!arguments.length) {
            return _xUnits;
        }
        _xUnits = xUnits;
        return _chart;
    };

    /**
     * Set or get the x axis used by a particular coordinate grid chart instance. This function is most
     * useful when x axis customization is required. The x axis in dc.js is an instance of a
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md#axis d3 axis object};
     * therefore it supports any valid d3 axis manipulation.
     *
     * **Caution**: The x axis is usually generated internally by dc; resetting it may cause
     * unexpected results. Note also that when used as a getter, this function is not chainable:
     * it returns the axis, not the chart,
     * {@link https://github.com/dc-js/dc.js/wiki/FAQ#why-does-everything-break-after-a-call-to-xaxis-or-yaxis
     * so attempting to call chart functions after calling `.xAxis()` will fail}.
     * @method xAxis
     * @memberof dc.coordinateGridMixin
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md#axis d3.svg.axis}
     * @example
     * // customize x axis tick format
     * chart.xAxis().tickFormat(function(v) {return v + '%';});
     * // customize x axis tick values
     * chart.xAxis().tickValues([0, 100, 200, 300]);
     * @param {d3.svg.axis} [xAxis=d3.svg.axis().orient('bottom')]
     * @returns {d3.svg.axis|dc.coordinateGridMixin}
     */
    _chart.xAxis = function (xAxis) {
        if (!arguments.length) {
            return _xAxis;
        }
        _xAxis = xAxis;
        return _chart;
    };

    /**
     * Turn on/off elastic x axis behavior. If x axis elasticity is turned on, then the grid chart will
     * attempt to recalculate the x axis range whenever a redraw event is triggered.
     * @method elasticX
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {Boolean} [elasticX=false]
     * @returns {Boolean|dc.coordinateGridMixin}
     */
    _chart.elasticX = function (elasticX) {
        if (!arguments.length) {
            return _xElasticity;
        }
        _xElasticity = elasticX;
        return _chart;
    };

    /**
     * Set or get x axis padding for the elastic x axis. The padding will be added to both end of the x
     * axis if elasticX is turned on; otherwise it is ignored.
     *
     * Padding can be an integer or percentage in string (e.g. '10%'). Padding can be applied to
     * number or date x axes.  When padding a date axis, an integer represents number of units being padded
     * and a percentage string will be treated the same as an integer. The unit will be determined by the
     * xAxisPaddingUnit variable.
     * @method xAxisPadding
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {Number|String} [padding=0]
     * @returns {Number|String|dc.coordinateGridMixin}
     */
    _chart.xAxisPadding = function (padding) {
        if (!arguments.length) {
            return _xAxisPadding;
        }
        _xAxisPadding = padding;
        return _chart;
    };

    /**
     * Set or get x axis padding unit for the elastic x axis. The padding unit will determine which unit to
     * use when applying xAxis padding if elasticX is turned on and if x-axis uses a time dimension;
     * otherwise it is ignored.
     *
     * Padding unit is a string that will be used when the padding is calculated. Available parameters are
     * the available d3 time intervals; see
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Time-Intervals.md#interval d3.time.interval}.
     * @method xAxisPaddingUnit
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {String} [unit='days']
     * @returns {String|dc.coordinateGridMixin}
     */
    _chart.xAxisPaddingUnit = function (unit) {
        if (!arguments.length) {
            return _xAxisPaddingUnit;
        }
        _xAxisPaddingUnit = unit;
        return _chart;
    };

    /**
     * Returns the number of units displayed on the x axis using the unit measure configured by
     * {@link dc.coordinateGridMixin#xUnits xUnits}.
     * @method xUnitCount
     * @memberof dc.coordinateGridMixin
     * @instance
     * @returns {Number}
     */
    _chart.xUnitCount = function () {
        if (_unitCount === undefined) {
            const u = _chart.xUnits()(_chart.x().domain()[0], _chart.x().domain()[1], _chart.x().domain());

            if (u instanceof Array) {
                _unitCount = u.length;
            } else {
                _unitCount = u;
            }
        }

        return _unitCount;
    };

    /**
     * Gets or sets whether the chart should be drawn with a right axis instead of a left axis. When
     * used with a chart in a composite chart, allows both left and right Y axes to be shown on a
     * chart.
     * @method useRightYAxis
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {Boolean} [useRightYAxis=false]
     * @returns {Boolean|dc.coordinateGridMixin}
     */
    _chart.useRightYAxis = function (useRightYAxis) {
        if (!arguments.length) {
            return _useRightYAxis;
        }
        _useRightYAxis = useRightYAxis;
        return _chart;
    };

    /**
     * Returns true if the chart is using ordinal xUnits ({@link dc.units.ordinal dc.units.ordinal}, or false
     * otherwise. Most charts behave differently with ordinal data and use the result of this method to
     * trigger the appropriate logic.
     * @method isOrdinal
     * @memberof dc.coordinateGridMixin
     * @instance
     * @returns {Boolean}
     */
    _chart.isOrdinal = function () {
        return _chart.xUnits() === units.ordinal;
    };

    _chart._useOuterPadding = function () {
        return true;
    };

    _chart._ordinalXDomain = function () {
        const groups = _chart._computeOrderedGroups(_chart.data());
        return groups.map(_chart.keyAccessor());
    };

    function compareDomains (d1, d2) {
        return !d1 || !d2 || d1.length !== d2.length ||
            d1.some((elem, i) => ((elem && d2[i]) ? elem.toString() !== d2[i].toString() : elem === d2[i]));
    }

    function prepareXAxis (g, render) {
        if (!_chart.isOrdinal()) {
            if (_chart.elasticX()) {
                _x.domain([_chart.xAxisMin(), _chart.xAxisMax()]);
            }
        } else if (_chart.elasticX() || _x.domain().length === 0) {
            _x.domain(_chart._ordinalXDomain());
        }

        // has the domain changed?
        const xdom = _x.domain();
        if (render || compareDomains(_lastXDomain, xdom)) {
            _chart.rescale();
        }
        _lastXDomain = xdom;

        // please can't we always use rangeBands for bar charts?
        if (_chart.isOrdinal()) {
            _x.rangeBands(
                [0, _chart.xAxisLength()],
                _rangeBandPadding,
                _chart._useOuterPadding() ? _outerRangeBandPadding : 0
            );
        } else {
            _x.range([0, _chart.xAxisLength()]);
        }

        _xAxis = _xAxis.scale(_chart.x());

        renderVerticalGridLines(g);
    }

    _chart.renderXAxis = function (g) {
        let axisXG = g.select('g.x');

        if (axisXG.empty()) {
            axisXG = g.append('g')
                .attr('class', 'axis x')
                .attr('transform', `translate(${_chart.margins().left}, ${_chart._xAxisY()})`);
        }

        let axisXLab = g.select(`text.${X_AXIS_LABEL_CLASS}`);
        if (axisXLab.empty() && _chart.xAxisLabel()) {
            axisXLab = g.append('text')
                .attr('class', X_AXIS_LABEL_CLASS)
                .attr(
                    'transform',
                    `translate(${(_chart.margins().left + _chart.xAxisLength() / 2)}, ${(_chart.height() - _xAxisLabelPadding)})`
                )
                .attr('text-anchor', 'middle');
        }
        if (_chart.xAxisLabel() && axisXLab.text() !== _chart.xAxisLabel()) {
            axisXLab.text(_chart.xAxisLabel());
        }

        transition(axisXG, _chart.transitionDuration(), _chart.transitionDelay())
            .attr('transform', `translate(${_chart.margins().left}, ${_chart._xAxisY()})`)
            .call(_xAxis);
        transition(axisXLab, _chart.transitionDuration(), _chart.transitionDelay())
            .attr(
                'transform',
                `translate(${(_chart.margins().left + _chart.xAxisLength() / 2)}, ${(_chart.height() - _xAxisLabelPadding)})`
            );
    };

    function renderVerticalGridLines (g) {
        let gridLineG = g.select(`g.${VERTICAL_CLASS}`);

        if (_renderVerticalGridLine) {
            if (gridLineG.empty()) {
                gridLineG = g.insert('g', ':first-child')
                    .attr('class', `${GRID_LINE_CLASS} ${VERTICAL_CLASS}`)
                    .attr('transform', `translate(${_chart.margins().left}, ${_chart.margins().top})`);
            }
            let ticks;
            if (_xAxis.tickValues()) {
                ticks = _xAxis.tickValues();
            } else if (typeof _x.ticks === 'function') {
                ticks = _x.ticks(_xAxis.ticks()[0]);
            } else {
                ticks = _x.domain();
            }

            const lines = gridLineG.selectAll('line')
                .data(ticks);

            // enter
            const linesGEnter = lines.enter()
                .append('line')
                .attr('x1', _x)
                .attr('y1', _chart._xAxisY() - _chart.margins().top)
                .attr('x2', _x)
                .attr('y2', 0)
                .attr('opacity', 0);
            transition(linesGEnter, _chart.transitionDuration(), _chart.transitionDelay())
                .attr('opacity', 1);

            // update
            transition(lines, _chart.transitionDuration(), _chart.transitionDelay())
                .attr('x1', _x)
                .attr('y1', _chart._xAxisY() - _chart.margins().top)
                .attr('x2', _x)
                .attr('y2', 0);

            // exit
            lines.exit().remove();
        } else {
            gridLineG.selectAll('line').remove();
        }
    }

    _chart._xAxisY = function () {
        return (_chart.height() - _chart.margins().bottom);
    };

    _chart.xAxisLength = function () {
        return _chart.effectiveWidth();
    };

    /**
     * Set or get the x axis label. If setting the label, you may optionally include additional padding to
     * the margin to make room for the label. By default the padded is set to 12 to accomodate the text height.
     * @method xAxisLabel
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {String} [labelText]
     * @param {Number} [padding=12]
     * @returns {String}
     */
    _chart.xAxisLabel = function (labelText, padding) {
        if (!arguments.length) {
            return _xAxisLabel;
        }
        _xAxisLabel = labelText;
        _chart.margins().bottom -= _xAxisLabelPadding;
        _xAxisLabelPadding = (padding === undefined) ? DEFAULT_AXIS_LABEL_PADDING : padding;
        _chart.margins().bottom += _xAxisLabelPadding;
        return _chart;
    };

    _chart._prepareYAxis = function (g) {
        if (_y === undefined || _chart.elasticY()) {
            if (_y === undefined) {
                _y = d3.scale.linear();
            }
            const min = _chart.yAxisMin() || 0,
                max = _chart.yAxisMax() || 0;
            _y.domain([min, max]).rangeRound([_chart.yAxisHeight(), 0]);
        }

        _y.range([_chart.yAxisHeight(), 0]);
        _yAxis = _yAxis.scale(_y);

        if (_useRightYAxis) {
            _yAxis.orient('right');
        }

        _chart._renderHorizontalGridLinesForAxis(g, _y, _yAxis);
    };

    _chart.renderYAxisLabel = function (axisClass, text, rotation, labelXPosition) {
        labelXPosition = labelXPosition || _yAxisLabelPadding;

        let axisYLab = _chart.g().select(`text.${Y_AXIS_LABEL_CLASS}.${axisClass}-label`);
        const labelYPosition = (_chart.margins().top + _chart.yAxisHeight() / 2);
        if (axisYLab.empty() && text) {
            axisYLab = _chart.g().append('text')
                .attr('transform', `translate(${labelXPosition}, ${labelYPosition}),rotate(${rotation})`)
                .attr('class', `${Y_AXIS_LABEL_CLASS} ${axisClass}-label`)
                .attr('text-anchor', 'middle')
                .text(text);
        }
        if (text && axisYLab.text() !== text) {
            axisYLab.text(text);
        }
        transition(axisYLab, _chart.transitionDuration(), _chart.transitionDelay())
            .attr('transform', `translate(${labelXPosition}, ${labelYPosition}),rotate(${rotation})`);
    };

    _chart.renderYAxisAt = function (axisClass, axis, position) {
        let axisYG = _chart.g().select(`g.${axisClass}`);
        if (axisYG.empty()) {
            axisYG = _chart.g().append('g')
                .attr('class', `axis ${axisClass}`)
                .attr('transform', `translate(${position}, ${_chart.margins().top})`);
        }

        transition(axisYG, _chart.transitionDuration(), _chart.transitionDelay())
            .attr('transform', `translate(${position}, ${_chart.margins().top})`)
            .call(axis);
    };

    _chart.renderYAxis = function () {
        const axisPosition = _useRightYAxis ? (_chart.width() - _chart.margins().right) : _chart._yAxisX();
        _chart.renderYAxisAt('y', _yAxis, axisPosition);
        const labelPosition = _useRightYAxis ? (_chart.width() - _yAxisLabelPadding) : _yAxisLabelPadding;
        const rotation = _useRightYAxis ? 90 : -90;
        _chart.renderYAxisLabel('y', _chart.yAxisLabel(), rotation, labelPosition);
    };

    _chart._renderHorizontalGridLinesForAxis = function (g, scale, axis) {
        let gridLineG = g.select(`g.${HORIZONTAL_CLASS}`);

        if (_renderHorizontalGridLine) {
            const ticks = axis.tickValues() ? axis.tickValues() : scale.ticks(axis.ticks()[0]);

            if (gridLineG.empty()) {
                gridLineG = g.insert('g', ':first-child')
                    .attr('class', `${GRID_LINE_CLASS} ${HORIZONTAL_CLASS}`)
                    .attr('transform', `translate(${_chart.margins().left}, ${_chart.margins().top})`);
            }

            const lines = gridLineG.selectAll('line')
                .data(ticks);

            // enter
            const linesGEnter = lines.enter()
                .append('line')
                .attr('x1', 1)
                .attr('y1', scale)
                .attr('x2', _chart.xAxisLength())
                .attr('y2', scale)
                .attr('opacity', 0);
            transition(linesGEnter, _chart.transitionDuration(), _chart.transitionDelay())
                .attr('opacity', 1);

            // update
            transition(lines, _chart.transitionDuration(), _chart.transitionDelay())
                .attr('x1', 1)
                .attr('y1', scale)
                .attr('x2', _chart.xAxisLength())
                .attr('y2', scale);

            // exit
            lines.exit().remove();
        } else {
            gridLineG.selectAll('line').remove();
        }
    };

    _chart._yAxisX = function () {
        return _chart.useRightYAxis() ? _chart.width() - _chart.margins().right : _chart.margins().left;
    };

    /**
     * Set or get the y axis label. If setting the label, you may optionally include additional padding
     * to the margin to make room for the label. By default the padding is set to 12 to accommodate the
     * text height.
     * @method yAxisLabel
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {String} [labelText]
     * @param {Number} [padding=12]
     * @returns {String|dc.coordinateGridMixin}
     */
    _chart.yAxisLabel = function (labelText, padding) {
        if (!arguments.length) {
            return _yAxisLabel;
        }
        _yAxisLabel = labelText;
        _chart.margins().left -= _yAxisLabelPadding;
        _yAxisLabelPadding = (padding === undefined) ? DEFAULT_AXIS_LABEL_PADDING : padding;
        _chart.margins().left += _yAxisLabelPadding;
        return _chart;
    };

    /**
     * Get or set the y scale. The y scale is typically automatically determined by the chart implementation.
     * @method y
     * @memberof dc.coordinateGridMixin
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Scales.md d3.scale}
     * @param {d3.scale} [yScale]
     * @returns {d3.scale|dc.coordinateGridMixin}
     */
    _chart.y = function (yScale) {
        if (!arguments.length) {
            return _y;
        }
        _y = yScale;
        _chart.rescale();
        return _chart;
    };

    /**
     * Set or get the y axis used by the coordinate grid chart instance. This function is most useful
     * when y axis customization is required. The y axis in dc.js is simply an instance of a [d3 axis
     * object](https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md#axis); therefore it supports any
     * valid d3 axis manipulation.
     *
     * **Caution**: The y axis is usually generated internally by dc; resetting it may cause
     * unexpected results.  Note also that when used as a getter, this function is not chainable: it
     * returns the axis, not the chart,
     * {@link https://github.com/dc-js/dc.js/wiki/FAQ#why-does-everything-break-after-a-call-to-xaxis-or-yaxis
     * so attempting to call chart functions after calling `.yAxis()` will fail}.
     * @method yAxis
     * @memberof dc.coordinateGridMixin
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md#axis d3.svg.axis}
     * @example
     * // customize y axis tick format
     * chart.yAxis().tickFormat(function(v) {return v + '%';});
     * // customize y axis tick values
     * chart.yAxis().tickValues([0, 100, 200, 300]);
     * @param {d3.svg.axis} [yAxis=d3.svg.axis().orient('left')]
     * @returns {d3.svg.axis|dc.coordinateGridMixin}
     */
    _chart.yAxis = function (yAxis) {
        if (!arguments.length) {
            return _yAxis;
        }
        _yAxis = yAxis;
        return _chart;
    };

    /**
     * Turn on/off elastic y axis behavior. If y axis elasticity is turned on, then the grid chart will
     * attempt to recalculate the y axis range whenever a redraw event is triggered.
     * @method elasticY
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {Boolean} [elasticY=false]
     * @returns {Boolean|dc.coordinateGridMixin}
     */
    _chart.elasticY = function (elasticY) {
        if (!arguments.length) {
            return _yElasticity;
        }
        _yElasticity = elasticY;
        return _chart;
    };

    /**
     * Turn on/off horizontal grid lines.
     * @method renderHorizontalGridLines
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {Boolean} [renderHorizontalGridLines=false]
     * @returns {Boolean|dc.coordinateGridMixin}
     */
    _chart.renderHorizontalGridLines = function (renderHorizontalGridLines) {
        if (!arguments.length) {
            return _renderHorizontalGridLine;
        }
        _renderHorizontalGridLine = renderHorizontalGridLines;
        return _chart;
    };

    /**
     * Turn on/off vertical grid lines.
     * @method renderVerticalGridLines
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {Boolean} [renderVerticalGridLines=false]
     * @returns {Boolean|dc.coordinateGridMixin}
     */
    _chart.renderVerticalGridLines = function (_) {
        if (!arguments.length) {
            return _renderVerticalGridLine;
        }
        _renderVerticalGridLine = _;
        return _chart;
    };

    /**
     * Calculates the minimum x value to display in the chart. Includes xAxisPadding if set.
     * @method xAxisMin
     * @memberof dc.coordinateGridMixin
     * @instance
     * @returns {*}
     */
    _chart.xAxisMin = function () {
        const min = d3.min(_chart.data(), _chart.keyAccessor());
        return utils.subtract(min, _xAxisPadding, _xAxisPaddingUnit);
    };

    /**
     * Calculates the maximum x value to display in the chart. Includes xAxisPadding if set.
     * @method xAxisMax
     * @memberof dc.coordinateGridMixin
     * @instance
     * @returns {*}
     */
    _chart.xAxisMax = function () {
        const max = d3.max(_chart.data(), _chart.keyAccessor());
        return utils.add(max, _xAxisPadding, _xAxisPaddingUnit);
    };

    /**
     * Calculates the minimum y value to display in the chart. Includes yAxisPadding if set.
     * @method yAxisMin
     * @memberof dc.coordinateGridMixin
     * @instance
     * @returns {*}
     */
    _chart.yAxisMin = function () {
        const min = d3.min(_chart.data(), _chart.valueAccessor());
        return utils.subtract(min, _yAxisPadding);
    };

    /**
     * Calculates the maximum y value to display in the chart. Includes yAxisPadding if set.
     * @method yAxisMax
     * @memberof dc.coordinateGridMixin
     * @instance
     * @returns {*}
     */
    _chart.yAxisMax = function () {
        const max = d3.max(_chart.data(), _chart.valueAccessor());
        return utils.add(max, _yAxisPadding);
    };

    /**
     * Set or get y axis padding for the elastic y axis. The padding will be added to the top and
     * bottom of the y axis if elasticY is turned on; otherwise it is ignored.
     *
     * Padding can be an integer or percentage in string (e.g. '10%'). Padding can be applied to
     * number or date axes. When padding a date axis, an integer represents number of days being padded
     * and a percentage string will be treated the same as an integer.
     * @method yAxisPadding
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {Number|String} [padding=0]
     * @returns {Number|dc.coordinateGridMixin}
     */
    _chart.yAxisPadding = function (padding) {
        if (!arguments.length) {
            return _yAxisPadding;
        }
        _yAxisPadding = padding;
        return _chart;
    };

    _chart.yAxisHeight = function () {
        return _chart.effectiveHeight();
    };

    /**
     * Set or get the rounding function used to quantize the selection when brushing is enabled.
     * @method round
     * @memberof dc.coordinateGridMixin
     * @instance
     * @example
     * // set x unit round to by month, this will make sure range selection brush will
     * // select whole months
     * chart.round(d3.time.month.round);
     * @param {Function} [round]
     * @returns {Function|dc.coordinateGridMixin}
     */
    _chart.round = function (round) {
        if (!arguments.length) {
            return _round;
        }
        _round = round;
        return _chart;
    };

    _chart._rangeBandPadding = function (_) {
        if (!arguments.length) {
            return _rangeBandPadding;
        }
        _rangeBandPadding = _;
        return _chart;
    };

    _chart._outerRangeBandPadding = function (_) {
        if (!arguments.length) {
            return _outerRangeBandPadding;
        }
        _outerRangeBandPadding = _;
        return _chart;
    };

    override(_chart, 'filter', function (_) {
        if (!arguments.length) {
            return _chart._filter();
        }

        _chart._filter(_);

        if (_) {
            _chart.brush().extent(_);
        } else {
            _chart.brush().clear();
        }

        return _chart;
    });

    _chart.brush = function (_) {
        if (!arguments.length) {
            return _brush;
        }
        _brush = _;
        return _chart;
    };

    function brushHeight () {
        return _chart._xAxisY() - _chart.margins().top;
    }

    _chart.renderBrush = function (g) {
        if (_brushOn) {
            _brush.on('brush', _chart._brushing);
            _brush.on('brushstart', _chart._disableMouseZoom);
            _brush.on('brushend', configureMouseZoom);

            const gBrush = g.append('g')
                .attr('class', 'brush')
                .attr('transform', `translate(${_chart.margins().left}, ${_chart.margins().top})`)
                .call(_brush.x(_chart.x()));
            _chart.setBrushY(gBrush, false);
            _chart.setHandlePaths(gBrush);

            if (_chart.hasFilter()) {
                _chart.redrawBrush(g, false);
            }
        }
    };

    _chart.setHandlePaths = function (gBrush) {
        gBrush.selectAll('.resize').append('path').attr('d', _chart.resizeHandlePath);
    };

    _chart.setBrushY = function (gBrush) {
        gBrush.selectAll('rect')
            .attr('height', brushHeight());
        gBrush.selectAll('.resize path')
            .attr('d', _chart.resizeHandlePath);
    };

    _chart.extendBrush = function () {
        const extent = _brush.extent();
        if (_chart.round()) {
            [extent[0], extent[1]] = extent.map(_chart.round());

            _g.select('.brush')
                .call(_brush.extent(extent));
        }
        return extent;
    };

    _chart.brushIsEmpty = function (extent) {
        return _brush.empty() || !extent || extent[1] <= extent[0];
    };

    _chart._brushing = function () {
        const extent = _chart.extendBrush();

        _chart.redrawBrush(_g, false);

        if (_chart.brushIsEmpty(extent)) {
            trigger(() => {
                _chart.filter(null);
                _chart.redrawGroup();
            }, constants.EVENT_DELAY);
        } else {
            const rangedFilter = RangedFilter(extent[0], extent[1]);

            trigger(() => {
                _chart.replaceFilter(rangedFilter);
                _chart.redrawGroup();
            }, constants.EVENT_DELAY);
        }
    };

    _chart.redrawBrush = function (g, doTransition) {
        if (_brushOn) {
            if (_chart.filter() && _chart.brush().empty()) {
                _chart.brush().extent(_chart.filter());
            }

            const gBrush = optionalTransition(doTransition, _chart.transitionDuration(), _chart.transitionDelay())(g.select('g.brush'));
            _chart.setBrushY(gBrush);
            gBrush.call(_chart.brush()
                .x(_chart.x())
                .extent(_chart.brush().extent()));
        }

        _chart.fadeDeselectedArea();
    };

    _chart.fadeDeselectedArea = function () {
        // do nothing, sub-chart should override this function
    };

    // borrowed from Crossfilter example
    _chart.resizeHandlePath = function (d) {
        const e = +(d === 'e'),
            x = e ? 1 : -1,
            y = brushHeight() / 3;
        return `M${0.5 * x},${y}A6,6 0 0 ${e} ${6.5 * x}, ${y + 6}V${2 * y - 6}A6,6 0 0 ${e} ${0.5 * x},${2 * y}` +
                `ZM${2.5 * x},${y + 8},V${2 * y - 8}M${4.5 * x},${y + 8}V${2 * y - 8}`;
    };

    function getClipPathId () {
        return `${_chart.anchorName().replace(/[ .#=[\]"]/g, '-')}-clip`;
    }

    /**
     * Get or set the padding in pixels for the clip path. Once set padding will be applied evenly to
     * the top, left, right, and bottom when the clip path is generated. If set to zero, the clip area
     * will be exactly the chart body area minus the margins.
     * @method clipPadding
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {Number} [padding=5]
     * @returns {Number|dc.coordinateGridMixin}
     */
    _chart.clipPadding = function (padding) {
        if (!arguments.length) {
            return _clipPadding;
        }
        _clipPadding = padding;
        return _chart;
    };

    function generateClipPath () {
        const defs = utils.appendOrSelect(_parent, 'defs');
        // cannot select <clippath> elements; bug in WebKit, must select by id
        // https://groups.google.com/forum/#!topic/d3-js/6EpAzQ2gU9I
        const id = getClipPathId();
        const chartBodyClip = utils.appendOrSelect(defs, `#${id}`, 'clipPath').attr('id', id);

        const padding = _clipPadding * 2;

        utils.appendOrSelect(chartBodyClip, 'rect')
            .attr('width', _chart.xAxisLength() + padding)
            .attr('height', _chart.yAxisHeight() + padding)
            .attr('transform', `translate(-${_clipPadding}, -${_clipPadding})`);
    }

    _chart._preprocessData = function () {};

    _chart._doRender = function () {
        _chart.resetSvg();

        _chart._preprocessData();

        _chart._generateG();
        generateClipPath();

        drawChart(true);

        configureMouseZoom();

        return _chart;
    };

    _chart._doRedraw = function () {
        _chart._preprocessData();

        drawChart(false);
        generateClipPath();

        return _chart;
    };

    function drawChart (render) {
        if (_chart.isOrdinal()) {
            _brushOn = false;
        }

        prepareXAxis(_chart.g(), render);
        _chart._prepareYAxis(_chart.g());

        _chart.plotData();

        if (_chart.elasticX() || _resizing || render) {
            _chart.renderXAxis(_chart.g());
        }

        if (_chart.elasticY() || _resizing || render) {
            _chart.renderYAxis(_chart.g());
        }

        if (render) {
            _chart.renderBrush(_chart.g(), false);
        } else {
            _chart.redrawBrush(_chart.g(), _resizing);
        }
        _chart.fadeDeselectedArea();
        _resizing = false;
    }

    function configureMouseZoom () {
        if (_mouseZoomable) {
            _chart._enableMouseZoom();
        } else if (_hasBeenMouseZoomable) {
            _chart._disableMouseZoom();
        }
    }

    _chart._enableMouseZoom = function () {
        _hasBeenMouseZoomable = true;
        _zoom.x(_chart.x())
            .scaleExtent(_zoomScale)
            .size([_chart.width(), _chart.height()])
            .duration(_chart.transitionDuration());
        _chart.root().call(_zoom);
    };

    _chart._disableMouseZoom = function () {
        _chart.root().call(_nullZoom);
    };

    function zoomHandler () {
        _refocused = true;
        if (_zoomOutRestrict) {
            let constraint = _xOriginalDomain;
            if (_rangeChart) {
                constraint = intersectExtents(constraint, _rangeChart.x().domain());
            }
            const constrained = constrainExtent(_chart.x().domain(), constraint);
            if (constrained) {
                _chart.x().domain(constrained);
            }
        }

        const domain = _chart.x().domain();
        const domFilter = RangedFilter(domain[0], domain[1]);

        _chart.replaceFilter(domFilter);
        _chart.rescale();
        _chart.redraw();

        if (_rangeChart && !rangesEqual(_chart.filter(), _rangeChart.filter())) {
            trigger(() => {
                _rangeChart.replaceFilter(domFilter);
                _rangeChart.redraw();
            });
        }

        _chart._invokeZoomedListener();

        trigger(_chart.redrawGroup, constants.EVENT_DELAY);

        _refocused = !rangesEqual(domain, _xOriginalDomain);
    }

    function intersectExtents (ext1, ext2) {
        if (ext1[0] > ext2[1] || ext1[1] < ext2[0]) {
            console.warn('could not intersect extents');
        }
        return [Math.max(ext1[0], ext2[0]), Math.min(ext1[1], ext2[1])];
    }

    function constrainExtent (extent, constraint) {
        const size = extent[1] - extent[0];
        if (extent[0] < constraint[0]) {
            return [constraint[0], Math.min(constraint[1], utils.add(constraint[0], size, 'millis'))];
        } else if (extent[1] > constraint[1]) {
            return [Math.max(constraint[0], utils.subtract(constraint[1], size, 'millis')), constraint[1]];
        }
        return null;
    }

    /**
     * Zoom this chart to focus on the given range. The given range should be an array containing only
     * 2 elements (`[start, end]`) defining a range in the x domain. If the range is not given or set
     * to null, then the zoom will be reset. _For focus to work elasticX has to be turned off;
     * otherwise focus will be ignored.
     * @method focus
     * @memberof dc.coordinateGridMixin
     * @instance
     * @example
     * chart.on('renderlet', function(chart) {
     *     // smooth the rendering through event throttling
     *     dc.events.trigger(function(){
     *          // focus some other chart to the range selected by user on this chart
     *          someOtherChart.focus(chart.filter());
     *     });
     * })
     * @param {Array<Number>} [range]
     */
    _chart.focus = function (range) {
        if (hasRangeSelected(range)) {
            _chart.x().domain(range);
        } else {
            _chart.x().domain(_xOriginalDomain);
        }

        _zoom.x(_chart.x());
        zoomHandler();
    };

    _chart.refocused = function () {
        return _refocused;
    };

    _chart.focusChart = function (c) {
        if (!arguments.length) {
            return _focusChart;
        }
        _focusChart = c;
        _chart.on('filtered', (chart) => {
            if (!chart.filter()) {
                trigger(() => _focusChart.x().domain(_focusChart.xOriginalDomain()));
            } else if (!rangesEqual(chart.filter(), _focusChart.filter())) {
                trigger(() => _focusChart.focus(chart.filter()));
            }
        });
        return _chart;
    };

    function rangesEqual (range1, range2) {
        if (!range1 && !range2) {
            return true;
        } else if (!range1 || !range2) {
            return false;
        } else if (range1.length === 0 && range2.length === 0) {
            return true;
        } else if (range1[0].valueOf() === range2[0].valueOf() &&
            range1[1].valueOf() === range2[1].valueOf()) {
            return true;
        }
        return false;
    }

    /**
     * Turn on/off the brush-based range filter. When brushing is on then user can drag the mouse
     * across a chart with a quantitative scale to perform range filtering based on the extent of the
     * brush, or click on the bars of an ordinal bar chart or slices of a pie chart to filter and
     * un-filter them. However turning on the brush filter will disable other interactive elements on
     * the chart such as highlighting, tool tips, and reference lines. Zooming will still be possible
     * if enabled, but only via scrolling (panning will be disabled.)
     * @method brushOn
     * @memberof dc.coordinateGridMixin
     * @instance
     * @param {Boolean} [brushOn=true]
     * @returns {Boolean|dc.coordinateGridMixin}
     */
    _chart.brushOn = function (brushOn) {
        if (!arguments.length) {
            return _brushOn;
        }
        _brushOn = brushOn;
        return _chart;
    };

    function hasRangeSelected (range) {
        return range instanceof Array && range.length > 1;
    }

    return _chart;
}
