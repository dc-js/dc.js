import * as d3 from 'd3';
import stackMixin from './stack-mixin';
import coordinateGridMixin from './coordinate-grid-mixin';
import {override, transition} from './core';
import {pluck, utils} from './utils';

/**
 * Concrete line/area chart implementation.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
 * - {@link http://dc-js.github.com/dc.js/crime/index.html Canadian City Crime Stats}
 * @class lineChart
 * @memberof dc
 * @mixes dc.stackMixin
 * @mixes dc.coordinateGridMixin
 * @example
 * // create a line chart under #chart-container1 element using the default global chart group
 * let chart1 = dc.lineChart('#chart-container1');
 * // create a line chart under #chart-container2 element using chart group A
 * let chart2 = dc.lineChart('#chart-container2', 'chartGroupA');
 * // create a sub-chart under a composite parent chart
 * let chart3 = dc.lineChart(compositeChart);
 * @param {String|node|d3.selection|dc.compositeChart} parent - Any valid
 * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Selections.md#selecting-elements d3 single selector}
 * specifying a dom block element such as a div; or a dom element or d3 selection.  If the line
 * chart is a sub-chart in a {@link dc.compositeChart Composite Chart} then pass in the parent
 * composite chart instance instead.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.lineChart}
 */
export default function lineChart (parent, chartGroup) {
    const DEFAULT_DOT_RADIUS = 5;
    const TOOLTIP_G_CLASS = 'dc-tooltip';
    const DOT_CIRCLE_CLASS = 'dot';
    const Y_AXIS_REF_LINE_CLASS = 'yRef';
    const X_AXIS_REF_LINE_CLASS = 'xRef';
    const DEFAULT_DOT_OPACITY = 1e-6;
    const LABEL_PADDING = 3;

    const _chart = stackMixin(coordinateGridMixin({}));
    let _renderArea = false;
    let _dotRadius = DEFAULT_DOT_RADIUS;
    let _dataPointRadius = null;
    let _dataPointFillOpacity = DEFAULT_DOT_OPACITY;
    let _dataPointStrokeOpacity = DEFAULT_DOT_OPACITY;
    let _interpolate = 'linear';
    let _tension = 0.7;
    let _defined;
    let _dashStyle;
    let _xyTipsOn = true;

    _chart.transitionDuration(500);
    _chart.transitionDelay(0);
    _chart._rangeBandPadding(1);

    _chart.plotData = function () {
        const chartBody = _chart.chartBodyG();
        let layersList = chartBody.select('g.stack-list');

        if (layersList.empty()) {
            layersList = chartBody.append('g').attr('class', 'stack-list');
        }

        const layers = layersList.selectAll('g.stack').data(_chart.data());

        const layersEnter = layers
            .enter()
            .append('g')
            .attr('class', (d, i) => `stack _${i}`);

        drawLine(layersEnter, layers);

        drawArea(layersEnter, layers);

        drawDots(chartBody, layers);

        if (_chart.renderLabel()) {
            drawLabels(layers);
        }
    };

    /**
     * Gets or sets the interpolator to use for lines drawn, by string name, allowing e.g. step
     * functions, splines, and cubic interpolation.  This is passed to
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#line_interpolate d3.svg.line.interpolate} and
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#area_interpolate d3.svg.area.interpolate},
     * where you can find a complete list of valid arguments.
     * @method interpolate
     * @memberof dc.lineChart
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#line_interpolate d3.svg.line.interpolate}
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#area_interpolate d3.svg.area.interpolate}
     * @param  {String} [interpolate='linear']
     * @returns {String|dc.lineChart}
     */
    _chart.interpolate = function (interpolate) {
        if (!arguments.length) {
            return _interpolate;
        }
        _interpolate = interpolate;
        return _chart;
    };

    /**
     * Gets or sets the tension to use for lines drawn, in the range 0 to 1.
     * This parameter further customizes the interpolation behavior.  It is passed to
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#line_tension d3.svg.line.tension} and
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#area_tension d3.svg.area.tension}.
     * @method tension
     * @memberof dc.lineChart
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#line_interpolate d3.svg.line.interpolate}
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#area_interpolate d3.svg.area.interpolate}
     * @param  {Number} [tension=0.7]
     * @returns {Number|dc.lineChart}
     */
    _chart.tension = function (tension) {
        if (!arguments.length) {
            return _tension;
        }
        _tension = tension;
        return _chart;
    };

    /**
     * Gets or sets a function that will determine discontinuities in the line which should be
     * skipped: the path will be broken into separate subpaths if some points are undefined.
     * This function is passed to
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#line_defined d3.svg.line.defined}
     *
     * Note: crossfilter will sometimes coerce nulls to 0, so you may need to carefully write
     * custom reduce functions to get this to work, depending on your data. See
     * {@link https://github.com/dc-js/dc.js/issues/615#issuecomment-49089248 this GitHub comment}
     * for more details and an example.
     * @method defined
     * @memberof dc.lineChart
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#line_defined d3.svg.line.defined}
     * @param  {Function} [defined]
     * @returns {Function|dc.lineChart}
     */
    _chart.defined = function (defined) {
        if (!arguments.length) {
            return _defined;
        }
        _defined = defined;
        return _chart;
    };

    /**
     * Set the line's d3 dashstyle. This value becomes the 'stroke-dasharray' of line. Defaults to empty
     * array (solid line).
     * @method dashStyle
     * @memberof dc.lineChart
     * @instance
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray stroke-dasharray}
     * @example
     * // create a Dash Dot Dot Dot
     * chart.dashStyle([3,1,1,1]);
     * @param  {Array<Number>} [dashStyle=[]]
     * @returns {Array<Number>|dc.lineChart}
     */
    _chart.dashStyle = function (dashStyle) {
        if (!arguments.length) {
            return _dashStyle;
        }
        _dashStyle = dashStyle;
        return _chart;
    };

    /**
     * Get or set render area flag. If the flag is set to true then the chart will render the area
     * beneath each line and the line chart effectively becomes an area chart.
     * @method renderArea
     * @memberof dc.lineChart
     * @instance
     * @param  {Boolean} [renderArea=false]
     * @returns {Boolean|dc.lineChart}
     */
    _chart.renderArea = function (renderArea) {
        if (!arguments.length) {
            return _renderArea;
        }
        _renderArea = renderArea;
        return _chart;
    };

    function colors (d, i) {
        return _chart.getColor.call(d, d.values, i);
    }

    function drawLine (layersEnter, layers) {
        const line = d3.svg.line()
            .x(d => _chart.x()(d.x))
            .y(d => _chart.y()(d.y + d.y0))
            .interpolate(_interpolate)
            .tension(_tension);
        if (_defined) {
            line.defined(_defined);
        }

        const path = layersEnter.append('path')
            .attr('class', 'line')
            .attr('stroke', colors);
        if (_dashStyle) {
            path.attr('stroke-dasharray', _dashStyle);
        }

        transition(layers.select('path.line'), _chart.transitionDuration(), _chart.transitionDelay())
            .attr('stroke', colors)
            .attr('d', d => safeD(line(d.values)));
    }

    function drawArea (layersEnter, layers) {
        if (_renderArea) {
            const area = d3.svg.area()
                .x(d => _chart.x()(d.x))
                .y(d => _chart.y()(d.y + d.y0))
                .y0(d => _chart.y()(d.y0))
                .interpolate(_interpolate)
                .tension(_tension);
            if (_defined) {
                area.defined(_defined);
            }

            layersEnter.append('path')
                .attr('class', 'area')
                .attr('fill', colors)
                .attr('d', d => safeD(area(d.values)));

            transition(layers.select('path.area'), _chart.transitionDuration(), _chart.transitionDelay())
                .attr('fill', colors)
                .attr('d', d => safeD(area(d.values)));
        }
    }

    function safeD (d) {
        return (!d || d.indexOf('NaN') >= 0) ? 'M0,0' : d;
    }

    function drawDots (chartBody, layers) {
        if (_chart.xyTipsOn() === 'always' || (!_chart.brushOn() && _chart.xyTipsOn())) {
            const tooltipListClass = `${TOOLTIP_G_CLASS}-list`;
            let tooltips = chartBody.select(`g.${tooltipListClass}`);

            if (tooltips.empty()) {
                tooltips = chartBody.append('g').attr('class', tooltipListClass);
            }

            layers.each((datum, layerIndex) => {
                let points = datum.values;
                if (_defined) {
                    points = points.filter(_defined);
                }

                let g = tooltips.select(`g.${TOOLTIP_G_CLASS}._${layerIndex}`);
                if (g.empty()) {
                    g = tooltips.append('g').attr('class', `${TOOLTIP_G_CLASS} _${layerIndex}`);
                }

                createRefLines(g);

                const dots = g.selectAll(`circle.${DOT_CIRCLE_CLASS}`)
                    .data(points, pluck('x'));

                dots.enter()
                    .append('circle')
                    .attr('class', DOT_CIRCLE_CLASS)
                    .attr('r', getDotRadius())
                    .style('fill-opacity', _dataPointFillOpacity)
                    .style('stroke-opacity', _dataPointStrokeOpacity)
                    .attr('fill', _chart.getColor)
                    .on('mousemove', function () {
                        const dot = d3.select(this);
                        showDot(dot);
                        showRefLines(dot, g);
                    })
                    .on('mouseout', function () {
                        const dot = d3.select(this);
                        hideDot(dot);
                        hideRefLines(g);
                    });

                dots.call(renderTitle, datum);

                transition(dots, _chart.transitionDuration())
                    .attr('cx', d => utils.safeNumber(_chart.x()(d.x)))
                    .attr('cy', d => utils.safeNumber(_chart.y()(d.y + d.y0)))
                    .attr('fill', _chart.getColor);

                dots.exit().remove();
            });
        }
    }

    _chart.label(d => utils.printSingleValue(d.y0 + d.y), false);

    function drawLabels (layers) {
        layers.each(function (datum) {
            const layer = d3.select(this);
            const labels = layer.selectAll('text.lineLabel')
                .data(datum.values, pluck('x'));

            labels.enter()
                .append('text')
                .attr('class', 'lineLabel')
                .attr('text-anchor', 'middle');

            transition(labels, _chart.transitionDuration())
                .attr('x', d => utils.safeNumber(_chart.x()(d.x)))
                .attr('y', d => utils.safeNumber(_chart.y()(d.y + d.y0) - LABEL_PADDING))
                .text(_chart.label());

            transition(labels.exit(), _chart.transitionDuration())
                .attr('height', 0)
                .remove();
        });
    }

    function createRefLines (g) {
        const yRefLine = g.select(`path.${Y_AXIS_REF_LINE_CLASS}`).empty() ?
            g.append('path').attr('class', Y_AXIS_REF_LINE_CLASS) : g.select(`path.${Y_AXIS_REF_LINE_CLASS}`);
        yRefLine.style('display', 'none').attr('stroke-dasharray', '5,5');

        const xRefLine = g.select(`path.${X_AXIS_REF_LINE_CLASS}`).empty() ?
            g.append('path').attr('class', X_AXIS_REF_LINE_CLASS) : g.select(`path.${X_AXIS_REF_LINE_CLASS}`);
        xRefLine.style('display', 'none').attr('stroke-dasharray', '5,5');
    }

    function showDot (dot) {
        dot.style('fill-opacity', 0.8);
        dot.style('stroke-opacity', 0.8);
        dot.attr('r', _dotRadius);
        return dot;
    }

    function showRefLines (dot, g) {
        const x = dot.attr('cx');
        const y = dot.attr('cy');
        const yAxisX = (_chart._yAxisX() - _chart.margins().left);
        const yAxisRefPathD = `M${yAxisX} ${y}L${x} ${y}`;
        const xAxisRefPathD = `M${x} ${_chart.yAxisHeight()}L${x} ${y}`;
        g.select(`path.${Y_AXIS_REF_LINE_CLASS}`).style('display', '').attr('d', yAxisRefPathD);
        g.select(`path.${X_AXIS_REF_LINE_CLASS}`).style('display', '').attr('d', xAxisRefPathD);
    }

    function getDotRadius () {
        return _dataPointRadius || _dotRadius;
    }

    function hideDot (dot) {
        dot.style('fill-opacity', _dataPointFillOpacity)
            .style('stroke-opacity', _dataPointStrokeOpacity)
            .attr('r', getDotRadius());
    }

    function hideRefLines (g) {
        g.select(`path.${Y_AXIS_REF_LINE_CLASS}`).style('display', 'none');
        g.select(`path.${X_AXIS_REF_LINE_CLASS}`).style('display', 'none');
    }

    function renderTitle (dot, d) {
        if (_chart.renderTitle()) {
            dot.select('title').remove();
            dot.append('title').text(pluck('data', _chart.title(d.name)));
        }
    }

    /**
     * Turn on/off the mouseover behavior of an individual data point which renders a circle and x/y axis
     * dashed lines back to each respective axis.  This is ignored if the chart
     * {@link dc.coordinateGridMixin#brushOn brush} is on
     * @method xyTipsOn
     * @memberof dc.lineChart
     * @instance
     * @param  {Boolean} [xyTipsOn=false]
     * @returns {Boolean|dc.lineChart}
     */
    _chart.xyTipsOn = function (xyTipsOn) {
        if (!arguments.length) {
            return _xyTipsOn;
        }
        _xyTipsOn = xyTipsOn;
        return _chart;
    };

    /**
     * Get or set the radius (in px) for dots displayed on the data points.
     * @method dotRadius
     * @memberof dc.lineChart
     * @instance
     * @param  {Number} [dotRadius=5]
     * @returns {Number|dc.lineChart}
     */
    _chart.dotRadius = function (dotRadius) {
        if (!arguments.length) {
            return _dotRadius;
        }
        _dotRadius = dotRadius;
        return _chart;
    };

    /**
     * Always show individual dots for each datapoint.
     *
     * If `options` is falsy, it disables data point rendering. If no `options` are provided, the
     * current `options` values are instead returned.
     * @method renderDataPoints
     * @memberof dc.lineChart
     * @instance
     * @example
     * chart.renderDataPoints({radius: 2, fillOpacity: 0.8, strokeOpacity: 0.8})
     * @param  {{fillOpacity: Number, strokeOpacity: Number, radius: Number}} [options={fillOpacity: 0.8, strokeOpacity: 0.8, radius: 2}]
     * @returns {{fillOpacity: Number, strokeOpacity: Number, radius: Number}|dc.lineChart}
     */
    _chart.renderDataPoints = function (options) {
        if (!arguments.length) {
            return {
                fillOpacity: _dataPointFillOpacity,
                strokeOpacity: _dataPointStrokeOpacity,
                radius: _dataPointRadius
            };
        } else if (!options) {
            _dataPointFillOpacity = DEFAULT_DOT_OPACITY;
            _dataPointStrokeOpacity = DEFAULT_DOT_OPACITY;
            _dataPointRadius = null;
        } else {
            _dataPointFillOpacity = options.fillOpacity || 0.8;
            _dataPointStrokeOpacity = options.strokeOpacity || 0.8;
            _dataPointRadius = options.radius || 2;
        }
        return _chart;
    };

    function colorFilter (color, dashstyle, inv) {
        return function () {
            const item = d3.select(this);
            const match = (item.attr('stroke') === color &&
                item.attr('stroke-dasharray') === ((dashstyle instanceof Array) ?
                    dashstyle.join(',') : null)) || item.attr('fill') === color;
            return inv ? !match : match;
        };
    }

    _chart.legendHighlight = function (d) {
        if (!_chart.isLegendableHidden(d)) {
            _chart.g().selectAll('path.line, path.area')
                .classed('highlight', colorFilter(d.color, d.dashstyle))
                .classed('fadeout', colorFilter(d.color, d.dashstyle, true));
        }
    };

    _chart.legendReset = function () {
        _chart.g().selectAll('path.line, path.area')
            .classed('highlight', false)
            .classed('fadeout', false);
    };

    override(_chart, 'legendables', () => {
        const legendables = _chart._legendables();
        if (!_dashStyle) {
            return legendables;
        }
        return legendables.map((l) => {
            l.dashstyle = _dashStyle;
            return l;
        });
    });

    return _chart.anchor(parent, chartGroup);
}
