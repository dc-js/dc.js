dc.stackableChart = function(_chart){
    var _stack = [];

    _chart.stack = function(_) {
        if (!arguments.length) return _stack;
        _stack = _;
        return _chart;
    };

    return _chart;
};