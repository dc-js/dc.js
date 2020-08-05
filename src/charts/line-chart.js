import {
    area,
    curveBasis,
    curveBasisClosed,
    curveBasisOpen,
    curveBundle,
    curveCardinal,
    curveCardinalClosed,
    curveCardinalOpen,
    curveLinear,
    curveLinearClosed,
    curveMonotoneX,
    curveStep,
    curveStepAfter,
    curveStepBefore,
    line
} from 'd3-shape';
import {select} from 'd3-selection';

import {logger} from '../core/logger';
import {pluck, utils} from '../core/utils';
import {StackMixin} from '../base/stack-mixin';
import {transition} from '../core/core';

const DEFAULT_DOT_RADIUS = 5;
const TOOLTIP_G_CLASS = 'dc-tooltip';
const DOT_CIRCLE_CLASS = 'dot';
const Y_AXIS_REF_LINE_CLASS = 'yRef';
const X_AXIS_REF_LINE_CLASS = 'xRef';
const DEFAULT_DOT_OPACITY = 1e-6;
const LABEL_PADDING = 3;

/**
 * Concrete line/area chart implementation.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
 * - {@link http://dc-js.github.com/dc.js/crime/index.html Canadian City Crime Stats}
 * @mixes StackMixin
 * @mixes CoordinateGridMixin
 */
export class LineChart extends StackMixin {
    /**
     * Create a Line Chart.
     * @example
     * // create a line chart under #chart-container1 element using the default global chart group
     * var chart1 = new LineChart('#chart-container1');
     * // create a line chart under #chart-container2 element using chart group A
     * var chart2 = new LineChart('#chart-container2', 'chartGroupA');
     * // create a sub-chart under a composite parent chart
     * var chart3 = new LineChart(compositeChart);
     * @param {String|node|d3.selection|CompositeChart} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector}
     * specifying a dom block element such as a div; or a dom element or d3 selection.  If the line
     * chart is a sub-chart in a {@link CompositeChart Composite Chart} then pass in the parent
     * composite chart instance instead.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor (parent, chartGroup) {
        super();

        this._renderArea = false;
        this._dotRadius = DEFAULT_DOT_RADIUS;
        this._dataPointRadius = null;
        this._dataPointFillOpacity = DEFAULT_DOT_OPACITY;
        this._dataPointStrokeOpacity = DEFAULT_DOT_OPACITY;
        this._curve = null;
        this._interpolate = null; // d3.curveLinear;  // deprecated in 3.0
        this._tension = null;  // deprecated in 3.0
        this._defined = undefined;
        this._dashStyle = undefined;
        this._xyTipsOn = true;

        this.transitionDuration(500);
        this.transitionDelay(0);
        this._rangeBandPadding(1);

        this.label(d => utils.printSingleValue(d.y0 + d.y), false);

        this.anchor(parent, chartGroup);
    }

    plotData () {
        const chartBody = this.chartBodyG();
        let layersList = chartBody.select('g.stack-list');

        if (layersList.empty()) {
            layersList = chartBody.append('g').attr('class', 'stack-list');
        }

        let layers = layersList.selectAll('g.stack').data(this.data());

        const layersEnter = layers
            .enter()
            .append('g')
            .attr('class', (d, i) => `stack _${i}`);

        layers = layersEnter.merge(layers);

        this._drawLine(layersEnter, layers);

        this._drawArea(layersEnter, layers);

        this._drawDots(chartBody, layers);

        if (this.renderLabel()) {
            this._drawLabels(layers);
        }
    }

    /**
     * Gets or sets the curve factory to use for lines and areas drawn, allowing e.g. step
     * functions, splines, and cubic interpolation. Typically you would use one of the interpolator functions
     * provided by {@link https://github.com/d3/d3-shape/blob/master/README.md#curves d3 curves}.
     *
     * Replaces the use of {@link LineChart#interpolate} and {@link LineChart#tension}
     * in dc.js < 3.0
     *
     * This is passed to
     * {@link https://github.com/d3/d3-shape/blob/master/README.md#line_curve line.curve} and
     * {@link https://github.com/d3/d3-shape/blob/master/README.md#area_curve area.curve}.
     * @example
     * // default
     * chart
     *     .curve(d3.curveLinear);
     * // Add tension to curves that support it
     * chart
     *     .curve(d3.curveCardinal.tension(0.5));
     * // You can use some specialized variation like
     * // https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline
     * chart
     *     .curve(d3.curveCatmullRom.alpha(0.5));
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#line_curve line.curve}
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#area_curve area.curve}
     * @param  {d3.curve} [curve=d3.curveLinear]
     * @returns {d3.curve|LineChart}
     */
    curve (curve) {
        if (!arguments.length) {
            return this._curve;
        }
        this._curve = curve;
        return this;
    }

