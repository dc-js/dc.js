/**
## <a name="series-chart" href="#Series-chart">#</a> Series Chart [Concrete]
**/
dc.seriesChart = function (parent, chartGroup) {
    var _chart = dc.compositeChart(parent, chartGroup);

    var _charts = {};
    var _chartFunction = dc.lineChart;
    var _seriesAccessor;
    var _seriesSort = d3.ascending;
    var _valueSort = sort_key_pair;

    _chart._mandatoryAttributes().push('seriesAccessor','chart');
    _chart.shareColors(true);

    function sort_key_pair(a,b) {
        var ret = d3.ascending(a.key[0], b.key[0]) || d3.ascending(a.key[1], b.key[1]);
        return ret;
    }


    dc.override(_chart, "_preprocessData", function () {
        var keep = [];
        var children_changed;
        var nester = d3.nest().key(_seriesAccessor);
        if(_seriesSort)
            nester.sortKeys(_seriesSort);
        if(_valueSort)
            nester.sortValues(_valueSort);
        var nesting = nester.entries(_chart.data());
        var children =
            nesting.map(function(sub,i) {
                var subChart = _charts[sub.key] || _chartFunction(_chart);
                if(!_charts[sub.key])
                    children_changed = true;
                _charts[sub.key] = subChart;
                keep.push(sub.key);
                return subChart
                    .dimension(_chart.dimension())
                    .group({all:d3.functor(sub.values)}, sub.key)
                    .keyAccessor(_chart.keyAccessor())
                    .valueAccessor(_chart.valueAccessor())
                    .colorCalculator(function() {return subChart.colors()(sub.key);});
            });
        // this works around the fact compositeChart doesn't really
        // have a removal interface
        Object.keys(_charts)
            .filter(function(c) {return keep.indexOf(c) === -1;})
            .forEach(function(c) {
                if(_charts[c].g()) {
                    _charts[c].g().remove();
                    delete _charts[c];
                    children_changed = true;
                }
            });
        _chart._compose(children);
        if(children_changed && _chart.legend())
            _chart.legend().render();
        _chart.__preprocessData();
    });

    function clearChart(c) {
        return _charts[c].resetSvg();
    }

    function resetChildren() {
        Object.keys(_charts).map(clearChart);
        _charts = {};
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

    _chart.seriesSort = function(_) {
        if (!arguments.length) return _seriesSort;
        _seriesSort = _;
        resetChildren();
        return _chart;
    };

    _chart.valueSort = function(_) {
        if (!arguments.length) return _valueSort;
        _valueSort = _;
        resetChildren();
        return _chart;
    };

    // make compose private
    _chart._compose = _chart.compose;
    delete _chart.compose;

    return _chart;
};
