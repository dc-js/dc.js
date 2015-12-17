/**
## Paired Row Chart
Includes: [Cap Mixin](#cap-mixin), [Margin Mixin](#margin-mixin), [Color Mixin](#color-mixin), [Base Mixin](#base-mixin)

Concrete paired row chart implementation.
#### dc.pairedRowChart(parent[, chartGroup])
Create a paired row chart instance and attach it to the given parent element.

Parameters:

* parent : string | node | selection - any valid
 [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 a dom block element such as a div; or a dom element or d3 selection.

* chartGroup : string (optional) - name of the chart group this chart instance should be placed in.
 Interaction with a chart will only trigger events and redraws within the chart's group.

Returns:
A newly created paired row chart instance

```js
// create a paired row chart under #chart-container1 element using the default global chart group
var chart1 = dc.pairedRowChart('#chart-container1');
// create a paired row chart under #chart-container2 element using chart group A
var chart2 = dc.pairedRowChart('#chart-container2', 'chartGroupA');
```
**/
dc.pairedRowChart = function (parent, chartGroup) {
    var _chart = dc.capMixin(dc.marginMixin(dc.colorMixin(dc.baseMixin({}))));

    var _leftChartWrapper = d3.select(parent).append('div');
    var _rightChartWrapper = d3.select(parent).append('div');

    var _leftChart = dc.rowChart(_leftChartWrapper[0][0], chartGroup);
    var _rightChart = dc.rowChart(_rightChartWrapper[0][0], chartGroup);

    _leftChart.useRightYAxis(true);

    // data filtering

    // we need a way to know which data belongs on the left chart and which data belongs on the right
    var _leftKeyFilter = function (d) {
        return d.key[0];
    };

    var _rightKeyFilter = function (d) {
        return d.key[0];
    };

    /**
    #### .leftKeyFilter([value]) - **mandatory**
    Set or get the left key filter attribute of a chart.

    For example
    function(d) {
        return d.key[0] === 'Male';
    }

    If a value is given, then it will be used as the new left key filter. If no value is specified then
    the current left key filter will be returned.

    **/
    _chart.leftKeyFilter = function (_) {
        if (!arguments.length) {
            return _leftKeyFilter;
        }

        _leftKeyFilter = _;
        return _chart;
    };

    /**
    #### .rightKeyFilter([value]) - **mandatory**
    Set or get the right key filter attribute of a chart.

    For example
    function(d) {
        return d.key[0] === 'Female';
    }

    If a value is given, then it will be used as the new right key filter. If no value is specified then
    the current right key filter will be returned.

    **/
    _chart.rightKeyFilter = function (_) {
        if (!arguments.length) {
            return _rightKeyFilter;
        }

        _rightKeyFilter = _;
        return _chart;
    };

    // when trying to get the data for the left chart then filter all data using the leftKeyFilter function
    _leftChart.data(function (data) {
        var cap = _leftChart.cap(),
            d = data.all().filter(function (d) {
            return _chart.leftKeyFilter()(d);
        });

        if (cap === Infinity) {
            return d;
        }

        return d.slice(0, cap);
    });

    // when trying to get the data for the right chart then filter all data using the rightKeyFilter function
    _rightChart.data(function (data) {
        var cap = _rightChart.cap(),
            d = data.all().filter(function (d) {
            return _chart.rightKeyFilter()(d);
        });

        if (cap === Infinity) {
            return d;
        }

        return d.slice(0, cap);
    });

    // chart filtering
    // on clicking either chart then filter both

    _leftChart.onClick = _rightChart.onClick = function (d) {
        var filter = _leftChart.keyAccessor()(d);
        dc.events.trigger(function () {
            _leftChart.filter(filter);
            _rightChart.filter(filter);
            _leftChart.redrawGroup();
        });
    };

    // margins
    var leftMargins = _leftChart.margins;
    var rightMargins = _rightChart.margins;

    _leftChart.margins = function () {
        var margins = leftMargins();
        margins.right = 0;
        return margins;
    };

    _rightChart.margins = function () {
        var margins = rightMargins();
        margins.left = 0;
        return margins;
    };

    // svg
    // return an array of both the sub chart svgs

    _chart.svg = function () {
        return d3.selectAll([_leftChart.svg()[0][0], _rightChart.svg()[0][0]]);
    };

    // we need to make sure that the extent is the same for both charts
    _leftChart.calculateAxisScaleData = _rightChart.calculateAxisScaleData = function () {
        return _leftChart.data().concat(_rightChart.data());
    };

    // get the charts - mainly used for testing
    _chart.leftChart = function () {
        return _leftChart;
    };

    _chart.rightChart = function () {
        return _rightChart;
    };

    _chart.leftXAxisLabel = function (labelText, padding) {
        return _leftChart.xAxisLabel(labelText, padding);
    };

    _chart.rightXAxisLabel = function (labelText, padding) {
        return _rightChart.xAxisLabel(labelText, padding);
    };

    // functions that we just want to pass on to both sub charts

    var _getterSetterPassOn = [
        // display
        'height', 'minHeight', 'renderTitleLabel', 'fixedBarHeight', 'gap', 'othersLabel',
        'transitionDuration', 'label', 'renderLabel', 'title', 'renderTitle', 'chartGroup',
        //colors
        'colors', 'ordinalColors', 'linearColors', 'colorAccessor', 'colorDomain', 'getColor', 'colorCalculator',
        // x axis
        'x', 'elasticX', 'valueAccessor', 'labelOffsetX', 'titleLabelOffsetx', 'xAxis',
        // y axis
        'keyAccessor', 'labelOffsetY', 'yAxis',
        // data
        'cap', 'ordering' , 'dimension', 'group', 'othersGrouper', 'data'
    ];

    function addGetterSetterFunction (functionName) {
        _chart[functionName] = function (_) {
            if (!arguments.length) {
                return [_leftChart[functionName](), _rightChart[functionName]()];
            }
            _leftChart[functionName](_);
            _rightChart[functionName](_);
            return _chart;
        };
    }

    for (var i = 0; i < _getterSetterPassOn.length; i++) {
        addGetterSetterFunction(_getterSetterPassOn[i]);
    }

    var _passOnFunctions = [
        '_doRedraw', 'redraw', '_doRender', 'render', 'calculateColorDomain', 'filterAll', 'resetSvg', 'expireCache'
    ];

    function addPassOnFunctions (functionName) {
        _chart[functionName] = function () {
            _leftChart[functionName]();
            _rightChart[functionName]();
            return _chart;
        };
    }

    for (i = 0; i < _passOnFunctions.length; i++) {
        addPassOnFunctions(_passOnFunctions[i]);
    }

    return _chart.anchor(parent, chartGroup);
};