    /**
     * Gets or sets the interpolator to use for lines drawn, by string name, allowing e.g. step
     * functions, splines, and cubic interpolation.
     *
     * Possible values are: 'linear', 'linear-closed', 'step', 'step-before', 'step-after', 'basis',
     * 'basis-open', 'basis-closed', 'bundle', 'cardinal', 'cardinal-open', 'cardinal-closed', and
     * 'monotone'.
     *
     * This function exists for backward compatibility. Use {@link LineChart#curve}
     * which is generic and provides more options.
     * Value set through `.curve` takes precedence over `.interpolate` and `.tension`.
     * @deprecated since version 3.0 use {@link LineChart#curve} instead
     * @see {@link LineChart#curve}
     * @param  {d3.curve} [interpolate=d3.curveLinear]
     * @returns {d3.curve|LineChart}
     */
    interpolate (interpolate) {
        logger.warnOnce('dc.lineChart.interpolate has been deprecated since version 3.0 use dc.lineChart.curve instead');
        if (!arguments.length) {
            return this._interpolate;
        }
        this._interpolate = interpolate;
        return this;
    }

    /**
     * Gets or sets the tension to use for lines drawn, in the range 0 to 1.
     *
     * Passed to the {@link https://github.com/d3/d3-shape/blob/master/README.md#curves d3 curve function}
     * if it provides a `.tension` function. Example:
     * {@link https://github.com/d3/d3-shape/blob/master/README.md#curveCardinal_tension curveCardinal.tension}.
     *
     * This function exists for backward compatibility. Use {@link LineChart#curve}
     * which is generic and provides more options.
     * Value set through `.curve` takes precedence over `.interpolate` and `.tension`.
     * @deprecated since version 3.0 use {@link LineChart#curve} instead
     * @see {@link LineChart#curve}
     * @param  {Number} [tension=0]
     * @returns {Number|LineChart}
     */
    tension (tension) {
        logger.warnOnce('dc.lineChart.tension has been deprecated since version 3.0 use dc.lineChart.curve instead');
        if (!arguments.length) {
            return this._tension;
        }
        this._tension = tension;
        return this;
    }

    /**
     * Gets or sets a function that will determine discontinuities in the line which should be
     * skipped: the path will be broken into separate subpaths if some points are undefined.
     * This function is passed to
     * {@link https://github.com/d3/d3-shape/blob/master/README.md#line_defined line.defined}
     *
     * Note: crossfilter will sometimes coerce nulls to 0, so you may need to carefully write
     * custom reduce functions to get this to work, depending on your data. See
     * {@link https://github.com/dc-js/dc.js/issues/615#issuecomment-49089248 this GitHub comment}
     * for more details and an example.
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#line_defined line.defined}
     * @param  {Function} [defined]
     * @returns {Function|LineChart}
     */
    defined (defined) {
        if (!arguments.length) {
            return this._defined;
        }
        this._defined = defined;
        return this;
    }

    /**
     * Set the line's d3 dashstyle. This value becomes the 'stroke-dasharray' of line. Defaults to empty
     * array (solid line).
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray stroke-dasharray}
     * @example
     * // create a Dash Dot Dot Dot
     * chart.dashStyle([3,1,1,1]);
     * @param  {Array<Number>} [dashStyle=[]]
     * @returns {Array<Number>|LineChart}
     */
    dashStyle (dashStyle) {
        if (!arguments.length) {
            return this._dashStyle;
        }
        this._dashStyle = dashStyle;
        return this;
    }

