/**
## <a name="composite-chart" href="#composite-chart">#</a> Composite Chart [Concrete] < [CoordinateGrid Chart](#coordinate-grid-chart)
Composite chart is a special kind of chart that resides somewhere between abstract and concrete charts. It does not
generate data visualization directly, but rather working with other concrete charts to do the job. You can essentially
overlay(compose) different bar/line/area charts in a single composite chart to achieve some quite flexible charting
effects.

Examples:
* [Nasdaq 100 Index](http://nickqizhu.github.com/dc.js/)

#### dc.compositeChart(parent[, chartGroup])
Create a composite chart instance and attach it to the given parent element.

Parameters:
* parent : string - any valid d3 single selector representing typically a dom block element such as a div.
* chartGroup : string (optional) - name of the chart group this chart instance should be placed in. Once a chart is placed
   in a certain chart group then any interaction with such instance will only trigger events and redraw within the same
   chart group.

Return:
A newly created composite chart instance

```js
// create a composite chart under #chart-container1 element using the default global chart group
var compositeChart1 = dc.compositeChart("#chart-container1");
// create a composite chart under #chart-container2 element using chart group A
var compositeChart2 = dc.compositeChart("#chart-container2", "chartGroupA");
```

**/
dc.compositeChart = function (parent, chartGroup) {
    var SUB_CHART_CLASS = "sub";

    var _chart = dc.coordinateGridChart({});
    var _children = [];

    _chart.transitionDuration(500);
    _chart.group({});

    dc.override(_chart, "_generateG", function () {
        var g = this.__generateG();

        for (var i = 0; i < _children.length; ++i) {
            var child = _children[i];

            generateChildG(child, i);

            if (child.dimension() === undefined) child.dimension(_chart.dimension());
            if (child.group() === undefined) child.group(_chart.group());
            child.chartGroup(_chart.chartGroup());
            child.svg(_chart.svg());
            child.xUnits(_chart.xUnits());
            child.transitionDuration(_chart.transitionDuration());
            child.brushOn(_chart.brushOn());
        }

        return g;
    });

    function generateChildG(child, i) {
        child._generateG(_chart.g());
        child.g().attr("class", SUB_CHART_CLASS + " _" + i);
    }

    _chart.plotData = function () {
        for (var i = 0; i < _children.length; ++i) {
            var child = _children[i];

            if (child.g() === undefined) {
                generateChildG(child, i);
            }

            child.x(_chart.x());
            child.y(_chart.y());
            child.xAxis(_chart.xAxis());
            child.yAxis(_chart.yAxis());

            child.plotData();

            child.activateRenderlets();
        }
    };

    _chart.fadeDeselectedArea = function () {
        for (var i = 0; i < _children.length; ++i) {
            var child = _children[i];
            child.brush(_chart.brush());
            child.fadeDeselectedArea();
        }
    };

    /**
    #### .compose(subChartArray)
    Combine the given charts into one single composite coordinate grid chart.

    ```js
    // compose the given charts in the array into one single composite chart
    moveChart.compose([
        // when creating sub-chart you need to pass in the parent chart
        dc.lineChart(moveChart)
            .group(indexAvgByMonthGroup) // if group is missing then parent's group will be used
            .valueAccessor(function(d){return d.value.avg;})
            // most of the normal functions will continue to work in a composed chart
            .renderArea(true)
            .stack(monthlyMoveGroup, function(d){return d.value;})
            .title(function(d){
                var value = d.value.avg?d.value.avg:d.value;
                if(isNaN(value)) value = 0;
                return dateFormat(d.key) + "\n" + numberFormat(value);
            }),
        dc.barChart(moveChart)
            .group(volumeByMonthGroup)
            .centerBar(true)
    ]);
    ```

    **/
    _chart.compose = function (charts) {
        _children = charts;
        for (var i = 0; i < _children.length; ++i) {
            var child = _children[i];
            child.height(_chart.height());
            child.width(_chart.width());
            child.margins(_chart.margins());
        }
        return _chart;
    };

    _chart.children = function () {
        return _children;
    };

    function getAllYAxisMinFromChildCharts() {
        var allMins = [];
        for (var i = 0; i < _children.length; ++i) {
            allMins.push(_children[i].yAxisMin());
        }
        return allMins;
    }

    _chart.yAxisMin = function () {
        return d3.min(getAllYAxisMinFromChildCharts());
    };

    function getAllYAxisMaxFromChildCharts() {
        var allMaxes = [];
        for (var i = 0; i < _children.length; ++i) {
            allMaxes.push(_children[i].yAxisMax());
        }
        return allMaxes;
    }

    _chart.yAxisMax = function () {
        return dc.utils.add(d3.max(getAllYAxisMaxFromChildCharts()), _chart.yAxisPadding());
    };

    function getAllXAxisMinFromChildCharts() {
        var allMins = [];
        for (var i = 0; i < _children.length; ++i) {
            allMins.push(_children[i].xAxisMin());
        }
        return allMins;
    }

    _chart.xAxisMin = function () {
        return dc.utils.subtract(d3.min(getAllXAxisMinFromChildCharts()), _chart.xAxisPadding());
    };

    function getAllXAxisMaxFromChildCharts() {
        var allMaxes = [];
        for (var i = 0; i < _children.length; ++i) {
            allMaxes.push(_children[i].xAxisMax());
        }
        return allMaxes;
    }

    _chart.xAxisMax = function () {
        return dc.utils.add(d3.max(getAllXAxisMaxFromChildCharts()), _chart.xAxisPadding());
    };

    _chart.legendables = function () {
        var items = [];
        _children.forEach(function(childChart, j) {
            var childLegendables = childChart.legendables();
            if (childLegendables.length > 1)
                items.push.apply(items,childLegendables);
            else
                items.push(dc.utils.createLegendable(childChart, childChart.group(), j, childChart.valueAccessor()));
        });
        return items;
    };

    _chart.legendHighlight = function (d) {
        for (var j = 0; j < _children.length; ++j) {
            var child = _children[j];
            child.legendHighlight(d);
        }
    };

    _chart.legendReset = function (d) {
        for (var j = 0; j < _children.length; ++j) {
            var child = _children[j];
            child.legendReset(d);
        }
    };

    return _chart.anchor(parent, chartGroup);
};
