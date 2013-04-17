dc.marginable = function (_chart) {
    var _margin = {top: 10, right: 50, bottom: 30, left: 30};

    _chart.margins = function (m) {
        if (!arguments.length) return _margin;
        _margin = m;
        return _chart;
    };

    _chart.effectiveWidth = function () {
        return _chart.width() - _chart.margins().left - _chart.margins().right;
    };

    _chart.effectiveHeight = function () {
        return _chart.height() - _chart.margins().top - _chart.margins().bottom;
    };

    return _chart;
};