    /**
     * Get or set render area flag. If the flag is set to true then the chart will render the area
     * beneath each line and the line chart effectively becomes an area chart.
     * @param  {Boolean} [renderArea=false]
     * @returns {Boolean|LineChart}
     */
    renderArea (renderArea) {
        if (!arguments.length) {
            return this._renderArea;
        }
        this._renderArea = renderArea;
        return this;
    }

    _getColor (d, i) {
        return this.getColor.call(d, d.values, i);
    }

    // To keep it backward compatible, this covers multiple cases
    // See https://github.com/dc-js/dc.js/issues/1376
    // It will be removed when interpolate and tension are removed.
    _getCurveFactory () {
        let curve = null;

        // _curve takes precedence
        if (this._curve) {
            return this._curve;
        }

        // Approximate the D3v3 behavior
        if (typeof this._interpolate === 'function') {
            curve = this._interpolate;
        } else {
            // If _interpolate is string
            const mapping = {
                'linear': curveLinear,
                'linear-closed': curveLinearClosed,
                'step': curveStep,
                'step-before': curveStepBefore,
                'step-after': curveStepAfter,
                'basis': curveBasis,
                'basis-open': curveBasisOpen,
                'basis-closed': curveBasisClosed,
                'bundle': curveBundle,
                'cardinal': curveCardinal,
                'cardinal-open': curveCardinalOpen,
                'cardinal-closed': curveCardinalClosed,
                'monotone': curveMonotoneX
            };
            curve = mapping[this._interpolate];
        }

        // Default value
        if (!curve) {
            curve = curveLinear;
        }

        if (this._tension !== null) {
            if (typeof curve.tension !== 'function') {
                logger.warn('tension was specified but the curve/interpolate does not support it.');
            } else {
                curve = curve.tension(this._tension);
            }
        }
        return curve;
    }

    _drawLine (layersEnter, layers) {
        const _line = line()
            .x(d => this.x()(d.x))
            .y(d => this.y()(d.y + d.y0))
            .curve(this._getCurveFactory());
        if (this._defined) {
            _line.defined(this._defined);
        }

        const path = layersEnter.append('path')
            .attr('class', 'line')
            .attr('stroke', (d, i) => this._getColor(d, i));
        if (this._dashStyle) {
            path.attr('stroke-dasharray', this._dashStyle);
        }

        transition(layers.select('path.line'), this.transitionDuration(), this.transitionDelay())
        //.ease('linear')
            .attr('stroke', (d, i) => this._getColor(d, i))
            .attr('d', d => this._safeD(_line(d.values)));
    }

    _drawArea (layersEnter, layers) {
        if (this._renderArea) {
            const _area = area()
                .x(d => this.x()(d.x))
                .y1(d => this.y()(d.y + d.y0))
                .y0(d => this.y()(d.y0))
                .curve(this._getCurveFactory());
            if (this._defined) {
                _area.defined(this._defined);
            }

            layersEnter.append('path')
                .attr('class', 'area')
                .attr('fill', (d, i) => this._getColor(d, i))
                .attr('d', d => this._safeD(_area(d.values)));

            transition(layers.select('path.area'), this.transitionDuration(), this.transitionDelay())
            //.ease('linear')
                .attr('fill', (d, i) => this._getColor(d, i))
                .attr('d', d => this._safeD(_area(d.values)));
        }
    }

    _safeD (d) {
        return (!d || d.indexOf('NaN') >= 0) ? 'M0,0' : d;
    }

