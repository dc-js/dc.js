dc.multiBarChart = function (parent, chartGroup) {
    var MIN_BAR_WIDTH = 1;
    var DEFAULT_GAP_BETWEEN_BARS = 2;

    var _chart = dc.multiGroupMixin(dc.stackMixin(dc.coordinateGridMixin({})));

    var _gap = DEFAULT_GAP_BETWEEN_BARS;
    var _centerBar = false;
    var _alwaysUseRounding = false;

    var _maxBarleLabelWidth = 0;
    var _barWidth;

    dc.override(_chart, 'rescale', function () {
        _chart._rescale();
        _barWidth = undefined;
    });

    _chart._labelFormatter = function (d) { return d; };
    _chart._barLabels = false;

    dc.override(_chart, 'render', function () {
        if (_chart.round() && _centerBar && !_alwaysUseRounding) {
            dc.logger.warn('By default, brush rounding is disabled if bars are centered. ' +
                         'See dc.js bar chart API documentation for details.');
        }

        _chart._render();
    });

    _chart.plotData = function () {

        var data = [];
        _chart.groups().forEach(function (m, i) {
            var row = {};
            row.data = m.all();
            row.data.forEach(function (d, j) {
                d.valueAccessor = _chart.valueAccessor();
                d.x  = _chart.keyAccessor()(d);
                d.y  = d.valueAccessor(d);
                d.y0 = 0;
            });
            data.push(row);
        });

        var layers = _chart.chartBodyG().selectAll('g.series').data(data);

        calculateBarWidth();
        calculateMaxBarLabelWidth();

        layers
            .enter()
            .append('g')
            .attr('class', function (d, i) {
                return 'series ' + '_' + i;
            });

        layers.each(function (d, i) {
            var layer = d3.select(this);
            renderBars(layer, i, d);
        });
    };

    function calculateMaxBarLabelWidth () {
        var
            max  = 0,
            data = _chart.groups();

        max = d3.max(data, function (g, i) {
            return d3.max(g.all(), function (h, j) {
                return 5.5 * _chart._labelFormatter(h.valueAccessor(h)).length;
            });
        });
        _maxBarleLabelWidth = max;
    }

    function barHeight (d) {
        return dc.utils.safeNumber(Math.abs(_chart.y()(d.y + d.y0) - _chart.y()(d.y0)));
    }

    function barLabelY (d) {
        var
            labY = 0,
            labP = 'out',
            curY = _chart.y()(d.y + d.y0);

        if (curY < 15) {
            labY = curY + 15;
            labP = 'in';
        } else {
            labY = curY - 5;
        }
        labY = dc.utils.safeNumber(labY);

        return {'y': labY, 'p': labP};
    }

    function renderBars (layer, layerIndex, d) {

        var bars = layer.selectAll('g.bargr').data(d.data);

        var barEnter = bars.enter()
            .append('g')
                .attr('class', 'bargr');

        barEnter
            .append('rect')
                .attr('class', 'bar')
                .attr('fill', function (d) {
                    return _chart.colors()(layerIndex);
                })
                .attr('height', 0)
                .attr('width', _barWidth)
                .attr('x', function (d) {
                    var x;
                    x  = _chart.x()(d.x) + _chart.groupGap() / 2;
                    x += layerIndex * (_barWidth + _gap);
                    x += _gap / 2;
                    return dc.utils.safeNumber(x);
                })
                .attr('y', function (d) {
                    return _chart.y()(0);
                });

        /*if (_chart.renderTitle()) {
            bars.append('title').text(dc.pluck('data', _chart.title(d.name)));
        }*/

        if (_chart.isOrdinal()) {
            bars.on('click', onClick);
        }

        dc.transition(bars.selectAll('rect.bar'), _chart.transitionDuration())
            .attr('y', function (d) {
                var y = _chart.y()(d.y + d.y0);

                if (d.y < 0) {
                    y -= barHeight(d);
                }

                return dc.utils.safeNumber(y);
            })
            .attr('height', function (d) {
                return barHeight(d);
            });

        dc.transition(bars.exit(), _chart.transitionDuration())
            .attr('height', function (d) {
                return 0;
            })
            .remove();

        if (_chart.barLabels() && _maxBarleLabelWidth <= _barWidth) {
            barEnter.append('text')
                    .attr('class', 'bar-label')
                    .attr('text-anchor', 'middle')
                    .attr('y', function (d) {
                        return _chart.y()(0);
                    })
                    .attr('data-prevvalue', function (d) {
                        return d.valueAccessor(d);
                    });

            var labels = layer.selectAll('text.bar-label')
                    .data(d.data)
                    .text(function (e) {
                        var dat = Math.abs(e.valueAccessor(e));
                        var ret = _chart._labelFormatter(dat);
                        return ret;
                    });

            dc.transition(labels, _chart.transitionDuration())
                .attr('x', function (d) {
                    var x = _chart.x()(d.x);
                    if (_chart.isOrdinal()) {
                        x += _barWidth / 2;
                        x += 0.5 * _chart.groupGap() + 0.5 * _gap;
                        x += layerIndex * (_barWidth + _gap);
                    }
                    return dc.utils.safeNumber(x);
                })
                .attr('y', function (d) {
                    return barLabelY(d).y;
                })
                .style('fill', function (d) {
                    if (barLabelY(d).p === 'in') {
                        return 'white';
                    }
                    if (barLabelY(d).p === 'out') {
                        return '#3d3d3d';
                    }
                })
                .tween('text', function (d) {
                    var
                        start,
                        end,
                        i;

                    start = d3.select(this).attr('data-prevvalue');
                    end   = d.valueAccessor(d);
                    i     = d3.interpolate(start, end);
                    return function (t) {
                        this.textContent = _chart._labelFormatter(i(t));
                    };
                })
                .each('end', function (d) {
                    d3.select(this).attr('data-prevvalue', function (d) {
                        return d.valueAccessor(d);
                    });
                });
        }
    }

    function calculateBarWidth () {
        if (_barWidth === undefined) {
            var numberOfBars = _chart.xUnitCount() * _chart.groups().length;

            if (_chart.isOrdinal()) {
                _barWidth = (_chart.x().rangeBand() - _chart.groupGap()) / _chart.groups().length - _gap;
            } else {
                _barWidth = Math.floor((_chart.xAxisLength() - (_chart.xUnitCount() - 1) * _chart.groupGap() -
                        _chart.groups().length * _gap) / numberOfBars);
            }

            if (_barWidth === Infinity || isNaN(_barWidth) || _barWidth < MIN_BAR_WIDTH) {
                _barWidth = MIN_BAR_WIDTH;
            }
        }
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
    #### .centerBar(boolean)
    Whether the bar chart will render each bar centered around the data position on x axis. Default to false.

    **/
    _chart.centerBar = function (_) {
        if (!arguments.length) {
            return _centerBar;
        }
        _centerBar = _;
        return _chart;
    };

    function onClick (d) {
        _chart.onClick(d);
    }

    /**
    #### .barPadding([padding])
    Get or set the spacing between bars as a fraction of bar size. Valid values are within 0-1.
    Setting this value will also remove any previously set `gap`. See the
    [d3 docs](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeBands)
    for a visual description of how the padding is applied.
    **/
    _chart.barPadding = function (_) {
        if (!arguments.length) {
            return _chart._rangeBandPadding();
        }
        _chart._rangeBandPadding(_);
        _gap = 0;
        return _chart;
    };

    /**
    #### .outerPadding([padding])
    Get or set the outer padding on an ordinal bar chart. This setting has no effect on non-ordinal charts.
    Padding equivlent in width to `padding * barWidth` will be added on each side of the chart.

    Default: 0.5
    **/
    _chart.outerPadding = _chart._outerRangeBandPadding;

    /**
    #### .gap(gapBetweenBars)
    Manually set fixed gap (in px) between bars instead of relying on the default auto-generated gap. By default bar chart
    implementation will calculate and set the gap automatically based on the number of data points and the length of the x axis.

    **/
    _chart.gap = function (_) {
        if (!arguments.length) {
            return _gap;
        }
        _gap = _;
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
    #### .alwaysUseRounding([boolean])
    Set or get the flag which determines whether rounding is enabled when bars are centered (default: false).
    If false, using rounding with centered bars will result in a warning and rounding will be ignored.
    This flag has no effect if bars are not centered.

    When using standard d3.js rounding methods, the brush often doesn't align correctly with centered bars since the bars are offset.
    The rounding function must add an offset to compensate, such as in the following example.
    ```js
    chart.round(function (n) {return Math.floor(n)+0.5});
    ```
    **/
    _chart.alwaysUseRounding = function (_) {
        if (!arguments.length) {
            return _alwaysUseRounding;
        }
        _alwaysUseRounding = _;
        return _chart;
    };

    _chart.barLabels = function (_) {
        if (!arguments.length) {
            return _chart._barLabels;
        }
        _chart._barLabels = _;
        return _chart;
    };

    _chart.labelFormatter = function (_) {
        if (!arguments.length) {
            return _chart._labelFormatter;
        }
        _chart._labelFormatter = _;
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

    _chart.yAxisMax = function () {
        var max = d3.max(_chart.groups(), function (e) {
            var groupmax = d3.max(e.all(), function (d) {
                d.valueAccessor = _chart.valueAccessor();
                return d.valueAccessor(d);
            });
            return groupmax;
        });
        return max;
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
