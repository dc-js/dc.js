dc.barChart = function (parent, chartGroup) {
    var MIN_BAR_WIDTH = 1;
    var DEFAULT_GAP_BETWEEN_BARS = 2;

    var _chart = dc.stackMixin(dc.coordinateGridMixin({}));

    var _gap = DEFAULT_GAP_BETWEEN_BARS;
    var _centerBar = false;
    var _alwaysUseRounding = false;

    var _barWidth;

    dc.override(_chart, 'rescale', function () {
        _chart._rescale();
        _barWidth = undefined;
        return _chart;
    });

    dc.override(_chart, 'render', function () {
        if (_chart.round() && _centerBar && !_alwaysUseRounding) {
            dc.logger.warn('By default, brush rounding is disabled if bars are centered. ' +
                         'See dc.js bar chart API documentation for details.');
        }

        return _chart._render();
    });

    _chart.plotData = function () {
        var layers = _chart.chartBodyG().selectAll('g.stack')
            .data(_chart.data());

        calculateBarWidth();

        layers
            .enter()
            .append('g')
            .attr('class', function (d, i) {
                return 'stack ' + '_' + i;
            });

        layers.each(function (d, i) {
            var layer = d3.select(this);

            renderBars(layer, i, d);
        });
    };

    function barHeight(d) {
        return dc.utils.safeNumber(Math.abs(_chart.y()(d.y + d.y0) - _chart.y()(d.y0)));
    }

    function renderBars(layer, layerIndex, d) {
        var bars = layer.selectAll('rect.bar')
            .data(d.values, dc.pluck('x'));

        var enter = bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', dc.pluck('data', _chart.getColor))
            .attr('y', _chart.yAxisHeight())
            .attr('height', 0);

        if (_chart.renderTitle()) {
            enter.append('title').text(dc.pluck('data', _chart.title(d.name)));
        }

        if (_chart.isOrdinal()) {
            bars.on('click', _chart.onClick);
        }

        dc.transition(bars, _chart.transitionDuration())
            .attr('x', function (d) {
                var x = _chart.x()(d.x);
                if (_centerBar) {
                    x -= _barWidth / 2;
                }
                if (_chart.isOrdinal() && _gap !== undefined) {
                    x += _gap / 2;
                }
                return dc.utils.safeNumber(x);
            })
            .attr('y', function (d) {
                var y = _chart.y()(d.y + d.y0);

                if (d.y < 0) {
                    y -= barHeight(d);
                }

                return dc.utils.safeNumber(y);
            })
            .attr('width', _barWidth)
            .attr('height', function (d) {
                return barHeight(d);
            })
            .attr('fill', dc.pluck('data', _chart.getColor))
            .select('title').text(dc.pluck('data', _chart.title(d.name)));

        dc.transition(bars.exit(), _chart.transitionDuration())
            .attr('height', 0)
            .remove();
    }

    var _chart = dc.layerMixin(dc.coordinateGridMixin({}));

    var _alwaysUseRounding = false,
        _centerBar = false,
        _gap = DEFAULT_GAP_BETWEEN_BARS;

    /**
    #### .alwaysUseRounding([boolean])
    Set or get whether rounding is enabled when bars are centered.  Default: false.  If false, using
    rounding with centered bars will result in a warning and rounding will be ignored.  This flag
    has no effect if bars are not centered.

    When using standard d3.js rounding methods, the brush often doesn't align correctly with
    centered bars since the bars are offset.  The rounding function must add an offset to
    compensate, such as in the following example.
    ```js
    chart.round(function(n) {return Math.floor(n)+0.5});
    ```
    **/
    _chart.alwaysUseRounding = function (_) {
        if (!arguments.length) {
            return _alwaysUseRounding;
        }
        _alwaysUseRounding = _;
        return _chart;
    };

    /**
    #### .barPadding([padding])
    Get or set the spacing between bars as a fraction of bar size. Valid values are between 0-1.
    Setting this value will also remove any previously set `gap`. See the
    [d3 docs](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeBands)
    for a visual description of how the padding is applied.
    **/
    _chart.barPadding = function (_) {
        if (!arguments.length) {
            return _chart._rangeBandPadding();
        }
        _chart._rangeBandPadding(_);
        _gap = undefined;
        return _chart;
    };

    /**
    #### .centerBar(boolean)
    Whether the bar chart will render each bar centered around the data position on x axis. Default: false
    **/
    _chart.centerBar = function (_) {
        if (!arguments.length) {
            return _centerBar;
        }
        _centerBar = _;
        return _chart;
    };

    /**
     #### .gap(gapBetweenBars)
     Manually set fixed gap (in px) between bars instead of relying on the default auto-generated
     gap.  By default the bar chart implementation will calculate and set the gap automatically
     based on the number of data points and the length of the x axis.

    **/
    _chart.gap = function (_) {
        if (!arguments.length) {
            return _gap;
        }
        _gap = _;
        return _chart;
    };

    _chart._useOuterPadding = function () {
        return _gap === undefined;
    };

    /**
    #### .outerPadding([padding])
    Get or set the outer padding on an ordinal bar chart. This setting has no effect on non-ordinal charts.
    Will pad the width by `padding * barWidth` on each side of the chart.

    Default: 0.5
    **/
    _chart.outerPadding = _chart._outerRangeBandPadding;

    _chart.layerFunctor(dc.barChart.layerFn.standard);

    _chart.barWidth = function () {
        var numberOfBars = _chart.xUnitCount(),
            barWidth = MIN_BAR_WIDTH;
        if (_chart.isOrdinal() && _gap === undefined) {
            barWidth = Math.floor(_chart.x().rangeBand());
        } else if (_gap) {
            barWidth = Math.floor((_chart.xAxisLength() - (numberOfBars - 1) * _gap) / numberOfBars);
        } else {
            barWidth = Math.floor(_chart.xAxisLength() / (1 + _chart.barPadding()) / numberOfBars);
        }
        if (barWidth === Infinity || isNaN(barWidth) || barWidth < MIN_BAR_WIDTH) {
            barWidth = MIN_BAR_WIDTH;
        }
        return barWidth;
    };

    _chart.plotData = function () {
        var g = _chart.chartBodyG(),
            data = _chart.layerFn().data;

        var bars = g.selectAll('rect.bar')
            .data(data, function (datum) {
                return datum.key + datum.layer || '';
            });

        bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', _chart.getColor)
            .attr('height', 0);

        _chart.layerFn().render(_chart, dc.transition(bars, _chart.transitionDuration()));

        dc.transition(bars.exit(), _chart.transitionDuration())
            .attr('height', 0)
            .remove();
    };

    _chart.fadeDeselectedArea = function () {};

    _chart.extendBrush = function () {
        var extent = _chart.brush().extent();
        if (_chart.round() && (!_centerBar || _alwaysUseRounding)) {
            _chart.chartBodyG().select('.brush')
                .call(_chart.brush().extent(extent.map(_chart.round())));
        }
        return extent;
    };

    function colorFilter(color, inv) {
        return function () {
            var match = d3.select(this).attr('fill') === color;
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

dc.barChart.layerFn = {
    standard: dc.layerMixin.layerFunctor(function (chart, data) {
        data = dc.layerMixin.dataFn.standard(chart, data);
        var xAxisExtent = d3.extent(data, dc.pluck('key')),
            yAxisExtent = d3.extent(data, dc.pluck('values'));
        return {
            data: data,
            xAxisMin: xAxisExtent[0] || 0,
            xAxisMax: xAxisExtent[1] || 0,
            yAxisMin: yAxisExtent[0] || 0,
            yAxisMax: yAxisExtent[1] || 0,
            render: function (chart, g) {
                var _x = chart.x(),
                    _y = chart.y(),
                    bWidth = chart.barWidth(),
                    cHeight = chart.height();
                g.attr('x', function (d) { return _x(d.key); })
                    .attr('y', function (d) { return _y(d.values); })
                    .attr('width', bWidth)
                    .attr('height', function (d) { return cHeight - _y(d.values); });
            }
        };
    }),
    // {key: 'a', values:[{key: 'x', values: 1}, {key: 'y', values: 2}]}
    stack: dc.layerMixin.layerFunctor(function (chart, data) {
        data = dc.layerMixin.dataFn.key(chart, data);
        var xAxisExtent = d3.extent(data, dc.pluck('key'));
        var yAxisMax = data.reduce(function (extent, datum) {
            var sum = d3.sum(datum.values, dc.pluck('values'));
            return Math.max(extent, sum);
        }, 0);
        data = data.reduce(function (prev, datum) {
            var key = datum.key;
            return prev.concat(datum.values.reduce(function (previous, layerDatum) {
                previous[0].push({
                    key: key,
                    layer: layerDatum.key,
                    values0: previous[1],
                    values1: previous[1] += layerDatum.values
                });
                return previous;
            }, [[], 0])[0]);
        }, []);
        return {
            data: data,
            xAxisMin: xAxisExtent[0] || 0,
            xAxisMax: xAxisExtent[1] || 0,
            yAxisMin: 0,
            yAxisMax: yAxisMax,
            render: function (chart, g) {
                var _x = chart.x(),
                    _y = chart.y(),
                    bWidth = chart.barWidth();
                g.attr('y', function (d) { return _y(d.values1); })
                    .attr('height', function (d) { return _y(d.values0) - _y(d.values1); })
                    .transition()
                    .attr('x', function (d) { return _x(d.key); })
                    .attr('width', bWidth);
            }
        };
    }),
    stack100: dc.layerMixin.layerFunctor(function (chart, data) {
        data = dc.layerMixin.dataFn.key(chart, data);
        var xAxisExtent = d3.extent(data, dc.pluck('key'));
        data = data.reduce(function (prev, datum) {
            var key = datum.key,
                total = d3.sum(datum.values, dc.pluck('values'));
            return prev.concat(datum.values.reduce(function (previous, layerDatum) {
                previous[0].push({
                    key: key,
                    layer: layerDatum.key,
                    values0: previous[1],
                    values1: previous[1] += (layerDatum.values / total)
                });
                return previous;
            }, [[], 0])[0]);
        }, []);
        return {
            data: data,
            xAxisMin: xAxisExtent[0] || 0,
            xAxisMax: xAxisExtent[1] || 0,
            yAxisMin: 0,
            yAxisMax: 1,
            render: function (chart, g) {
                var _x = chart.x(),
                    _y = chart.y(),
                    bWidth = chart.barWidth();
                g.attr('y', function (d) { return _y(d.values1); })
                    .attr('height', function (d) { return _y(d.values0) - _y(d.values1); })
                    .transition()
                    .attr('x', function (d) { return _x(d.key); })
                    .attr('width', bWidth);
            }
        };
    }),
    group: dc.layerMixin.layerFunctor(function (chart, data) {
        var standardData = dc.layerMixin.dataFn.standard(chart, data),
            xAxisExtent = d3.extent(standardData, dc.pluck('key')),
            yAxisExtent = d3.extent(data, dc.pluck('value'));
        data = dc.layerMixin.dataFn.key(chart, data);
        var totalLayers = d3.max(data, function (datum) {
            return datum.values.length;
        });
        data = data.reduce(function (previous, datum) {
            var key = datum.key;
            return previous.concat(datum.values.map(function (layerDatum, i) {
                return {
                    key: key,
                    layer: layerDatum.key,
                    values: layerDatum.values,
                    index: i
                };
            }));
        }, []);
        return {
            data: data,
            xAxisMin: xAxisExtent[0] || 0,
            xAxisMax: xAxisExtent[1] || 0,
            yAxisMin: yAxisExtent[0] || 0,
            yAxisMax: yAxisExtent[1] || 0,
            render: function (chart, g) {
                var _x = chart.x(),
                    _y = chart.y(),
                    bWidth = chart.barWidth() / totalLayers,
                    cHeight = chart.height();
                g.attr('x', function (d) { return _x(d.key) + bWidth * d.index; })
                    .attr('width', bWidth)
                    .transition()
                    .attr('y', function (d) { return _y(d.values); })
                    .attr('height', function (d) { return cHeight - _y(d.values); });
            }
        };
    })
};
