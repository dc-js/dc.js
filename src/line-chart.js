/**
## <a name="line-chart" href="#line-chart">#</a> Line Chart [Concrete] < [Stackable Chart](#stackable-chart) < [CoordinateGrid Chart](#coordinate-grid-chart)
Concrete line/area chart implementation.

Examples:
* [Nasdaq 100 Index](http://nickqizhu.github.com/dc.js/)
* [Canadian City Crime Stats](http://nickqizhu.github.com/dc.js/crime/index.html)

#### dc.lineChart(parent[, chartGroup])
Create a line chart instance and attach it to the given parent element.

Parameters:

* parent : string|compositeChart - any valid d3 single selector representing typically a dom block element such
   as a div, or if this line chart is a sub-chart in a [Composite Chart](#composite-chart) then pass in the parent composite chart instance.
* chartGroup : string (optional) - name of the chart group this chart instance should be placed in. Once a chart is placed
   in a certain chart group then any interaction with such instance will only trigger events and redraw within the same
   chart group.

Return:
A newly created line chart instance

```js
// create a line chart under #chart-container1 element using the default global chart group
var chart1 = dc.lineChart("#chart-container1");
// create a line chart under #chart-container2 element using chart group A
var chart2 = dc.lineChart("#chart-container2", "chartGroupA");
// create a sub-chart under a composite parent chart
var chart3 = dc.lineChart(compositeChart);
```

**/
dc.lineChart = function (parent, chartGroup) {
    var DEFAULT_DOT_RADIUS = 5;
    var TOOLTIP_G_CLASS = "dc-tooltip";
    var DOT_CIRCLE_CLASS = "dot";
    var Y_AXIS_REF_LINE_CLASS = "yRef";
    var X_AXIS_REF_LINE_CLASS = "xRef";

    var _chart = dc.stackableChart(dc.coordinateGridChart({}));
    var _renderArea = false;
    var _dotRadius = DEFAULT_DOT_RADIUS;
    var _interpolate = 'linear';
    var _tension = 0.7;
    var _defined;

    _chart.transitionDuration(500);

    _chart.plotData = function () {
        var layers = _chart.chartBodyG().selectAll("g.stack")
            .data(_chart.stackLayers());

        var layersEnter = layers
            .enter()
            .append("g")
            .attr("class", function (d, i) {
                return "stack " + "_" + i;
            });

        drawLine(layersEnter, layers);

        drawArea(layersEnter, layers);

        drawDots(layers);

        _chart.stackLayers(null);
    };

    _chart.interpolate = function(_){
        if (!arguments.length) return _interpolate;
        _interpolate = _;
        return _chart;
    };

    _chart.tension = function(_){
        if (!arguments.length) return _tension;
        _tension = _;
        return _chart;
    };

    _chart.defined = function(_){
        if (!arguments.length) return _defined;
        _defined = _;
        return _chart;
    };

    /**
    #### .renderArea([boolean])
    Get or set render area flag. If the flag is set to true then the chart will render the area beneath each line and effectively
    becomes an area chart.

    **/
    _chart.renderArea = function (_) {
        if (!arguments.length) return _renderArea;
        _renderArea = _;
        return _chart;
    };

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
        if (_defined)
            line.defined(_defined);


        layersEnter.append("path")
            .attr("class", "line")
            .attr("stroke", _chart.getColor)
            .attr("fill", _chart.getColor);

        dc.transition(layers.select("path.line"), _chart.transitionDuration())
            .attr("d", function (d) {
                return safeD(line(d.points));
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
            if (_defined)
                area.defined(_defined);


            layersEnter.append("path")
                .attr("class", "area")
                .attr("fill", _chart.getColor)
                .attr("d", function (d) {
                    return safeD(area(d.points));
                });

            dc.transition(layers.select("path.area"), _chart.transitionDuration())
                .attr("d", function (d) {
                    return safeD(area(d.points));
                });
        }
    }

    function safeD(d){
        return (!d || d.indexOf("NaN") >= 0) ? "M0,0" : d;
    }

    function drawDots(layersEnter) {
        if (!_chart.brushOn()) {
            layersEnter.each(function (d, i) {
                var layer = d3.select(this);

                var g = layer.select("g." + TOOLTIP_G_CLASS);
                if (g.empty()) g = layer.append("g").attr("class", TOOLTIP_G_CLASS);

                createRefLines(g);

                var dots = g.selectAll("circle." + DOT_CIRCLE_CLASS)
                    .data(g.datum().points);

                dots.enter()
                    .append("circle")
                    .attr("class", DOT_CIRCLE_CLASS)
                    .attr("r", _dotRadius)
                    .attr("fill", _chart.getColor)
                    .style("fill-opacity", 1e-6)
                    .style("stroke-opacity", 1e-6)
                    .on("mousemove", function (d) {
                        var dot = d3.select(this);
                        showDot(dot);
                        showRefLines(dot, g);
                    })
                    .on("mouseout", function (d) {
                        var dot = d3.select(this);
                        hideDot(dot);
                        hideRefLines(g);
                    })
                    .append("title").text(_chart.title());

                dots.attr("cx", function (d) {
                        return dc.utils.safeNumber(_chart.x()(d.x));
                    })
                    .attr("cy", function (d) {
                        return dc.utils.safeNumber(_chart.y()(d.y + d.y0));
                    })
                    .select("title").text(_chart.title());

                dots.exit().remove();
            });
        }
    }

    function createRefLines(g) {
        var yRefLine = g.select("path." + Y_AXIS_REF_LINE_CLASS).empty() ? g.append("path").attr("class", Y_AXIS_REF_LINE_CLASS) : g.select("path." + Y_AXIS_REF_LINE_CLASS);
        yRefLine.style("display", "none").attr("stroke-dasharray", "5,5");

        var xRefLine = g.select("path." + X_AXIS_REF_LINE_CLASS).empty() ? g.append("path").attr("class", X_AXIS_REF_LINE_CLASS) : g.select("path." + X_AXIS_REF_LINE_CLASS);
        xRefLine.style("display", "none").attr("stroke-dasharray", "5,5");
    }

    function showDot(dot) {
        dot.style("fill-opacity", 0.8);
        dot.style("stroke-opacity", 0.8);
        return dot;
    }

    function showRefLines(dot, g) {
        var x = dot.attr("cx");
        var y = dot.attr("cy");
        g.select("path." + Y_AXIS_REF_LINE_CLASS).style("display", "").attr("d", "M0 " + y + "L" + (x) + " " + (y));
        g.select("path." + X_AXIS_REF_LINE_CLASS).style("display", "").attr("d", "M" + x + " " + _chart.yAxisHeight() + "L" + x + " " + y);
    }

    function hideDot(dot) {
        dot.style("fill-opacity", 1e-6).style("stroke-opacity", 1e-6);
    }

    function hideRefLines(g) {
        g.select("path." + Y_AXIS_REF_LINE_CLASS).style("display", "none");
        g.select("path." + X_AXIS_REF_LINE_CLASS).style("display", "none");
    }

    /**
    #### .dotRadius([dotRadius])
    Get or set the radius (in px) for data points. Default dot radius is 5.

    **/
    _chart.dotRadius = function (_) {
        if (!arguments.length) return _dotRadius;
        _dotRadius = _;
        return _chart;
    };

    _chart.legendHighlight = function (d) {
        _chart.selectAll('.chart-body').selectAll('path').filter(function () {
            return d3.select(this).attr('fill') == d.color;
        }).classed('highlight', true);
        _chart.selectAll('.chart-body').selectAll('path').filter(function () {
            return d3.select(this).attr('fill') != d.color;
        }).classed('fadeout', true);
    };

    _chart.legendReset = function (d) {
        _chart.selectAll('.chart-body').selectAll('path').filter(function () {
            return d3.select(this).attr('fill') == d.color;
        }).classed('highlight', false);
        _chart.selectAll('.chart-body').selectAll('path').filter(function () {
            return d3.select(this).attr('fill') != d.color;
        }).classed('fadeout', false);
    };

    return _chart.anchor(parent, chartGroup);
};
