dc.colorChart = function(_chart) {
    var _colors = d3.scale.category20c();

    _chart.colors = function(_) {
        if (!arguments.length) return _colors;

        if(_ instanceof Array)
            _colors = d3.scale.ordinal().range(_);
        else
            _colors = _;

        return _chart;
    };

    return _chart;
};
