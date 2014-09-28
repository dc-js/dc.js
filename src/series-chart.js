/**
 ## Series Chart

 Includes: [Composite Chart](#composite chart)

 A series chart is a chart that shows multiple series of data overlaid on one chart, where the
 series is specified in the data. It is a specialization of Composite Chart and inherits all
 composite features other than recomposing the chart.

 #### dc.seriesChart(parent[, chartGroup])
 Create a series chart instance and attach it to the given parent element.

 Parameters:
* parent : string | node | selection - any valid
 [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 a dom block element such as a div; or a dom element or d3 selection.

* chartGroup : string (optional) - name of the chart group this chart instance should be placed in.
 Interaction with a chart will only trigger events and redraws within the chart's group.

 Returns:
 A newly created series chart instance

 ```js
 // create a series chart under #chart-container1 element using the default global chart group
 var seriesChart1 = dc.seriesChart("#chart-container1");
 // create a series chart under #chart-container2 element using chart group A
 var seriesChart2 = dc.seriesChart("#chart-container2", "chartGroupA");
 ```

 **/
dc.seriesChart = function (parent, chartGroup) {
    var _chart = dc.compositeChart(parent, chartGroup);

    function keySort(a, b) {
        return d3.ascending(_chart.keyAccessor()(a), _chart.keyAccessor()(b));
    }

    var _charts = {};
    var _chartFunction = dc.lineChart;
    var _seriesAccessor;
    var _seriesSort = d3.ascending;
    var _valueSort = keySort;

    _chart._mandatoryAttributes().push('seriesAccessor', 'chart');
    _chart.shareColors(true);

    _chart._preprocessData = function () {
        var keep = [];
        var childrenChanged;
        var nester = d3.nest().key(_seriesAccessor);
        if (_seriesSort) {
            nester.sortKeys(_seriesSort);
        }
        if (_valueSort) {
            nester.sortValues(_valueSort);
        }
        var nesting = nester.entries(_chart.data());
        var children =
            nesting.map(function (sub, i) {
                var subChart = _charts[sub.key] || _chartFunction.call(_chart, _chart, chartGroup, sub.key, i);
                if (!_charts[sub.key]) {
                    childrenChanged = true;
                }
                _charts[sub.key] = subChart;
                keep.push(sub.key);
                return subChart
                    .dimension(_chart.dimension())
                    .group({all:d3.functor(sub.values)}, sub.key)
                    .keyAccessor(_chart.keyAccessor())
                    .valueAccessor(_chart.valueAccessor())
                    .brushOn(_chart.brushOn());
            });
        // this works around the fact compositeChart doesn't really
        // have a removal interface
        Object.keys(_charts)
            .filter(function (c) {return keep.indexOf(c) === -1;})
            .forEach(function (c) {
                clearChart(c);
                childrenChanged = true;
            });
        _chart._compose(children);
        if (childrenChanged && _chart.legend()) {
            _chart.legend().render();
        }
    };

    function clearChart(c) {
        if (_charts[c].g()) {
            _charts[c].g().remove();
        }
        delete _charts[c];
    }

    function resetChildren() {
        Object.keys(_charts).map(clearChart);
        _charts = {};
    }

    /**
     #### .chart([function])
     Get or set the chart function, which generates the child charts.  Default: dc.lineChart

     ```
     // put interpolation on the line charts used for the series
     chart.chart(function(c) { return dc.lineChart(c).interpolate('basis'); })
     // do a scatter series chart
     chart.chart(dc.scatterPlot)
     ```

     **/
    _chart.chart = function (_) {
        if (!arguments.length) {
            return _chartFunction;
        }
        _chartFunction = _;
        resetChildren();
        return _chart;
    };

    /**
     #### .seriesAccessor([accessor])
     Get or set accessor function for the displayed series. Given a datum, this function
     should return the series that datum belongs to.
     **/
    _chart.seriesAccessor = function (_) {
        if (!arguments.length) {
            return _seriesAccessor;
        }
        _seriesAccessor = _;
        resetChildren();
        return _chart;
    };

    /**
     #### .seriesSort([sortFunction])
     Get or set a function to sort the list of series by, given series values.

     Example:
     ```
     chart.seriesSort(d3.descending);
     ```
     **/
    _chart.seriesSort = function (_) {
        if (!arguments.length) {
            return _seriesSort;
        }
        _seriesSort = _;
        resetChildren();
        return _chart;
    };

    /**
     #### .valueSort([sortFunction])
     Get or set a function to sort each series values by. By default this is the key accessor which,
     for example, will ensure a lineChart series connects its points in increasing key/x order,
     rather than haphazardly.
    **/
    _chart.valueSort = function (_) {
        if (!arguments.length) {
            return _valueSort;
        }
        _valueSort = _;
        resetChildren();
        return _chart;
    };

    // make compose private
    _chart._compose = _chart.compose;
    delete _chart.compose;

    return _chart;
};
