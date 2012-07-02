dc.base = function(chart){
    var _dimension;

    chart.dimension = function(d) {
        if (!arguments.length) return _dimension;
        _dimension = d;
        return chart;
    };

    return chart;
};