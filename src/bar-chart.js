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
 * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector}
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
    var DEFAULT_GAP_BETWEEN_BAR_GROUPS = 10;
    var LABEL_PADDING = 3;
    var DEFAULT_SENSOR_BAR = true;
    var DEFAULT_SENSOR_BAR_COLOR = '#fffff';
    var DEFAULT_SENSOR_BAR_OPACITY = 0;

    var _chart = dc.stackMixin(dc.coordinateGridMixin({}));

    var _gap = DEFAULT_GAP_BETWEEN_BARS;
    var _groupGap = DEFAULT_GAP_BETWEEN_BAR_GROUPS;
    var _groupBars = false;
    var _centerBar = false;
    var _sensorBars = DEFAULT_SENSOR_BAR;
    var _sensorBarColor = DEFAULT_SENSOR_BAR_COLOR;
    var _sensorBarOpacity = DEFAULT_SENSOR_BAR_OPACITY;
    var _alwaysUseRounding = false;

    var _barPadding;
    var _barWidth;
    var _sensorBarWidth;
    var _sensorBarPadding;

    dc.override(_chart, 'rescale', function () {
        _chart._rescale();
        _barWidth = undefined;
        _barPadding = undefined;
        _sensorBarWidth = undefined;
        _sensorBarPadding = undefined;
        return _chart;
    });

    dc.override(_chart, 'render', function () {
        if (_chart.round() && _centerBar && !_alwaysUseRounding) {
            dc.logger.warn('By default, brush rounding is disabled if bars are centered. ' +
                         'See dc.js bar chart API documentation for details.');
        }

        return _chart._render();
    });

    _chart.label(function (d) {
        if (_groupBars) {
            return dc.utils.printSingleValue(d.y);
        } else {
            return dc.utils.printSingleValue(d.y0 + d.y);
        }
    }, false);

    _chart.plotData = function () {
        calculateBarWidths();
        calculateSensorBarWidths();
        var chartData = _chart.data(),
            firstStack = _chart.data()[0],
            barData = [],
            sensorBarData = [];

        // Pivot the data, so that each item in the barData array contains all bars for the same x-point.
        // Also add attribute groupIndex, wich indicates the bars order within the group.
        if (chartData.length > 0) {
            firstStack.values.forEach(function (d, i) {
                var values = [];
                for (var j = 0; j < chartData.length; j++) {
                    var value = chartData[j].values[i];
                    value.groupIndex = j;
                    values.push(value);
                }

                barData.push({
                    'values': values
                });
                // create an array containing "sensor bars", one bar for each group of bars.
                sensorBarData.push({
                    'values': [{
                        'x': d.x,
                        'y': 0,
                        'y0': 0,
                        'y1': 0,
                        'groupIndex': -1,
                        'layer': d.layer,
                        'data': {
                            'key': d.data.key,
                            'value': []
                        }
                    }]
                });
            });

            var barGroups = _chart.chartBodyG().selectAll('g.bar-group')
                .data(barData);

            var barGroupsEnter = barGroups.enter()
                .append('g')
                .attr('class', 'bar-group')
                .merge(barGroups);

            barGroups.exit()
                .remove();

            barGroupsEnter.each(function (d, i) {
                var barGroup = d3.select(this);

                renderSensorBar(barGroup, i, sensorBarData[i]);
                renderBars(barGroup, i, d);

                if (_chart.renderLabel()) {
                    renderLabels(barGroup, i, d);
                }
            });
        }
    };

    function barHeight (d) {
        var height;
        if (_groupBars) {
            height = dc.utils.safeNumber(Math.abs(_chart.y()(d.y) - _chart.y()(0)));
        } else {
            height = dc.utils.safeNumber(Math.abs(_chart.y()(d.y + d.y0) - _chart.y()(d.y0)));
        }
        return height;
    }

    function renderLabels (layer, layerIndex, d) {
        var labelValues = d.values.filter(function (d) {return d.groupIndex !== -1;});
        if (false && !_groupBars) {
            labelValues = [labelValues.pop()];
        }
        var labels = layer.selectAll('text.barLabel')
            .data(labelValues, dc.pluck('groupIndex'));

        var labelsEnterUpdate = labels
            .enter()
                .append('text')
                .attr('class', 'barLabel')
                .attr('text-anchor', 'middle')
                .attr('x', function (d) {
                    return barXPos(d) + _barWidth / 2;
                })
                .attr('y', _chart.yAxisHeight())
                .merge(labels);

        if (_chart.isOrdinal()) {
            labelsEnterUpdate.on('click', _chart.onClick);
            labelsEnterUpdate.attr('cursor', 'pointer');
        }

        dc.transition(labelsEnterUpdate, _chart.transitionDuration(), _chart.transitionDelay())
            .attr('x', function (d) {
                return dc.utils.safeNumber(barXPos(d) + _barWidth / 2);
            })
            .attr('y', function (d) {
                return dc.utils.safeNumber(barYPos(d) - LABEL_PADDING);
            })
            .text(function (d) {
                if (!_groupBars && d.groupIndex !== labelValues.length - 1) {
                    return '';
                }
                return _chart.label()(d);
            });

        dc.transition(labels.exit(), _chart.transitionDuration(), _chart.transitionDelay())
            .attr('height', 0)
            .remove();
    }

    function barXPos (d) {
        var x = _chart.x()(d.x);

        if (_chart.groupBars()) {
            var nuberOfBarsInGroup = _chart.stack().length,
                xAxistStepLength,
                groupIndex = d.groupIndex,
                offset;

            x += groupIndex * (_barWidth + _barPadding);
            if (_chart.isOrdinal()) {
                xAxistStepLength = _chart.x().step();
                offset = xAxistStepLength - _chart.x().bandwidth();

                x += _chart.groupGap() / 2;
                x += _barPadding / 2;
                x -= offset / 2;
            } else if (!_chart.isOrdinal() && _centerBar) {
                x -= (_barWidth + _barPadding) * nuberOfBarsInGroup / 2;
                x += _barPadding / 2;
            }

        } else {

            if (_centerBar) {
                x -= _barWidth / 2;
            }
            if (_chart.isOrdinal()) {
                x += _barPadding / 2;
            }
        }
        return dc.utils.safeNumber(x);
    }

    function barYPos (d) {
        var y;
        if (_groupBars) {
            y = _chart.yAxisHeight() - barHeight(d);
        } else {
            y = _chart.y()(d.y + d.y0);
        }
        if (d.y < 0) {
            y -= barHeight(d);
        }
        return dc.utils.safeNumber(y);
    }

    function sensorBarXPos (d) {
        var x = _chart.x()(d.x);

        if (_chart.isOrdinal()) {
            x += _barPadding / 2;
        }
        if (!_chart.isOrdinal() && _centerBar) {
            x -= _sensorBarWidth / 2;
        }

        if (_chart.isOrdinal() && _groupBars) {
            x += _chart.groupGap() / 2;
        }

        return dc.utils.safeNumber(x);
    }

    function renderBars (barGroup, barGroupIndex, d) {
        var bars,
            barData = d.values;

        bars = barGroup.selectAll('rect.bar')
            .data(barData, dc.pluck('groupIndex'));

        var barsEnter = bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', dc.pluck('data', _chart.getColor))
            .attr('x', barXPos)
            .attr('y', _chart.yAxisHeight())
            .attr('height', 0)
            .attr('width', Math.floor(_barWidth));

        var barsEnterUpdate = barsEnter.merge(bars);

        dc.transition(barsEnterUpdate, _chart.transitionDuration(), _chart.transitionDelay())
            .attr('x', barXPos)
            .attr('y', barYPos)
            .attr('width', Math.floor(_barWidth))
            .attr('height', function (d) {return barHeight(d);})
            .attr('fill', dc.pluck('data', _chart.getColor))
            .select('title').text(dc.pluck('data', _chart.title(d.name)));

        dc.transition(bars.exit(), _chart.transitionDuration(), _chart.transitionDelay())
            .attr('x', function (d) {return _chart.x()(d.x);})
            .attr('width', Math.floor(_barWidth) * 0.9)
            .remove();

        if (_chart.renderTitle()) {
            barsEnter.append('title').text(dc.pluck('data', _chart.title(d.name)));
        }

        if (_chart.isOrdinal()) {
            barsEnterUpdate.on('click', function (d, i) {
                _chart.onClick(d, i);
            });

            barsEnterUpdate.on('mouseenter', function (d, i) {
                d3.select(this.parentElement).classed('hoover', true);
            });

            barsEnterUpdate.on('mouseleave', function (d, i) {
                d3.select(this.parentElement).classed('hoover', false);
            });
        }
    }

    function renderSensorBar (barGroup, barGroupIndex, d) {
        var bars,
            barData = d.values;

        bars = barGroup.selectAll('rect.sensor-bar')
            .data(barData, dc.pluck('groupIndex'));

        var barsEnter = bars.enter()
            .append('rect')
            .attr('class', 'sensor-bar')
            .attr('fill', _sensorBarColor)
            .attr('fill-opacity', _sensorBarOpacity)
            .attr('x', sensorBarXPos)
            .attr('y', 0)
            .attr('height', _chart.yAxisHeight())
            .attr('width', Math.floor(_sensorBarWidth));

        var barsEnterUpdate = barsEnter.merge(bars);

        dc.transition(barsEnterUpdate, _chart.transitionDuration(), _chart.transitionDelay())
            .attr('x', sensorBarXPos)
            .attr('height', _chart.yAxisHeight())
            .attr('width', Math.floor(_sensorBarWidth));

        dc.transition(bars.exit(), _chart.transitionDuration(), _chart.transitionDelay())
            .attr('x', function (d) { return _chart.x()(d.x); })
            .attr('width', Math.floor(_sensorBarWidth) * 0.9)
            .remove();

        if (_chart.isOrdinal()) {
            barsEnterUpdate.on('click', function (d, i) {
                _chart.onClick(d, i);
            });

            barsEnterUpdate.on('mouseenter', function (d, i) {
                d3.select(this.parentElement).classed('hoover', true);
            });

            barsEnterUpdate.on('mouseleave', function (d, i) {
                d3.select(this.parentElement).classed('hoover', false);
            });
        }
    }

    function calculateBarWidths () {
        if (_barWidth === undefined) {
            var xUnits = _chart.xUnitCount(),
                xAxistStepLength,
                numberOfBarsInGroup,
                groupWidth,
                barPadding,
                barWidth;

            // Width
            if (_chart.isOrdinal()) {
                if (_groupBars) {
                    xAxistStepLength = _chart.x().step();
                    numberOfBarsInGroup = _chart.stack().length;
                    groupWidth = (xAxistStepLength - _chart.groupGap());
                    barWidth = groupWidth / numberOfBarsInGroup;
                } else {
                    groupWidth = _chart.x().bandwidth();
                    barWidth = groupWidth;
                }
            } else {
                if (_groupBars) {
                    numberOfBarsInGroup = _chart.stack().length;
                    groupWidth = (_chart.xAxisLength() / xUnits) - _chart.groupGap();
                    barWidth = groupWidth / numberOfBarsInGroup;
                } else {
                    groupWidth =  _chart.xAxisLength() / xUnits;
                    barWidth = groupWidth;
                }
            }

            // Padding
            if (_gap === undefined) {
                barPadding = barWidth * (_chart.barPadding());
            } else {
                barPadding = _gap;
            }

            if (barWidth === Infinity || isNaN(barWidth) || barWidth < MIN_BAR_WIDTH) {
                barWidth = MIN_BAR_WIDTH;
                barPadding = 0;
            }

            _barWidth = dc.utils.safeNumber(barWidth - barPadding);
            _barPadding = dc.utils.safeNumber(barPadding);
        }
    }

    function calculateSensorBarWidths () {
        if (_sensorBarWidth === undefined) {
            var sensorBarWidth,
                sensorBarPadding = 0;

            if (_groupBars) {
                sensorBarWidth = (_barWidth + _barPadding) * _chart.stack().length - _barPadding;
            } else {
                sensorBarWidth = _barWidth;
            }

            if (sensorBarWidth === Infinity || isNaN(sensorBarWidth) || sensorBarWidth < MIN_BAR_WIDTH) {
                sensorBarWidth = MIN_BAR_WIDTH;
                sensorBarPadding = 0;
            }

            _sensorBarWidth = dc.utils.safeNumber(sensorBarWidth - sensorBarPadding);
            _sensorBarPadding = dc.utils.safeNumber(sensorBarPadding);
        }
    }

    _chart.fadeDeselectedArea = function (brushSelection) {
        var bars = _chart.chartBodyG().selectAll('rect.bar');

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
        } else if (_chart.brushOn() || _chart.parentBrushOn()) {
            if (!_chart.brushIsEmpty(brushSelection)) {
                var start = brushSelection[0];
                var end = brushSelection[1];

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
     * {@link https://github.com/d3/d3-scale/blob/master/README.md#scaleBand d3 docs}
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

    _chart.extendBrush = function (brushSelection) {
        if (brushSelection && _chart.round() && (!_centerBar || _alwaysUseRounding)) {
            brushSelection[0] = _chart.round()(brushSelection[0]);
            brushSelection[1] = _chart.round()(brushSelection[1]);
        }
        return brushSelection;
    };

    /**
     * Group bars instead of stacking them. By default bars added through the stack function is stacked
     * on top of each other. By setting groupedBars = true, the bars will instead be placed next to each other.
     * Use groupGap and barPadding to adjust the spacing between bars and group of bars.
     * @name groupBars
     * @memberof dc.barChart
     * @instance
     * @param {Boolean} [groupBars=false]
     * @return {Boolean|dc.barChart}
     */
    _chart.groupBars = function (groupBars) {
        if (!arguments.length) {
            return _groupBars;
        }
        _barWidth = undefined;
        _barPadding = undefined;
        _sensorBarWidth = undefined;
        _sensorBarPadding = undefined;
        _groupBars = groupBars;
        return _chart;
    };

    /**
     * Manually set fixed gap (in px) between bar groups instead of relying on the default auto-generated
     * gap.  Only applicable for grouped bar charts.
     * @name groupGap
     * @memberof dc.barChart
     * @instance
     * @param {Number} [groupGap=5]
     * @return {Number|dc.barChart}
     */
    _chart.groupGap = function (groupGap) {
        if (!arguments.length) {
            return _groupGap;
        }
        _groupGap = groupGap;
        return _chart;
    };

    /**
     * Set or get whether sensor bars is enabled. Sensor bars is placed behind the normal bars or groups of bars
     * but has the same height as the chart. This enables selection of bars by hovering or clicking above them
     * in the chart. Useful for instance when some of the bars are relativly short.
     * @name sensorBars
     * @memberof dc.barChart
     * @instance
     * @param {Boolean} [sensorBars=true]
     * @return {Boolean|dc.barChart}
     */
    _chart.sensorBars = function (sensorBars) {
        if (!arguments.length) {
            return _sensorBars;
        }
        _sensorBars = sensorBars;
        return _chart;
    };

    /**
    * Set or get the fill color of the sensor bars
    * @name sensorBarColor
    * @memberof dc.barChart
    * @instance
    * @param {String} [sensorBarColor="#fffff"]
    * @return {String|dc.barChart}
    */
    _chart.sensorBarColor = function (sensorBarColor) {
        if (!arguments.length) {
            return _sensorBarColor;
        }
        _sensorBarColor = sensorBarColor;
        return _chart;
    };

    /**
    * Set or get the fill color of the sensor bars
    * @name sensorBarOpacity
    * @memberof dc.barChart
    * @instance
    * @param {Number} [sensorBarOpacity=0]
    * @return {Number|dc.barChart}
    */
    _chart.sensorBarOpacity = function (sensorBarOpacity) {
        if (!arguments.length) {
            return _sensorBarOpacity;
        }
        _sensorBarOpacity = sensorBarOpacity;
        return _chart;
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

    dc.override(_chart, 'yAxisMax', function () {
        var max;
        if (_groupBars) {
            max = d3.max(flattenStack(), function (p) {
                return p.y;
            });
        } else {
            max = d3.max(flattenStack(), function (p) {
                return (p.y > 0) ? (p.y + p.y0) : p.y0;
            });
        }

        return dc.utils.add(max, _chart.yAxisPadding());
    });

    function flattenStack () {
        var valueses = _chart.data().map(function (layer) { return layer.domainValues; });
        return Array.prototype.concat.apply([], valueses);
    }

    return _chart.anchor(parent, chartGroup);
};