    _drawDots (chartBody, layers) {
        if (this.xyTipsOn() === 'always' || (!(this.brushOn() || this.parentBrushOn()) && this.xyTipsOn())) {
            const tooltipListClass = `${TOOLTIP_G_CLASS}-list`;
            let tooltips = chartBody.select(`g.${tooltipListClass}`);

            if (tooltips.empty()) {
                tooltips = chartBody.append('g').attr('class', tooltipListClass);
            }

            layers.each((data, layerIndex) => {
                let points = data.values;
                if (this._defined) {
                    points = points.filter(this._defined);
                }

                let g = tooltips.select(`g.${TOOLTIP_G_CLASS}._${layerIndex}`);
                if (g.empty()) {
                    g = tooltips.append('g').attr('class', `${TOOLTIP_G_CLASS} _${layerIndex}`);
                }

                this._createRefLines(g);

                const dots = g.selectAll(`circle.${DOT_CIRCLE_CLASS}`)
                    .data(points, pluck('x'));

                const chart = this;
                const dotsEnterModify = dots
                    .enter()
                    .append('circle')
                    .attr('class', DOT_CIRCLE_CLASS)
                    .classed('dc-tabbable', this._keyboardAccessible)
                    .attr('cx', d => utils.safeNumber(this.x()(d.x)))
                    .attr('cy', d => utils.safeNumber(this.y()(d.y + d.y0)))
                    .attr('r', this._getDotRadius())
                    .style('fill-opacity', this._dataPointFillOpacity)
                    .style('stroke-opacity', this._dataPointStrokeOpacity)
                    .attr('fill', this.getColor)
                    .attr('stroke', this.getColor)
                    .on('mousemove', function () {
                        const dot = select(this);
                        chart._showDot(dot);
                        chart._showRefLines(dot, g);
                    })
                    .on('mouseout', function () {
                        const dot = select(this);
                        chart._hideDot(dot);
                        chart._hideRefLines(g);
                    })
                    .merge(dots);

                // special case for on-focus for line chart and its dots
                if (this._keyboardAccessible) {

                    this._svg.selectAll('.dc-tabbable')
                        .attr('tabindex', 0)
                        .on('focus', function () {
                            const dot = select(this);
                            chart._showDot(dot);
                            chart._showRefLines(dot, g);
                        })
                        .on('blur', function () {
                            const dot = select(this);
                            chart._hideDot(dot);
                            chart._hideRefLines(g);
                        });
                }

                dotsEnterModify.call(dot => this._doRenderTitle(dot, data));

                transition(dotsEnterModify, this.transitionDuration())
                    .attr('cx', d => utils.safeNumber(this.x()(d.x)))
                    .attr('cy', d => utils.safeNumber(this.y()(d.y + d.y0)))
                    .attr('fill', this.getColor);

                dots.exit().remove();
            });
        }
    }

    _drawLabels (layers) {
        const chart = this;
        layers.each(function (data, layerIndex) {
            const layer = select(this);
            const labels = layer.selectAll('text.lineLabel')
                .data(data.values, pluck('x'));

            const labelsEnterModify = labels
                .enter()
                .append('text')
                .attr('class', 'lineLabel')
                .attr('text-anchor', 'middle')
                .merge(labels);

            transition(labelsEnterModify, chart.transitionDuration())
                .attr('x', d => utils.safeNumber(chart.x()(d.x)))
                .attr('y', d => {
                    const y = chart.y()(d.y + d.y0) - LABEL_PADDING;
                    return utils.safeNumber(y);
                })
                .text(d => chart.label()(d));

            transition(labels.exit(), chart.transitionDuration())
                .attr('height', 0)
                .remove();
        });
    }

    _createRefLines (g) {
        const yRefLine = g.select(`path.${Y_AXIS_REF_LINE_CLASS}`).empty() ?
            g.append('path').attr('class', Y_AXIS_REF_LINE_CLASS) : g.select(`path.${Y_AXIS_REF_LINE_CLASS}`);
        yRefLine.style('display', 'none').attr('stroke-dasharray', '5,5');

        const xRefLine = g.select(`path.${X_AXIS_REF_LINE_CLASS}`).empty() ?
            g.append('path').attr('class', X_AXIS_REF_LINE_CLASS) : g.select(`path.${X_AXIS_REF_LINE_CLASS}`);
        xRefLine.style('display', 'none').attr('stroke-dasharray', '5,5');
    }

    _showDot (dot) {
        dot.style('fill-opacity', 0.8);
        dot.style('stroke-opacity', 0.8);
        dot.attr('r', this._dotRadius);
        return dot;
    }

    _showRefLines (dot, g) {
        const x = dot.attr('cx');
        const y = dot.attr('cy');
        const yAxisX = (this._yAxisX() - this.margins().left);
        const yAxisRefPathD = `M${yAxisX} ${y}L${x} ${y}`;
        const xAxisRefPathD = `M${x} ${this.yAxisHeight()}L${x} ${y}`;
        g.select(`path.${Y_AXIS_REF_LINE_CLASS}`).style('display', '').attr('d', yAxisRefPathD);
        g.select(`path.${X_AXIS_REF_LINE_CLASS}`).style('display', '').attr('d', xAxisRefPathD);
    }

