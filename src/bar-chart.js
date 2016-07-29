/**
 * Concrete bar chart/histogram implementation.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
 * - {@link http://dc-js.github.com/dc.js/crime/index.html Canadian City Crime Stats}
 * @class barChart
 * @memberof dc
 * @mixes dc.stackMixin
 * @mixes dc.coordinateGridMixin
 * @example
 * // create a bar chart under #chart-container1 element using the default global chart group
 * var chart1 = dc.barChart('#chart-container1');
 * // create a bar chart under #chart-container2 element using chart group A
 * var chart2 = dc.barChart('#chart-container2', 'chartGroupA');
 * // create a sub-chart under a composite parent chart
 * var chart3 = dc.barChart(compositeChart);
 * @param {String|node|d3.selection|dc.compositeChart} parent - Any valid
 * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Selections.md#selecting-elements d3 single selector}
 * specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar
 * chart is a sub-chart in a {@link dc.compositeChart Composite Chart} then pass in the parent
 * composite chart instance instead.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.barChart}
 */
dc.barChart = function (parent, chartGroup) {
    var MIN_BAR_WIDTH = 1;
    var DEFAULT_GAP_BETWEEN_BARS = 2;
    var LABEL_PADDING = 3;

    var _chart = dc.stackMixin(dc.coordinateGridMixin({}));

    var _gap = DEFAULT_GAP_BETWEEN_BARS;
    var _centerBar = false;
    var _alwaysUseRounding = false;
    var _growFromZero = false;

    dc.override(_chart, 'render', function () {
        if (_chart.round() && _centerBar && !_alwaysUseRounding) {
            dc.logger.warn('By default, brush rounding is disabled if bars are centered. ' +
                         'See dc.js bar chart API documentation for details.');
        }

        return _chart._render();
    });

    _chart.label(function (d) {
        return dc.utils.printSingleValue(d.y0 + d.y);
    }, false);

    _chart.plotData = function (params) {
        var bounds = _chart.isOrdinal() ? null : params.fullBounds();
        var stackData = _chart.computeStacks(bounds);
        var layers = _chart.chartBodyG().selectAll('g.stack')
                .data(stackData);
        params.preBarWidth = calculateBarWidth(params.preXScale);
        params.postBarWidth = calculateBarWidth(params.postXScale);

        layers
            .enter()
            .append('g')
            .attr('class', function (d, i) {
                return 'stack ' + '_' + i;
            });

        var last = layers.size() - 1;
        layers.each(function (d, i) {
            var layer = d3.select(this);

            renderBars(layer, d, params);

            if (_chart.renderLabel() && last === i) {
                renderLabels(layer, d, params);
            }
        });
    };

    function barHeight (yScale) {
        return function (d) {
            return dc.utils.safeNumber(Math.abs(yScale(d.y + d.y0) - yScale(d.y0)));
        };
    }

    function renderLabels (layer, d, params) {
        // stuff that should happen before scales updated
        var labels = layer.selectAll('text.barLabel')
            .data(d.values, dc.pluck('x'));

        labels.enter()
            .append('text')
            .attr('class', 'barLabel')
            .attr('text-anchor', 'middle');

        if (_chart.isOrdinal()) {
            labels.on('click', _chart.onClick);
            labels.attr('cursor', 'pointer');
        }

        dc.transition(labels, _chart.transitionDuration(), _chart.transitionDelay())
            .attr('x', barX(params.postXScale))
            .attr('y', function (d) {
                return barY(params.postYScale)(d) - LABEL_PADDING;
            })
            .text(function (d) {
                return _chart.label()(d);
            });

        dc.transition(labels.exit(), _chart.transitionDuration(), _chart.transitionDelay())
            .attr('height', 0)
            .remove();
    }

    function barX (xScale, barWidth) {
        return function (d) {
            var x = xScale(d.x);
            if (_centerBar) {
                x -= barWidth / 2;
            }
            if (_chart.isOrdinal() && _gap !== undefined) {
                x += _gap / 2;
            }
            return dc.utils.safeNumber(x);
        };
    }
    function barY (yScale) {
        return function (d) {
            var y = yScale(d.y + d.y0);

            if (d.y < 0) {
                y -= barHeight(yScale)(d);
            }

            return dc.utils.safeNumber(y);
        };
    }

    function renderBars (layer, d, params) {
        // stuff that should happen before scales updated
        var bars = layer.selectAll('rect.bar')
            .data(d.values, dc.pluck('x'));

        var enter = bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', dc.pluck('data', _chart.getColor));

        if (!_chart.isOrdinal()) { // there's nowhere to arrive from if ordinal
            enter
                .attr('x', barX(params.preXScale, params.preBarWidth))
                .attr('width', params.preBarWidth);
        }

        if (_growFromZero) {
            enter
                .attr('y', _chart.yAxisHeight())
                .attr('height', 0);
        } else {
            if (!_chart.isOrdinal()) {
                enter
                    .attr('y', barY(params.preYScale))
                    .attr('height', barHeight(params.preYScale));
            }
            enter
                .attr('opacity', 0);
        }

        if (_chart.renderTitle()) {
            enter.append('title').text(dc.pluck('data', _chart.title(d.name)));
        }

        if (_chart.isOrdinal()) {
            bars.on('click', _chart.onClick);
        }

        dc.transition(bars, _chart.transitionDuration(), _chart.transitionDelay())
            .attr('x', barX(params.postXScale, params.postBarWidth))
            .attr('y', barY(params.postYScale))
            .attr('width', params.postBarWidth)
            .attr('height', barHeight(params.postYScale))
            .attr('opacity', 1)
            .attr('fill', dc.pluck('data', _chart.getColor))
            .select('title').text(dc.pluck('data', _chart.title(d.name)));

        var transOut = dc.transition(bars.exit(), _chart.transitionDuration(), _chart.transitionDelay())
            .attr('height', barHeight(params.postYScale))
            .attr('opacity', 0);
        if (!_chart.isOrdinal()) { // there's nowhere to "go" if ordinal
            transOut.attr('x', barX(params.postXScale, params.postBarWidth))
                .attr('y', barY(params.postYScale))
                .attr('width', params.postBarWidth);
        }
        transOut
            .remove();
    }

    function calculateBarWidth (xScale) {
        var barWidth, numberOfBars = _chart.xUnitCount(xScale);

        if (_chart.isOrdinal() && _gap === undefined && xScale.rangeBand) { // may have been previously not ordinal
            barWidth = Math.floor(xScale.rangeBand());
        } else if (_gap) {
            barWidth = Math.floor((_chart.xAxisLength() - (numberOfBars - 1) * _gap) / numberOfBars);
        } else {
            barWidth = Math.floor(_chart.xAxisLength() / (1 + _chart.barPadding()) / numberOfBars);
        }

        if (barWidth === Infinity || isNaN(barWidth) || barWidth < MIN_BAR_WIDTH) {
            barWidth = MIN_BAR_WIDTH;
        }
        return barWidth;
    }

    _chart.fadeDeselectedArea = function () {
        var bars = _chart.chartBodyG().selectAll('rect.bar');
        var extent = _chart.brush().extent();

        if (_chart.isOrdinal()) {
            if (_chart.hasFilter()) {
                bars.classed(dc.constants.SELECTED_CLASS, function (d) {
                    return _chart.hasFilter(d.x);
                });
                bars.classed(dc.constants.DESELECTED_CLASS, function (d) {
                    return !_chart.hasFilter(d.x);
                });
            } else {
                bars.classed(dc.constants.SELECTED_CLASS, false);
                bars.classed(dc.constants.DESELECTED_CLASS, false);
            }
        } else {
            if (!_chart.brushIsEmpty(extent)) {
                var start = extent[0];
                var end = extent[1];

                bars.classed(dc.constants.DESELECTED_CLASS, function (d) {
                    return d.x < start || d.x >= end;
                });
            } else {
                bars.classed(dc.constants.DESELECTED_CLASS, false);
            }
        }
    };

    /**
     * Whether the bar chart will render each bar centered around the data position on the x-axis.
     * @method centerBar
     * @memberof dc.barChart
     * @instance
     * @param {Boolean} [centerBar=false]
     * @returns {Boolean|dc.barChart}
     */
    _chart.centerBar = function (centerBar) {
        if (!arguments.length) {
            return _centerBar;
        }
        _centerBar = centerBar;
        return _chart;
    };

    dc.override(_chart, 'onClick', function (d) {
        _chart._onClick(d.data);
    });

    /**
     * Get or set the spacing between bars as a fraction of bar size. Valid values are between 0-1.
     * Setting this value will also remove any previously set {@link dc.barChart#gap gap}. See the
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md#ordinal_rangeBands d3 docs}
     * for a visual description of how the padding is applied.
     * @method barPadding
     * @memberof dc.barChart
     * @instance
     * @param {Number} [barPadding=0]
     * @returns {Number|dc.barChart}
     */
    _chart.barPadding = function (barPadding) {
        if (!arguments.length) {
            return _chart._rangeBandPadding();
        }
        _chart._rangeBandPadding(barPadding);
        _gap = undefined;
        return _chart;
    };

    _chart._useOuterPadding = function () {
        return _gap === undefined;
    };

    /**
     * Whether bars should grow from the bottom of the chart when they are first drawn (true)
     * or fade in (false).
     * @method growFromZero
     * @memberof dc.barChart
     * @instance
     * @param {Boolean} [growFromZero=false]
     * @return {Boolean}
     * @return {dc.barChart}
     */
    _chart.growFromZero = function (growFromZero) {
        if (!arguments.length) {
            return _growFromZero;
        }
        _growFromZero = growFromZero;
        return _chart;
    };

    /**
     * Get or set the outer padding on an ordinal bar chart. This setting has no effect on non-ordinal charts.
     * Will pad the width by `padding * barWidth` on each side of the chart.
     * @method outerPadding
     * @memberof dc.barChart
     * @instance
     * @param {Number} [padding=0.5]
     * @returns {Number|dc.barChart}
     */
    _chart.outerPadding = _chart._outerRangeBandPadding;

    /**
     * Manually set fixed gap (in px) between bars instead of relying on the default auto-generated
     * gap.  By default the bar chart implementation will calculate and set the gap automatically
     * based on the number of data points and the length of the x axis.
     * @method gap
     * @memberof dc.barChart
     * @instance
     * @param {Number} [gap=2]
     * @returns {Number|dc.barChart}
     */
    _chart.gap = function (gap) {
        if (!arguments.length) {
            return _gap;
        }
        _gap = gap;
        return _chart;
    };

    _chart.extendBrush = function () {
        var extent = _chart.brush().extent();
        if (_chart.round() && (!_centerBar || _alwaysUseRounding)) {
            extent[0] = extent.map(_chart.round())[0];
            extent[1] = extent.map(_chart.round())[1];

            _chart.chartBodyG().select('.brush')
                .call(_chart.brush().extent(extent));
        }

        return extent;
    };

    /**
     * Set or get whether rounding is enabled when bars are centered. If false, using
     * rounding with centered bars will result in a warning and rounding will be ignored.  This flag
     * has no effect if bars are not {@link dc.barChart#centerBar centered}.
     * When using standard d3.js rounding methods, the brush often doesn't align correctly with
     * centered bars since the bars are offset.  The rounding function must add an offset to
     * compensate, such as in the following example.
     * @method alwaysUseRounding
     * @memberof dc.barChart
     * @instance
     * @example
     * chart.round(function(n) { return Math.floor(n) + 0.5; });
     * @param {Boolean} [alwaysUseRounding=false]
     * @returns {Boolean|dc.barChart}
     */
    _chart.alwaysUseRounding = function (alwaysUseRounding) {
        if (!arguments.length) {
            return _alwaysUseRounding;
        }
        _alwaysUseRounding = alwaysUseRounding;
        return _chart;
    };

    function colorFilter (color, inv) {
        return function () {
            var item = d3.select(this);
            var match = item.attr('fill') === color;
            return inv ? !match : match;
        };
    }

    _chart.legendHighlight = function (d) {
        if (!_chart.isLegendableHidden(d)) {
            _chart.g().selectAll('rect.bar')
                .classed('highlight', colorFilter(d.color))
                .classed('fadeout', colorFilter(d.color, true));
        }
    };

    _chart.legendReset = function () {
        _chart.g().selectAll('rect.bar')
            .classed('highlight', false)
            .classed('fadeout', false);
    };

    dc.override(_chart, 'xAxisMax', function () {
        var max = this._xAxisMax();
        if ('resolution' in _chart.xUnits()) {
            var res = _chart.xUnits().resolution;
            max += res;
        }
        return max;
    });

    return _chart.anchor(parent, chartGroup);
};
