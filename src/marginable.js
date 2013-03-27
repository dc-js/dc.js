dc.marginable = function (_chart) {
    var _margin = {top: 10, right: 50, bottom: 30, left: 30};

    _chart.margins = function (m) {
        if (!arguments.length) return _margin;
        _margin = m;
        return _chart;
    };

    return _chart;
};