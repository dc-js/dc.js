import * as d3 from 'd3';
import stackMixin from './stack-mixin';
import coordinateGridMixin from './coordinate-grid-mixin';
import {override, transition} from './core';
import {pluck, utils} from './utils';

/**
## Line Chart
Includes [Stack Mixin](#stack-mixin), [Coordinate Grid Mixin](#coordinate-grid-mixin)

Concrete line/area chart implementation.

Examples:
* [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)
* [Canadian City Crime Stats](http://dc-js.github.com/dc.js/crime/index.html)
#### dc.lineChart(parent[, chartGroup])
Create a line chart instance and attach it to the given parent element.

Parameters:

* parent : string | node | selection | compositeChart - any valid
 [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 a dom block element such as a div; or a dom element or d3 selection.
 If the line chart is a sub-chart in a [Composite Chart](#composite-chart) then pass in the parent composite
 chart instance.

* chartGroup : string (optional) - name of the chart group this chart instance should be placed in.
 Interaction with a chart will only trigger events and redraws within the chart's group.

Returns:
A newly created line chart instance

```js
// create a line chart under #chart-container1 element using the default global chart group
var chart1 = dc.lineChart('#chart-container1');
// create a line chart under #chart-container2 element using chart group A
var chart2 = dc.lineChart('#chart-container2', 'chartGroupA');
// create a sub-chart under a composite parent chart
var chart3 = dc.lineChart(compositeChart);
```

**/
var lineChart = function (parent, chartGroup) {
    var DEFAULT_DOT_RADIUS = 5;
    var TOOLTIP_G_CLASS = 'dc-tooltip';
    var DOT_CIRCLE_CLASS = 'dot';
    var Y_AXIS_REF_LINE_CLASS = 'yRef';
    var X_AXIS_REF_LINE_CLASS = 'xRef';
    var DEFAULT_DOT_OPACITY = 1e-6;

    var _chart = stackMixin(coordinateGridMixin({}));
    var _renderArea = false;
    var _dotRadius = DEFAULT_DOT_RADIUS;
    var _dataPointRadius = null;
    var _dataPointFillOpacity = DEFAULT_DOT_OPACITY;
    var _dataPointStrokeOpacity = DEFAULT_DOT_OPACITY;
    var _interpolate = 'linear';
    var _tension = 0.7;
    var _defined;
    var _dashStyle;
    var _xyTipsOn = true;

    _chart.transitionDuration(500);
    _chart._rangeBandPadding(1);

    _chart.plotData = function () {
        var chartBody = _chart.chartBodyG();
        var layersList = chartBody.selectAll('g.stack-list');

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

        drawLine(layersEnter, layers);

        drawArea(layersEnter, layers);

        drawDots(chartBody, layers);
    };

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
        return _chart;
    };

    /**
     #### .tension([value])
     Gets or sets the tension to use for lines drawn, in the range 0 to 1.
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

    function colors(d, i) {
        return _chart.getColor.call(d, d.values, i);
    }

    function drawLine(layersEnter, layers) {
        var line = d3.svg.line()
            .x(function (d) {
                return _chart.x()(d.x);
            })
            .y(function (d) {
                return _chart.y()(d.y + d.y0);
            })
            .interpolate(_interpolate)
            .tension(_tension);
        if (_defined) {
            line.defined(_defined);
        }

        var path = layersEnter.append('path')
            .attr('class', 'line')
            .attr('stroke', colors);
        if (_dashStyle) {
            path.attr('stroke-dasharray', _dashStyle);
        }

        transition(layers.select('path.line'), _chart.transitionDuration())
            //.ease('linear')
            .attr('stroke', colors)
            .attr('d', function (d) {
                return safeD(line(d.values));
            });
    }

    function drawArea(layersEnter, layers) {
        if (_renderArea) {
            var area = d3.svg.area()
                .x(function (d) {
                    return _chart.x()(d.x);
                })
                .y(function (d) {
                    return _chart.y()(d.y + d.y0);
                })
                .y0(function (d) {
                    return _chart.y()(d.y0);
                })
                .interpolate(_interpolate)
                .tension(_tension);
            if (_defined) {
                area.defined(_defined);
            }

            layersEnter.append('path')
                .attr('class', 'area')
                .attr('fill', colors)
                .attr('d', function (d) {
                    return safeD(area(d.values));
                });

            transition(layers.select('path.area'), _chart.transitionDuration())
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

    function drawDots(chartBody, layers) {
        if (!_chart.brushOn() && _chart.xyTipsOn()) {
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
                    .data(points, pluck('x'));

                dots.enter()
                    .append('circle')
                    .attr('class', DOT_CIRCLE_CLASS)
                    .attr('r', getDotRadius())
                    .style('fill-opacity', _dataPointFillOpacity)
                    .style('stroke-opacity', _dataPointStrokeOpacity)
                    .on('mousemove', function () {
                        var dot = d3.select(this);
                        showDot(dot);
                        showRefLines(dot, g);
                    })
                    .on('mouseout', function () {
                        var dot = d3.select(this);
                        hideDot(dot);
                        hideRefLines(g);
                    });

                dots
                    .attr('cx', function (d) {
                        return utils.safeNumber(_chart.x()(d.x));
                    })
                    .attr('cy', function (d) {
                        return utils.safeNumber(_chart.y()(d.y + d.y0));
                    })
                    .attr('fill', _chart.getColor)
                    .call(renderTitle, d);

                dots.exit().remove();
            });
        }
    }

    function createRefLines(g) {
        var yRefLine = g.select('path.' + Y_AXIS_REF_LINE_CLASS).empty() ?
            g.append('path').attr('class', Y_AXIS_REF_LINE_CLASS) : g.select('path.' + Y_AXIS_REF_LINE_CLASS);
        yRefLine.style('display', 'none').attr('stroke-dasharray', '5,5');

        var xRefLine = g.select('path.' + X_AXIS_REF_LINE_CLASS).empty() ?
            g.append('path').attr('class', X_AXIS_REF_LINE_CLASS) : g.select('path.' + X_AXIS_REF_LINE_CLASS);
        xRefLine.style('display', 'none').attr('stroke-dasharray', '5,5');
    }

    function showDot(dot) {
        dot.style('fill-opacity', 0.8);
        dot.style('stroke-opacity', 0.8);
        dot.attr('r', _dotRadius);
        return dot;
    }

    function showRefLines(dot, g) {
        var x = dot.attr('cx');
        var y = dot.attr('cy');
        var yAxisX = (_chart._yAxisX() - _chart.margins().left);
        var yAxisRefPathD = 'M' + yAxisX + ' ' + y + 'L' + (x) + ' ' + (y);
        var xAxisRefPathD = 'M' + x + ' ' + _chart.yAxisHeight() + 'L' + x + ' ' + y;
        g.select('path.' + Y_AXIS_REF_LINE_CLASS).style('display', '').attr('d', yAxisRefPathD);
        g.select('path.' + X_AXIS_REF_LINE_CLASS).style('display', '').attr('d', xAxisRefPathD);
    }

    function getDotRadius() {
        return _dataPointRadius || _dotRadius;
    }

    function hideDot(dot) {
        dot.style('fill-opacity', _dataPointFillOpacity)
            .style('stroke-opacity', _dataPointStrokeOpacity)
            .attr('r', getDotRadius());
    }

    function hideRefLines(g) {
        g.select('path.' + Y_AXIS_REF_LINE_CLASS).style('display', 'none');
        g.select('path.' + X_AXIS_REF_LINE_CLASS).style('display', 'none');
    }

    function renderTitle(dot, d) {
        if (_chart.renderTitle()) {
            dot.selectAll('title').remove();
            dot.append('title').text(pluck('data', _chart.title(d.name)));
        }
    }

    /**
     #### .xyTipsOn([boolean])
     Turn on/off the mouseover behavior of an individual data point which renders a circle and x/y axis
     dashed lines back to each respective axis.  This is ignored if the chart brush is on (`brushOn`)
     Default: true
     */
    _chart.xyTipsOn = function (_) {
        if (!arguments.length) {
            return _xyTipsOn;
        }
        _xyTipsOn = _;
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

    /**
    #### .renderDataPoints([options])
    Always show individual dots for each datapoint.

    Options, if given, is an object that can contain the following:

    * fillOpacity (default 0.8)
    * strokeOpacity (default 0.8)
    * radius (default 2)

    If `options` is falsy, it disables data point rendering.

    If no `options` are provided, the current `options` values are instead returned.

    Example:
    ```
    chart.renderDataPoints({radius: 2, fillOpacity: 0.8, strokeOpacity: 0.8})
    ```
    **/
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

    override(_chart, 'legendables', function () {
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

export default lineChart;
