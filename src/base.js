dc.baseMixin = function(chart){
    var _dimension;
    var _group;

    chart.dimension = function(d) {
        if (!arguments.length) return _dimension;
        _dimension = d;
        return chart;
    };

    chart.group = function(g) {
        if (!arguments.length) return _group;
        _group = g;
        return chart;
    };

    chart.dataAreSet = function() {
        return _dimension != undefined && _group != undefined;
    };

    return chart;
};