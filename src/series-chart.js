/**
## <a name="series-chart" href="#Series-chart">#</a> Series Chart [Concrete]
**/
dc.seriesChart = function (parent, chartGroup) {
    var _chart = dc.compositeChart(parent, chartGroup);

    var _charts = {};
    var _chartFunction = dc.lineChart;
    var _seriesAccessor;

    _chart._mandatoryAttributes().push('seriesAccessor','chart');
    _chart.shareColors(true);

    dc.override(_chart, "plotData", function () {
        dc.deregisterAllCharts(_chart.anchorName());
        var keep = [];
        var children = d3.nest().key(_seriesAccessor).entries(_chart.data())
            .map(function(sub,i) {
                var subChart = _charts[sub.key] || _chartFunction(_chart,_chart.anchorName());
                _charts[sub.key] = subChart;
                keep.push(sub.key);
                return subChart
                    .group({all:d3.functor(sub.values)}, sub.key)
                    .keyAccessor(_chart.keyAccessor())
                    .valueAccessor(_chart.valueAccessor())
                    .colorCalculator(function() {return subChart.colors()(sub.key);});
            });
        Object.keys(_charts)
            .filter(function(c) {return keep.indexOf(c) === -1;})
            .map(function(c) {return _charts[c].resetSvg();});
        _chart._compose(children);
        _chart._plotData();
    });

    function clearChart(c) {
        return _charts[c].resetSvg();
    }

    function resetChildren() {
        Object.keys(_charts).map(clearChart);
        _charts = [];
    }

    _chart.chart = function(_) {
        if (!arguments.length) return _chartFunction;
        _chartFunction = _;
        resetChildren();
        return _chart;
    };

    _chart.seriesAccessor = function(_) {
        if (!arguments.length) return _seriesAccessor;
        _seriesAccessor = _;
        resetChildren();
        return _chart;
    };

    // make compose private
    _chart._compose = _chart.compose;
    delete _chart.compose;

    return _chart;
};
