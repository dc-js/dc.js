/**
## Composite Chart
Includes: [Coordinate Grid Mixin](#coordinate-grid-mixin)

Composite charts are a special kind of chart that render multiple charts on the same Coordinate
Grid. You can overlay (compose) different bar/line/area charts in a single composite chart to
achieve some quite flexible charting effects.
#### dc.compositeChart(parent[, chartGroup])
Create a composite chart instance and attach it to the given parent element.

Parameters:
* parent : string | node | selection - any valid
 [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 a dom block element such as a div; or a dom element or d3 selection.
* chartGroup : string (optional) - name of the chart group this chart instance should be placed in.
 Interaction with a chart will only trigger events and redraws within the chart's group.

Returns:
A newly created composite chart instance

```js
// create a composite chart under #chart-container1 element using the default global chart group
var compositeChart1 = dc.compositeChart('#chart-container1');
// create a composite chart under #chart-container2 element using chart group A
var compositeChart2 = dc.compositeChart('#chart-container2', 'chartGroupA');
```

**/
dc.compositeChart = function (parent, chartGroup) {

    var SUB_CHART_CLASS = 'sub';
    var DEFAULT_RIGHT_Y_AXIS_LABEL_PADDING = 12;

    var _chart = dc.coordinateGridMixin({});
    var _children = [];

    var _childOptions = {};

    var _shareColors = false,
        _shareTitle = true;

    var _rightYAxis = d3.svg.axis(),
        _rightYAxisLabel = 0,
        _rightYAxisLabelPadding = DEFAULT_RIGHT_Y_AXIS_LABEL_PADDING,
        _rightY,
        _rightAxisGridLines = false;

    _chart._mandatoryAttributes([]);
    _chart.transitionDuration(500);

    dc.override(_chart, '_generateG', function () {
        var g = this.__generateG();

        for (var i = 0; i < _children.length; ++i) {
            var child = _children[i];

            generateChildG(child, i);

            if (!child.dimension()) {
                child.dimension(_chart.dimension());
            }
            if (!child.group()) {
                child.group(_chart.group());
            }

            child.chartGroup(_chart.chartGroup());
            child.svg(_chart.svg());
            child.xUnits(_chart.xUnits());
            child.transitionDuration(_chart.transitionDuration());
            child.brushOn(_chart.brushOn());
            child.renderTitle(_chart.renderTitle());
        }

        return g;
    });

    _chart._brushing = function () {
        var extent = _chart.extendBrush();
        var brushIsEmpty = _chart.brushIsEmpty(extent);

        for (var i = 0; i < _children.length; ++i) {
            _children[i].filter(null);
            if (!brushIsEmpty) {
                _children[i].filter(extent);
            }
        }
    };

    _chart._prepareYAxis = function () {
        if (leftYAxisChildren().length !== 0) { prepareLeftYAxis(); }
        if (rightYAxisChildren().length !== 0) { prepareRightYAxis(); }

        if (leftYAxisChildren().length > 0 && !_rightAxisGridLines) {
            _chart._renderHorizontalGridLinesForAxis(_chart.g(), _chart.y(), _chart.yAxis());
        }
        else if (rightYAxisChildren().length > 0) {
            _chart._renderHorizontalGridLinesForAxis(_chart.g(), _rightY, _rightYAxis);
        }
    };

    _chart.renderYAxis = function () {
        if (leftYAxisChildren().length !== 0) {
            _chart.renderYAxisAt('y', _chart.yAxis(), _chart.margins().left);
            _chart.renderYAxisLabel('y', _chart.yAxisLabel(), -90);
        }

        if (rightYAxisChildren().length !== 0) {
            _chart.renderYAxisAt('yr', _chart.rightYAxis(), _chart.width() - _chart.margins().right);
            _chart.renderYAxisLabel('yr', _chart.rightYAxisLabel(), 90, _chart.width() - _rightYAxisLabelPadding);
        }
    };

    function prepareRightYAxis() {
        if (_chart.rightY() === undefined || _chart.elasticY()) {
            _chart.rightY(d3.scale.linear());
            _chart.rightY().domain([rightYAxisMin(), rightYAxisMax()]).rangeRound([_chart.yAxisHeight(), 0]);
        }

        _chart.rightY().range([_chart.yAxisHeight(), 0]);
        _chart.rightYAxis(_chart.rightYAxis().scale(_chart.rightY()));

        _chart.rightYAxis().orient('right');
    }

    function prepareLeftYAxis() {
        if (_chart.y() === undefined || _chart.elasticY()) {
            _chart.y(d3.scale.linear());
            _chart.y().domain([yAxisMin(), yAxisMax()]).rangeRound([_chart.yAxisHeight(), 0]);
        }

        _chart.y().range([_chart.yAxisHeight(), 0]);
        _chart.yAxis(_chart.yAxis().scale(_chart.y()));

        _chart.yAxis().orient('left');
    }

    function generateChildG(child, i) {
        child._generateG(_chart.g());
        child.g().attr('class', SUB_CHART_CLASS + ' _' + i);
    }

    _chart.plotData = function () {
        for (var i = 0; i < _children.length; ++i) {
            var child = _children[i];

            if (!child.g()) {
                generateChildG(child, i);
            }

            if (_shareColors) {
                child.colors(_chart.colors());
            }

            child.x(_chart.x());

            child.xAxis(_chart.xAxis());

            if (child.useRightYAxis()) {
                child.y(_chart.rightY());
                child.yAxis(_chart.rightYAxis());
            }
            else {
                child.y(_chart.y());
                child.yAxis(_chart.yAxis());
            }

            child.plotData();

            child._activateRenderlets();
        }
    };

    /**
    #### .useRightAxisGridLines(bool)
    Get or set whether to draw gridlines from the right y axis.  Drawing from the left y axis is the
    default behavior. This option is only respected when subcharts with both left and right y-axes
    are present.
    **/
    _chart.useRightAxisGridLines = function (_) {
        if (!arguments) {
            return _rightAxisGridLines;
        }

        _rightAxisGridLines = _;
        return _chart;
    };

    /**
    #### .childOptions({object})
    Get or set chart-specific options for all child charts. This is equivalent to calling `.options`
    on each child chart.
    **/
    _chart.childOptions = function (_) {
        if (!arguments.length) {
            return _childOptions;
        }
        _childOptions = _;
        _children.forEach(function (child) {
            child.options(_childOptions);
        });
        return _chart;
    };

    _chart.fadeDeselectedArea = function () {
        for (var i = 0; i < _children.length; ++i) {
            var child = _children[i];
            child.brush(_chart.brush());
            child.fadeDeselectedArea();
        }
    };

    /**
    #### .rightYAxisLabel([labelText])
    Set or get the right y axis label.
    **/
    _chart.rightYAxisLabel = function (_, padding) {
        if (!arguments.length) {
            return _rightYAxisLabel;
        }
        _rightYAxisLabel = _;
        _chart.margins().right -= _rightYAxisLabelPadding;
        _rightYAxisLabelPadding = (padding === undefined) ? DEFAULT_RIGHT_Y_AXIS_LABEL_PADDING : padding;
        _chart.margins().right += _rightYAxisLabelPadding;
        return _chart;
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
            .valueAccessor(function (d){return d.value.avg;})
            // most of the normal functions will continue to work in a composed chart
            .renderArea(true)
            .stack(monthlyMoveGroup, function (d){return d.value;})
            .title(function (d){
                var value = d.value.avg?d.value.avg:d.value;
                if(isNaN(value)) value = 0;
                return dateFormat(d.key) + '\n' + numberFormat(value);
            }),
        dc.barChart(moveChart)
            .group(volumeByMonthGroup)
            .centerBar(true)
    ]);
    ```

    **/
    _chart.compose = function (charts) {
        _children = charts;
        _children.forEach(function (child) {
            child.height(_chart.height());
            child.width(_chart.width());
            child.margins(_chart.margins());

            if (_shareTitle) {
                child.title(_chart.title());
            }

            child.options(_childOptions);
        });
        return _chart;
    };

    /**
     #### .children()
     Returns the child charts which are composed into the composite chart.
     **/

    _chart.children = function () {
        return _children;
    };

    /**
    #### .shareColors([boolean])
    Get or set color sharing for the chart. If set, the `.colors()` value from this chart
    will be shared with composed children. Additionally if the child chart implements
    Stackable and has not set a custom .colorAccessor, then it will generate a color
    specific to its order in the composition.
    **/
    _chart.shareColors = function (_) {
        if (!arguments.length) {
            return _shareColors;
        }
        _shareColors = _;
        return _chart;
    };

    /**
    #### .shareTitle([[boolean])
    Get or set title sharing for the chart. If set, the `.title()` value from this chart will be
    shared with composed children. Default value is true.
    **/
    _chart.shareTitle = function (_) {
        if (!arguments.length) {
            return _shareTitle;
        }
        _shareTitle = _;
        return _chart;
    };

    /**
    #### .rightY([yScale])
    Get or set the y scale for the right axis. The right y scale is typically automatically
    generated by the chart implementation.

    **/
    _chart.rightY = function (_) {
        if (!arguments.length) {
            return _rightY;
        }
        _rightY = _;
        return _chart;
    };

    function leftYAxisChildren() {
        return _children.filter(function (child) {
            return !child.useRightYAxis();
        });
    }

    function rightYAxisChildren() {
        return _children.filter(function (child) {
            return child.useRightYAxis();
        });
    }

    function getYAxisMin(charts) {
        return charts.map(function (c) {
            return c.yAxisMin();
        });
    }

    delete _chart.yAxisMin;
    function yAxisMin() {
        return d3.min(getYAxisMin(leftYAxisChildren()));
    }

    function rightYAxisMin() {
        return d3.min(getYAxisMin(rightYAxisChildren()));
    }

    function getYAxisMax(charts) {
        return charts.map(function (c) {
            return c.yAxisMax();
        });
    }

    delete _chart.yAxisMax;
    function yAxisMax() {
        return dc.utils.add(d3.max(getYAxisMax(leftYAxisChildren())), _chart.yAxisPadding());
    }

    function rightYAxisMax() {
        return dc.utils.add(d3.max(getYAxisMax(rightYAxisChildren())), _chart.yAxisPadding());
    }

    function getAllXAxisMinFromChildCharts() {
        return _children.map(function (c) {
            return c.xAxisMin();
        });
    }

    dc.override(_chart, 'xAxisMin', function () {
        return dc.utils.subtract(d3.min(getAllXAxisMinFromChildCharts()), _chart.xAxisPadding());
    });

    function getAllXAxisMaxFromChildCharts() {
        return _children.map(function (c) {
            return c.xAxisMax();
        });
    }

    dc.override(_chart, 'xAxisMax', function () {
        return dc.utils.add(d3.max(getAllXAxisMaxFromChildCharts()), _chart.xAxisPadding());
    });

    _chart.legendables = function () {
        return _children.reduce(function (items, child) {
            if (_shareColors) {
                child.colors(_chart.colors());
            }
            items.push.apply(items, child.legendables());
            return items;
        }, []);
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

    _chart.legendToggle = function () {
        console.log('composite should not be getting legendToggle itself');
    };

    /**
    #### .rightYAxis([yAxis])
    Set or get the right y axis used by the composite chart. This function is most useful when y
    axis customization is required. The y axis in dc.js is an instance of a [d3 axis
    object](https://github.com/mbostock/d3/wiki/SVG-Axes#wiki-_axis) therefore it supports any valid
    d3 axis manipulation. **Caution**: The y axis is usually generated internally by dc;
    resetting it may cause unexpected results.
    ```jså
    // customize y axis tick format
    chart.rightYAxis().tickFormat(function (v) {return v + '%';});
    // customize y axis tick values
    chart.rightYAxis().tickValues([0, 100, 200, 300]);
    ```

    **/
    _chart.rightYAxis = function (rightYAxis) {
        if (!arguments.length) {
            return _rightYAxis;
        }
        _rightYAxis = rightYAxis;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
