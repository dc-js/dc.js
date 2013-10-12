/**
## <a name="series-chart" href="#Series-chart">#</a> Series Chart [Concrete]
**/
dc.seriesChart = function (parent, chartGroup) {
    var _chart = dc.compositeChart(parent, chartGroup);

    var _chartFunction = dc.lineChart;
    var _seriesAccessor;

    _chart._mandatoryAttributes().push('seriesAccessor','chart');
    _chart.shareColors(true);

    dc.override(_chart, "plotData", function () {
        dc.deregisterAllCharts(_chart.anchorName());
        var children = d3.nest().key(_seriesAccessor).entries(_chart.data())
            .map(function(sub,i) {
                return _chartFunction(_chart,_chart.anchorName())
                    .group({all:d3.functor(sub.values)}, sub.key)
                    .keyAccessor(_chart.keyAccessor())
                    .valueAccessor(_chart.valueAccessor())
                    .colorAccessor(function() {return i;});
        });
        _chart._compose(children);
        _chart._plotData();
    });

    _chart.chart = function(_) {
        if (!arguments.length) return _chartFunction;
        _chartFunction = _;
        return _chart;
    };

    _chart.seriesAccessor = function(_) {
        if (!arguments.length) return _seriesAccessor;
        _seriesAccessor = _;
        return _chart;
    };

    // make compose private
    _chart._compose = _chart.compose;
    //delete _chart.compose;

    return _chart;
};
