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

    function sort_key_pair(a,b) {
        var ret = d3.ascending(a.key[0], b.key[0]) || d3.ascending(a.key[1], b.key[1]);
        return ret;
    }

    dc.override(_chart, "doRender", function () {
        dc.deregisterAllCharts(_chart.anchorName());
        var keep = [];
        var nesting = d3.nest().key(_seriesAccessor)
                .sortKeys(d3.ascending).sortValues(sort_key_pair)
                .entries(_chart.data());
        var children =
            nesting.map(function(sub,i) {
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
        _chart._doRender();
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