    _getDotRadius () {
        return this._dataPointRadius || this._dotRadius;
    }

    _hideDot (dot) {
        dot.style('fill-opacity', this._dataPointFillOpacity)
            .style('stroke-opacity', this._dataPointStrokeOpacity)
            .attr('r', this._getDotRadius());
    }

    _hideRefLines (g) {
        g.select(`path.${Y_AXIS_REF_LINE_CLASS}`).style('display', 'none');
        g.select(`path.${X_AXIS_REF_LINE_CLASS}`).style('display', 'none');
    }

    _doRenderTitle (dot, d) {
        if (this.renderTitle()) {
            dot.select('title').remove();
            dot.append('title').text(pluck('data', this.title(d.name)));
        }
    }

    /**
     * Turn on/off the mouseover behavior of an individual data point which renders a circle and x/y axis
     * dashed lines back to each respective axis.  This is ignored if the chart
     * {@link CoordinateGridMixin#brushOn brush} is on
     * @param  {Boolean} [xyTipsOn=false]
     * @returns {Boolean|LineChart}
     */
    xyTipsOn (xyTipsOn) {
        if (!arguments.length) {
            return this._xyTipsOn;
        }
        this._xyTipsOn = xyTipsOn;
        return this;
    }

    /**
     * Get or set the radius (in px) for dots displayed on the data points.
     * @param  {Number} [dotRadius=5]
     * @returns {Number|LineChart}
     */
    dotRadius (dotRadius) {
        if (!arguments.length) {
            return this._dotRadius;
        }
        this._dotRadius = dotRadius;
        return this;
    }

    /**
     * Always show individual dots for each datapoint.
     *
     * If `options` is falsy, it disables data point rendering. If no `options` are provided, the
     * current `options` values are instead returned.
     * @example
     * chart.renderDataPoints({radius: 2, fillOpacity: 0.8, strokeOpacity: 0.0})
     * @param  {{fillOpacity: Number, strokeOpacity: Number, radius: Number}} [options={fillOpacity: 0.8, strokeOpacity: 0.0, radius: 2}]
     * @returns {{fillOpacity: Number, strokeOpacity: Number, radius: Number}|LineChart}
     */
    renderDataPoints (options) {
        if (!arguments.length) {
            return {
                fillOpacity: this._dataPointFillOpacity,
                strokeOpacity: this._dataPointStrokeOpacity,
                radius: this._dataPointRadius
            };
        } else if (!options) {
            this._dataPointFillOpacity = DEFAULT_DOT_OPACITY;
            this._dataPointStrokeOpacity = DEFAULT_DOT_OPACITY;
            this._dataPointRadius = null;
        } else {
            this._dataPointFillOpacity = options.fillOpacity || 0.8;
            this._dataPointStrokeOpacity = options.strokeOpacity || 0.0;
            this._dataPointRadius = options.radius || 2;
        }
        return this;
    }

    _colorFilter (color, dashstyle, inv) {
        return function () {
            const item = select(this);
            const match = (item.attr('stroke') === color &&
                item.attr('stroke-dasharray') === ((dashstyle instanceof Array) ?
                    dashstyle.join(',') : null)) || item.attr('fill') === color;
            return inv ? !match : match;
        };
    }

    legendHighlight (d) {
        if (!this.isLegendableHidden(d)) {
            this.g().selectAll('path.line, path.area')
                .classed('highlight', this._colorFilter(d.color, d.dashstyle))
                .classed('fadeout', this._colorFilter(d.color, d.dashstyle, true));
        }
    }

    legendReset () {
        this.g().selectAll('path.line, path.area')
            .classed('highlight', false)
            .classed('fadeout', false);
    }

    legendables () {
        const legendables = super.legendables();
        if (!this._dashStyle) {
            return legendables;
        }
        return legendables.map(l => {
            l.dashstyle = this._dashStyle;
            return l;
        });
    }
}

export const lineChart = (parent, chartGroup) => new LineChart(parent, chartGroup);
