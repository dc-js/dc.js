dc.lineChart = function (parent, chartGroup) {
    var DEFAULT_DOT_RADIUS = 5,
        DEFAULT_DOT_OPACITY = 1;

    var _chart = dc.layerMixin(dc.coordinateGridMixin({})),
        _renderArea = false,
        _dotRadius = DEFAULT_DOT_RADIUS,
        _dataPointRadius = DEFAULT_DOT_RADIUS,
        _dataPointFillOpacity = DEFAULT_DOT_OPACITY,
        _dataPointStrokeOpacity = DEFAULT_DOT_OPACITY,
        _interpolate = 'linear',
        _tension = 0.7,
        _defined,
        _dashStyle,
        _safePath = function (d) { return (!d || d.indexOf('NaN') >= 0) ? 'M0,0' : d; },
        _line = d3.svg.line()
            .interpolate(_interpolate)
            .tension(_tension),
        _lineEnterExit = d3.svg.line()
            .interpolate(_interpolate)
            .tension(_tension),
        _area = d3.svg.area()
            .interpolate(_interpolate)
            .tension(_tension),
        _areaEnterExit = d3.svg.area()
            .interpolate(_interpolate)
            .tension(_tension);

    _chart.transitionDuration(500);
    _chart._rangeBandPadding(1);

    /**
     #### .interpolate([value])
     Gets or sets the interpolator to use for lines drawn, by string name, allowing e.g. step
     functions, splines, and cubic interpolation.  This is passed to
     [d3.svg.line.interpolate](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate) and
     [d3.svg.area.interpolate](https://github.com/mbostock/d3/wiki/SVG-Shapes#area_interpolate),
     where you can find a complete list of valid arguments
     **/
    _chart.interpolate = function (_) {
        if (!arguments.length) {
            return _interpolate;
        }
        _interpolate = _;
        _line.interpolate(_interpolate);
        _lineEnterExit.interpolate(_interpolate);
        _area.interpolate(_interpolate);
        _areaEnterExit.interpolate(_interpolate);
        return _chart;
    };

    /**
     #### .tension([value]) Gets or sets the tension to use for lines drawn, in the range 0 to 1.
     This parameter further customizes the interpolation behavior.  It is passed to
     [d3.svg.line.tension](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_tension) and
     [d3.svg.area.tension](https://github.com/mbostock/d3/wiki/SVG-Shapes#area_tension).  Default:
     0.7
     **/
    _chart.tension = function (_) {
        if (!arguments.length) {
            return _tension;
        }
        _tension = _;
        _line.tension(_tension);
        _lineEnterExit.tension(_tension);
        _area.tension(_tension);
        _areaEnterExit.tension(_tension);
        return _chart;
    };

    /**
     #### .defined([value])
     Gets or sets a function that will determine discontinuities in the line which should be
     skipped: the path will be broken into separate subpaths if some points are undefined.
     This function is passed to
     [d3.svg.line.defined](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_defined)

     Note: crossfilter will sometimes coerce nulls to 0, so you may need to carefully write
     custom reduce functions to get this to work, depending on your data. See
     https://github.com/dc-js/dc.js/issues/615#issuecomment-49089248
     **/
    _chart.defined = function (_) {
        if (!arguments.length) {
            return _defined;
        }
        _defined = _;
        return _chart;
    };

    /**
    #### .dashStyle([array])
    Set the line's d3 dashstyle. This value becomes the 'stroke-dasharray' of line. Defaults to empty
    array (solid line).
     ```js
     // create a Dash Dot Dot Dot
     chart.dashStyle([3,1,1,1]);
     ```
    **/
    _chart.dashStyle = function (_) {
        if (!arguments.length) {
            return _dashStyle;
        }
        _dashStyle = _;
        return _chart;
    };

    /**
    #### .renderArea([boolean])
    Get or set render area flag. If the flag is set to true then the chart will render the area
    beneath each line and the line chart effectively becomes an area chart.

    **/
    _chart.renderArea = function (_) {
        if (!arguments.length) {
            return _renderArea;
        }
        _renderArea = _;
        return _chart;
    };

    /**
    #### .dotRadius([dotRadius])
    Get or set the radius (in px) for dots displayed on the data points. Default dot radius is 5.
    **/
    _chart.dotRadius = function (_) {
        if (!arguments.length) {
            return _dotRadius;
        }
        _dotRadius = _;
        return _chart;
    };

    _chart.dataPointRadius = function (_) {
        if (!arguments.length) {
            return _dataPointRadius;
        }
        _dataPointRadius = _ || 2;
        return _chart;
    };

    _chart.dataPointFillOpacity = function (_) {
        if (!arguments.length) {
            return _dataPointFillOpacity;
        }
        _dataPointFillOpacity = _ || 0.8;
        return _chart;
    };

    _chart.dataPointStrokeOpacity = function (_) {
        if (!arguments.length) {
            return _dataPointStrokeOpacity;
        }
        _dataPointStrokeOpacity = _ || 0.8;
        return _chart;
    };

    _chart.plotData = function () {
        var _g = _chart.chartBodyG(),
            _data = _chart.layerFn().data,
            _x = _chart.x(),
            _y = _chart.y();
        _line = d3.svg.line()
            .x(function (d) { return _x(d.key); })
            .y(function (d) { return _y(d.values); });
        _lineEnterExit = d3.svg.line()
            .x(function (d) { return _x(d.key); })
            .y(function () { return _y(0); });
        _area = d3.svg.area()
            .x(function (d) { return _x(d.key); })
            .y(function (d) { return _y(d.values); })
            .y0(function (d) { return _y(d.values0); });
        _areaEnterExit = d3.svg.area()
            .x(function (d) { return _x(d.key); })
            .y(function () { return _y(0); })
            .y0(function () { return _y(0); });

        // Layers
        var layers = _g.selectAll('g.layer')
            .data(_data, function (datum, i) { return i; }),
            layersEnter = layers.enter()
                .append('g')
                .attr('class', 'layer'),
            layersExit = layers.exit();

        // Lines
        layersEnter.append('path')
            .attr('class', 'line')
            .attr('stroke', _chart.getColor)
            .attr('stroke-dasharray', _dashStyle || '')
            .attr('d', function (d) { return _safePath(_lineEnterExit(d.values)); });
        dc.transition(layers.select('path.line'), _chart.transitionDuration())
            .attr('stroke', _chart.getColor)
            .attr('stroke-dasharray', _dashStyle || '')
            .attr('d', function (d) { return _safePath(_line(d.values)); });
        dc.transition(layersExit.select('path.line'), _chart.transitionDuration())
            .attr('d', function (d) { return _safePath(_lineEnterExit(d.values)); });

        // Area
        layersEnter.append('path')
            .attr('class', 'area')
            .attr('fill', _chart.getColor)
            .attr('visible', _chart.renderArea)
            .attr('d', function (d) { return _safePath(_areaEnterExit(d.values)); });
        dc.transition(layers.select('path.area'), _chart.transitionDuration())
            .attr('fill', _chart.getColor)
            .attr('d', function (d) { return _safePath(_area(d.values)); });
        dc.transition(layersExit.select('path.area'), _chart.transitionDuration())
            .attr('d', function (d) { return _safePath(_areaEnterExit(d.values)); });

        // Points
        var dots = layers.selectAll('circle')
            .data(function (d) { return d.values; });
        dots.enter()
            .append('circle')
            .attr('cx', function (d) { return dc.utils.safeNumber(_x(d.key)); })
            .attr('cy', function () { return dc.utils.safeNumber(_y(0)); })
            .on('mousemove', function () {
                d3.select(this)
                .attr('r', _dotRadius)
                .style('fill-opacity', 0.8)
                .style('stroke-opacity', 0.8);
            })
            .on('mouseout', function () {
                d3.select(this)
                .attr('r', _dataPointRadius)
                .style('fill-opacity', _dataPointFillOpacity)
                .style('stroke-opacity', _dataPointStrokeOpacity);
            })
            .append('title').text(_chart.title());
        dc.transition(dots, _chart.transitionDuration())
            .attr('cx', function (d) { return dc.utils.safeNumber(_x(d.key)); })
            .attr('cy', function (d) { return dc.utils.safeNumber(_y(d.values)); })
            .attr('r', _dataPointRadius)
            .attr('fill', function () { return _chart.getColor(this.parentNode.__data__); })
            .style('fill-opacity', _dataPointFillOpacity)
            .style('stroke-opacity', _dataPointStrokeOpacity);
        dc.transition(dots.exit(), _chart.transitionDuration())
            .attr('cx', function (d) { return dc.utils.safeNumber(_x(d.key)); })
            .attr('cy', function () { return dc.utils.safeNumber(_y(0)); })
            .remove();
        dc.transition(layersExit, _chart.transitionDuration()).remove();
    };

    function colorFilter(color, dashstyle, inv) {
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

dc.lineChart.layerFn = {
    standard: dc.layerMixin.layerFunctor(function (chart, data) {
        var xAxisExtent = d3.extent(data, chart.keyAccessor()),
            yAxisExtent = d3.extent(data, chart.valueAccessor());
        data = dc.layerMixin.dataFn.layer(chart, data);
        data.forEach(function (datum) {
            datum.values.forEach(function (keyDatum) {
                keyDatum.values0 = 0;
            });
        });
        return {
            data: data,
            xAxisMin: xAxisExtent[0] || 0,
            xAxisMax: xAxisExtent[1] || 0,
            yAxisMin: yAxisExtent[0] || 0,
            yAxisMax: yAxisExtent[1] || 0
        };
    }),
    stack: dc.layerMixin.layerFunctor(function (chart, data) {
        var xAxisExtent = d3.extent(data, chart.keyAccessor());
        data = dc.layerMixin.dataFn.layer(chart, data);
        var keyMap = {},
            yAxisMax = Number.NEGATIVE_INFINITY;
        data.forEach(function (datum) {
            datum.values.forEach(function (keyDatum) {
                var key = keyDatum.key;
                keyDatum.values0 = keyMap[key] = keyMap[key] || 0;
                keyDatum.values = keyMap[key] += keyDatum.values;
                yAxisMax = Math.max(yAxisMax, keyDatum.values);
            });
        });
        return {
            data: data,
            xAxisMin: xAxisExtent[0] || 0,
            xAxisMax: xAxisExtent[1] || 0,
            yAxisMin: 0,
            yAxisMax: yAxisMax === Number.NEGATIVE_INFINITY ? 0 : yAxisMax
        };
    }),
    stack100: dc.layerMixin.layerFunctor(function (chart, data) {
        var keyMap = {},
            xAxisExtent = d3.extent(data, chart.keyAccessor());
        data = dc.layerMixin.dataFn.layer(chart, data);
        data.forEach(function (datum) {
            datum.values.forEach(function (keyDatum) {
                var key = keyDatum.key;
                keyDatum.values0 = keyMap[key] = keyMap[key] || 0;
                keyDatum.values = keyMap[key] += keyDatum.values;
            });
        });
        data.forEach(function (datum) {
            datum.values.forEach(function (keyDatum) {
                var keyTotal = keyMap[keyDatum.key];
                keyDatum.values0 /= keyTotal;
                keyDatum.values /= keyTotal;
            });
        });
        return {
            data: data,
            xAxisMin: xAxisExtent[0] || 0,
            xAxisMax: xAxisExtent[1] || 0,
            yAxisMin: 0,
            yAxisMax: 1
        };
    }),
    area: dc.layerMixin.layerFunctor(function (chart, data) {
        var xAxisExtent = d3.extent(data, chart.keyAccessor()),
            yAxisMin = Number.POSITIVE_INFINITY,
            yAxisMax = Number.NEGATIVE_INFINITY;
        data = dc.layerMixin.dataFn.key(chart, data);
        data = data.reduce(function (previous, datum) {
            var key = datum.key,
                values = datum.values,
                extent = d3.extent(values, dc.pluck('values')),
                mean = d3.mean(values, dc.pluck('values')),
                median = d3.median(values, dc.pluck('values'));
            yAxisMin = Math.min(extent[0], yAxisMin);
            yAxisMax = Math.max(extent[1], yAxisMax);
            previous[0].values.push({key: key, values0: extent[0] || 0, values: extent[1] || 0});
            previous[1].values.push({key: key, values0: extent[1] || 0, values: extent[0] || 0});
            previous[2].values.push({key: key, values0: null, values: mean || 0});
            previous[3].values.push({key: key, values0: null, values: median || 0});
            return previous;
        }, [
            {key: 'max', values: []},
            {key: 'min', values: []},
            {key: 'mean', values: []},
            {key: 'mean', values: []}
        ]);
        return {
            data: data,
            xAxisMin: xAxisExtent[0] || 0,
            xAxisMax: xAxisExtent[1] || 0,
            yAxisMin: yAxisMin === Number.POSITIVE_INFINITY ? 0 : yAxisMin,
            yAxisMax: yAxisMax === Number.NEGATIVE_INFINITY ? 0 : yAxisMax
        };
    })
};