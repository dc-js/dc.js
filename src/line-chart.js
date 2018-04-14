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
 * var chart1 = dc.lineChart('#chart-container1');
 * // create a line chart under #chart-container2 element using chart group A
 * var chart2 = dc.lineChart('#chart-container2', 'chartGroupA');
 * // create a sub-chart under a composite parent chart
 * var chart3 = dc.lineChart(compositeChart);
 * @param {String|node|d3.selection|dc.compositeChart} parent - Any valid
 * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector}
 * specifying a dom block element such as a div; or a dom element or d3 selection.  If the line
 * chart is a sub-chart in a {@link dc.compositeChart Composite Chart} then pass in the parent
 * composite chart instance instead.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.lineChart}
 */
dc.lineChart = function (parent, chartGroup) {
    var DEFAULT_DOT_RADIUS = 5;
    var TOOLTIP_G_CLASS = 'dc-tooltip';
    var DOT_CIRCLE_CLASS = 'dot';
    var Y_AXIS_REF_LINE_CLASS = 'yRef';
    var X_AXIS_REF_LINE_CLASS = 'xRef';
    var DEFAULT_DOT_OPACITY = 1e-6;
    var LABEL_PADDING = 3;

    var _chart = dc.stackMixin(dc.coordinateGridMixin({}));
    var _renderArea = false;
    var _dotRadius = DEFAULT_DOT_RADIUS;
    var _dataPointRadius = null;
    var _dataPointFillOpacity = DEFAULT_DOT_OPACITY;
    var _dataPointStrokeOpacity = DEFAULT_DOT_OPACITY;
    var _curve = null;
    var _interpolate = null; // d3.curveLinear;  // deprecated in 3.0
    var _tension = null;  // deprecated in 3.0
    var _defined;
    var _dashStyle;
    var _xyTipsOn = true;

    _chart.transitionDuration(500);
    _chart.transitionDelay(0);
    _chart._rangeBandPadding(1);

    _chart.plotData = function () {
        var chartBody = _chart.chartBodyG();
        var layersList = chartBody.select('g.stack-list');

        if (layersList.empty()) {
            layersList = chartBody.append('g').attr('class', 'stack-list');
        }

        var layers = layersList.selectAll('g.stack').data(_chart.data());

        var layersEnter = layers
            .enter()
            .append('g')
            .attr('class', function (d, i) {
                return 'stack ' + '_' + i;
            });

        layers = layersEnter.merge(layers);

        drawLine(layersEnter, layers);

        drawArea(layersEnter, layers);

        drawDots(chartBody, layers);

        if (_chart.renderLabel()) {
            drawLabels(layers);
        }
    };

    /**
     * Gets or sets the curve factory to use for lines and areas drawn, allowing e.g. step
     * functions, splines, and cubic interpolation. Typically you would use one of the interpolator functions
     * provided by {@link https://github.com/d3/d3-shape/blob/master/README.md#curves d3 curves}.
     *
     * Replaces the use of {@link dc.lineChart#interpolate} and {@link dc.lineChart#tension}
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
     * @method curve
     * @memberof dc.lineChart
     * @instance
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#line_curve line.curve}
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#area_curve area.curve}
     * @param  {d3.curve} [curve=d3.curveLinear]
     * @returns {d3.curve|dc.lineChart}
     */
    _chart.curve = function (curve) {
        if (!arguments.length) {
            return _curve;
        }
        _curve = curve;
        return _chart;
    };

    /**
     * Gets or sets the interpolator to use for lines drawn, by string name, allowing e.g. step
     * functions, splines, and cubic interpolation.
     *
     * Possible values are: 'linear', 'linear-closed', 'step', 'step-before', 'step-after', 'basis',
     * 'basis-open', 'basis-closed', 'bundle', 'cardinal', 'cardinal-open', 'cardinal-closed', and
     * 'monotone'.
     *
     * This function exists for backward compatibility. Use {@link dc.lineChart#curve}
     * which is generic and provides more options.
     * Value set through `.curve` takes precedence over `.interpolate` and `.tension`.
     * @method interpolate
     * @memberof dc.lineChart
     * @instance
     * @deprecated since version 3.0 use {@link dc.lineChart#curve} instead
     * @see {@link dc.lineChart#curve}
     * @param  {d3.curve} [interpolate=d3.curveLinear]
     * @returns {d3.curve|dc.lineChart}
     */
    _chart.interpolate = dc.logger.deprecate(function (interpolate) {
        if (!arguments.length) {
            return _interpolate;
        }
        _interpolate = interpolate;
        return _chart;
    }, 'dc.lineChart.interpolate has been deprecated since version 3.0 use dc.lineChart.curve instead');

    /**
     * Gets or sets the tension to use for lines drawn, in the range 0 to 1.
     *
     * Passed to the {@link https://github.com/d3/d3-shape/blob/master/README.md#curves d3 curve function}
     * if it provides a `.tension` function. Example:
     * {@link https://github.com/d3/d3-shape/blob/master/README.md#curveCardinal_tension curveCardinal.tension}.
     *
     * This function exists for backward compatibility. Use {@link dc.lineChart#curve}
     * which is generic and provides more options.
     * Value set through `.curve` takes precedence over `.interpolate` and `.tension`.
     * @method tension
     * @memberof dc.lineChart
     * @instance
     * @deprecated since version 3.0 use {@link dc.lineChart#curve} instead
     * @see {@link dc.lineChart#curve}
     * @param  {Number} [tension=0]
     * @returns {Number|dc.lineChart}
     */
    _chart.tension = dc.logger.deprecate(function (tension) {
        if (!arguments.length) {
            return _tension;
        }
        _tension = tension;
        return _chart;
    }, 'dc.lineChart.tension has been deprecated since version 3.0 use dc.lineChart.curve instead');

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
     * @method defined
     * @memberof dc.lineChart
     * @instance
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#line_defined line.defined}
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

    // To keep it backward compatible, this covers multiple cases
    // See https://github.com/dc-js/dc.js/issues/1376
    // It will be removed when interpolate and tension are removed.
    function getCurveFactory () {
        var curve = null;

        // _curve takes precedence
        if (_curve) {
            return _curve;
        }

        // Approximate the D3v3 behavior
        if (typeof _interpolate === 'function') {
            curve = _interpolate;
        } else {
            // If _interpolate is string
            var mapping = {
                'linear': d3.curveLinear,
                'linear-closed': d3.curveLinearClosed,
                'step': d3.curveStep,
                'step-before': d3.curveStepBefore,
                'step-after': d3.curveStepAfter,
                'basis': d3.curveBasis,
                'basis-open': d3.curveBasisOpen,
                'basis-closed': d3.curveBasisClosed,
                'bundle': d3.curveBundle,
                'cardinal': d3.curveCardinal,
                'cardinal-open': d3.curveCardinalOpen,
                'cardinal-closed': d3.curveCardinalClosed,
                'monotone': d3.curveMonotoneX
            };
            curve = mapping[_interpolate];
        }

        // Default value
        if (!curve) {
            curve = d3.curveLinear;
        }

        if (_tension !== null) {
            if (typeof curve.tension !== 'function') {
                dc.logger.warn('tension was specified but the curve/interpolate does not support it.');
            } else {
                curve = curve.tension(_tension);
            }
        }
        return curve;
    }

    function drawLine (layersEnter, layers) {
        var line = d3.line()
            .x(function (d) {
                return _chart.x()(d.x);
            })
            .y(function (d) {
                return _chart.y()(d.y + d.y0);
            })
            .curve(getCurveFactory());
        if (_defined) {
            line.defined(_defined);
        }

        var path = layersEnter.append('path')
            .attr('class', 'line')
            .attr('stroke', colors);
        if (_dashStyle) {
            path.attr('stroke-dasharray', _dashStyle);
        }

        dc.transition(layers.select('path.line'), _chart.transitionDuration(), _chart.transitionDelay())
            //.ease('linear')
            .attr('stroke', colors)
            .attr('d', function (d) {
                return safeD(line(d.values));
            });
    }

    function drawArea (layersEnter, layers) {
        if (_renderArea) {
            var area = d3.area()
                .x(function (d) {
                    return _chart.x()(d.x);
                })
                .y1(function (d) {
                    return _chart.y()(d.y + d.y0);
                })
                .y0(function (d) {
                    return _chart.y()(d.y0);
                })
                .curve(getCurveFactory());
            if (_defined) {
                area.defined(_defined);
            }

            layersEnter.append('path')
                .attr('class', 'area')
                .attr('fill', colors)
                .attr('d', function (d) {
                    return safeD(area(d.values));
                });

            dc.transition(layers.select('path.area'), _chart.transitionDuration(), _chart.transitionDelay())
                //.ease('linear')
                .attr('fill', colors)
                .attr('d', function (d) {
                    return safeD(area(d.values));
                });
        }
    }

    function safeD (d) {
        return (!d || d.indexOf('NaN') >= 0) ? 'M0,0' : d;
    }

    function drawDots (chartBody, layers) {
        if (_chart.xyTipsOn() === 'always' || (!(_chart.brushOn() || _chart.parentBrushOn()) && _chart.xyTipsOn())) {
            var tooltipListClass = TOOLTIP_G_CLASS + '-list';
            var tooltips = chartBody.select('g.' + tooltipListClass);

            if (tooltips.empty()) {
                tooltips = chartBody.append('g').attr('class', tooltipListClass);
            }

            layers.each(function (d, layerIndex) {
                var points = d.values;
                if (_defined) {
                    points = points.filter(_defined);
                }

                var g = tooltips.select('g.' + TOOLTIP_G_CLASS + '._' + layerIndex);
                if (g.empty()) {
                    g = tooltips.append('g').attr('class', TOOLTIP_G_CLASS + ' _' + layerIndex);
                }

                createRefLines(g);

                var dots = g.selectAll('circle.' + DOT_CIRCLE_CLASS)
                    .data(points, dc.pluck('x'));

                var dotsEnterModify = dots
                    .enter()
                        .append('circle')
                        .attr('class', DOT_CIRCLE_CLASS)
                        .attr('cx', function (d) {
                            return dc.utils.safeNumber(_chart.x()(d.x));
                        })
                        .attr('cy', function (d) {
                            return dc.utils.safeNumber(_chart.y()(d.y + d.y0));
                        })
                        .attr('r', getDotRadius())
                        .style('fill-opacity', _dataPointFillOpacity)
                        .style('stroke-opacity', _dataPointStrokeOpacity)
                        .attr('fill', _chart.getColor)
                        .on('mousemove', function () {
                            var dot = d3.select(this);
                            showDot(dot);
                            showRefLines(dot, g);
                        })
                        .on('mouseout', function () {
                            var dot = d3.select(this);
                            hideDot(dot);
                            hideRefLines(g);
                        })
                    .merge(dots);

                dotsEnterModify.call(renderTitle, d);

                dc.transition(dotsEnterModify, _chart.transitionDuration())
                    .attr('cx', function (d) {
                        return dc.utils.safeNumber(_chart.x()(d.x));
                    })
                    .attr('cy', function (d) {
                        return dc.utils.safeNumber(_chart.y()(d.y + d.y0));
                    })
                    .attr('fill', _chart.getColor);

                dots.exit().remove();
            });
        }
    }

    _chart.label(function (d) {
        return dc.utils.printSingleValue(d.y0 + d.y);
    }, false);

    function drawLabels (layers) {
        layers.each(function (d, layerIndex) {
            var layer = d3.select(this);
            var labels = layer.selectAll('text.lineLabel')
                .data(d.values, dc.pluck('x'));

            var labelsEnterModify = labels
                .enter()
                    .append('text')
                    .attr('class', 'lineLabel')
                    .attr('text-anchor', 'middle')
                .merge(labels);

            dc.transition(labelsEnterModify, _chart.transitionDuration())
                .attr('x', function (d) {
                    return dc.utils.safeNumber(_chart.x()(d.x));
                })
                .attr('y', function (d) {
                    var y = _chart.y()(d.y + d.y0) - LABEL_PADDING;
                    return dc.utils.safeNumber(y);
                })
                .text(function (d) {
                    return _chart.label()(d);
                });

            dc.transition(labels.exit(), _chart.transitionDuration())
                .attr('height', 0)
                .remove();
        });
    }

    function createRefLines (g) {
        var yRefLine = g.select('path.' + Y_AXIS_REF_LINE_CLASS).empty() ?
            g.append('path').attr('class', Y_AXIS_REF_LINE_CLASS) : g.select('path.' + Y_AXIS_REF_LINE_CLASS);
        yRefLine.style('display', 'none').attr('stroke-dasharray', '5,5');

        var xRefLine = g.select('path.' + X_AXIS_REF_LINE_CLASS).empty() ?
            g.append('path').attr('class', X_AXIS_REF_LINE_CLASS) : g.select('path.' + X_AXIS_REF_LINE_CLASS);
        xRefLine.style('display', 'none').attr('stroke-dasharray', '5,5');
    }

    function showDot (dot) {
        dot.style('fill-opacity', 0.8);
        dot.style('stroke-opacity', 0.8);
        dot.attr('r', _dotRadius);
        return dot;
    }

    function showRefLines (dot, g) {
        var x = dot.attr('cx');
        var y = dot.attr('cy');
        var yAxisX = (_chart._yAxisX() - _chart.margins().left);
        var yAxisRefPathD = 'M' + yAxisX + ' ' + y + 'L' + (x) + ' ' + (y);
        var xAxisRefPathD = 'M' + x + ' ' + _chart.yAxisHeight() + 'L' + x + ' ' + y;
        g.select('path.' + Y_AXIS_REF_LINE_CLASS).style('display', '').attr('d', yAxisRefPathD);
        g.select('path.' + X_AXIS_REF_LINE_CLASS).style('display', '').attr('d', xAxisRefPathD);
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
        g.select('path.' + Y_AXIS_REF_LINE_CLASS).style('display', 'none');
        g.select('path.' + X_AXIS_REF_LINE_CLASS).style('display', 'none');
    }

    function renderTitle (dot, d) {
        if (_chart.renderTitle()) {
            dot.select('title').remove();
            dot.append('title').text(dc.pluck('data', _chart.title(d.name)));
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
            var item = d3.select(this);
            var match = (item.attr('stroke') === color &&
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

    dc.override(_chart, 'legendables', function () {
        var legendables = _chart._legendables();
        if (!_dashStyle) {
            return legendables;
        }
        return legendables.map(function (l) {
            l.dashstyle = _dashStyle;
            return l;
        });
    });

    return _chart.anchor(parent, chartGroup);
};
