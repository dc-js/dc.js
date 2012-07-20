dc.colorChart = function(chart) {
    var _colors = d3.scale.category20c();

    chart.colors = function(_) {
        if (!arguments.length) return _colors;

        if(_ instanceof Array)
            _colors = d3.scale.ordinal().range(_);
        else
            _colors = _;

        return chart;
    };

    return chart;
};
