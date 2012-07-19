dc.colorChart = function(chart) {
    var _colors = d3.scale.category20c();

    chart.colors = function(c) {
        if (!arguments.length) return _colors;
        _colors = d3.scale.ordinal().range(c);
        return chart;
    };

    return chart;
};
