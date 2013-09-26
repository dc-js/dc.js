/**
## <a name="bar-chart" href="#bar-chart">#</a> Bar Chart [Concrete] < [Stackable Chart](#stackable-chart) < [CoordinateGrid Chart](#coordinate-grid-chart)
Concrete bar chart/histogram implementation.

Examples:

* [Nasdaq 100 Index](http://nickqizhu.github.com/dc.js/)
* [Canadian City Crime Stats](http://nickqizhu.github.com/dc.js/crime/index.html)

#### dc.barChart(parent[, chartGroup])
Create a bar chart instance and attach it to the given parent element.

Parameters:
* parent : string|compositeChart - any valid d3 single selector representing typically a dom block element such
   as a div, or if this bar chart is a sub-chart in a [Composite Chart](#composite-chart) then pass in the parent composite chart instance.
* chartGroup : string (optional) - name of the chart group this chart instance should be placed in. Once a chart is placed
   in a certain chart group then any interaction with such instance will only trigger events and redraw within the same
   chart group.

Return:
A newly created bar chart instance

```js
// create a bar chart under #chart-container1 element using the default global chart group
var chart1 = dc.barChart("#chart-container1");
// create a bar chart under #chart-container2 element using chart group A
var chart2 = dc.barChart("#chart-container2", "chartGroupA");
// create a sub-chart under a composite parent chart
var chart3 = dc.barChart(compositeChart);
```

**/
dc.barChart = function (parent, chartGroup) {
    var MIN_BAR_WIDTH = 1;
    var DEFAULT_GAP_BETWEEN_BARS = 2;

    var _chart = dc.stackableChart(dc.coordinateGridChart({}));

    var _gap = DEFAULT_GAP_BETWEEN_BARS;
    var _centerBar = false;

    var _numberOfBars;
    var _barWidth;

    dc.override(_chart, 'rescale', function () {
        _chart._rescale();
        _numberOfBars = undefined;
        _barWidth = undefined;
        getNumberOfBars();
    });

    _chart.plotData = function () {
        var layers = _chart.chartBodyG().selectAll("g.stack")
            .data(_chart.stackLayers());

        calculateBarWidth();

        layers
            .enter()
            .append("g")
            .attr("class", function (d, i) {
                return "stack " + "_" + i;
            });

        layers.each(function (d, i) {
            var layer = d3.select(this);

            renderBars(layer, d, i);
        });

        _chart.stackLayers(null);
    };

    function barHeight(d) {
        return dc.utils.safeNumber(Math.abs(_chart.y()(d.y + d.y0) - _chart.y()(d.y0)));
    }

    function renderBars(layer, d, i) {
        var bars = layer.selectAll("rect.bar")
            .data(d.points);

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("fill", _chart.getColor)
            .append("title").text(_chart.title());

        if (_chart.isOrdinal())
            bars.on("click", onClick);

        dc.transition(bars, _chart.transitionDuration())
            .attr("x", function (d) {
                var x = _chart.x()(d.x);
                if (_centerBar || _chart.isOrdinal()) x -= _barWidth / 2;
                return  dc.utils.safeNumber(x);
            })
            .attr("y", function (d) {
                var y = _chart.y()(d.y + d.y0);

                if (d.y < 0)
                    y -= barHeight(d);

                return dc.utils.safeNumber(y);
            })
            .attr("width", _barWidth)
            .attr("height", function (d) {
                return barHeight(d);
            })
            .select("title").text(_chart.title());

        dc.transition(bars.exit(), _chart.transitionDuration())
            .attr("height", 0)
            .remove();
    }

    function calculateBarWidth() {
        if (_barWidth === undefined) {
            var numberOfBars = _chart.isOrdinal() ? getNumberOfBars() + 1 : getNumberOfBars();

            var w = Math.floor((_chart.xAxisLength() - (numberOfBars - 1) * _gap) / numberOfBars);

            if (w == Infinity || isNaN(w) || w < MIN_BAR_WIDTH)
                w = MIN_BAR_WIDTH;

            _barWidth = w;
        }
    }

    function getNumberOfBars() {
        if (_numberOfBars === undefined) {
            _numberOfBars = _chart.xUnitCount();
        }

        return _numberOfBars;
    }

    _chart.fadeDeselectedArea = function () {
        var bars = _chart.chartBodyG().selectAll("rect.bar");
        var extent = _chart.brush().extent();

        if (_chart.isOrdinal()) {
            if (_chart.hasFilter()) {
                bars.classed(dc.constants.SELECTED_CLASS, function (d) {
                    return _chart.hasFilter(_chart.keyAccessor()(d.data));
                });
                bars.classed(dc.constants.DESELECTED_CLASS, function (d) {
                    return !_chart.hasFilter(_chart.keyAccessor()(d.data));
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
                    var xValue = _chart.keyAccessor()(d.data);
                    return xValue < start || xValue >= end;
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
        if (!arguments.length) return _centerBar;
        _centerBar = _;
        return _chart;
    };

    function onClick(d) {
        _chart.onClick(d.data);
    }

    /**
    #### .gap(gapBetweenBars)
    Manually set fixed gap (in px) between bars instead of relying on the default auto-generated gap. By default bar chart
    implementation will calculate and set the gap automatically based on the number of data points and the length of the x axis.

    **/
    _chart.gap = function (_) {
        if (!arguments.length) return _gap;
        _gap = _;
        return _chart;
    };

    _chart.extendBrush = function () {
        var extent = _chart.brush().extent();
        if (_chart.round() && !_centerBar) {
            extent[0] = extent.map(_chart.round())[0];
            extent[1] = extent.map(_chart.round())[1];

            _chart.chartBodyG().select(".brush")
                .call(_chart.brush().extent(extent));
        }
        return extent;
    };

    _chart.legendHighlight = function (d) {
        _chart.select('.chart-body').selectAll('rect.bar').filter(function () {
            return d3.select(this).attr('fill') == d.color;
        }).classed('highlight', true);
        _chart.select('.chart-body').selectAll('rect.bar').filter(function () {
            return d3.select(this).attr('fill') != d.color;
        }).classed('fadeout', true);
    };

    _chart.legendReset = function (d) {
        _chart.selectAll('.chart-body').selectAll('rect.bar').filter(function () {
            return d3.select(this).attr('fill') == d.color;
        }).classed('highlight', false);
        _chart.selectAll('.chart-body').selectAll('rect.bar').filter(function () {
            return d3.select(this).attr('fill') != d.color;
        }).classed('fadeout', false);
    };

    return _chart.anchor(parent, chartGroup);
};
