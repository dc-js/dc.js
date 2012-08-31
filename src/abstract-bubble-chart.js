dc.abstractBubbleChart = function(_chart) {
    _chart.BUBBLE_NODE_CLASS = "node";
    _chart.BUBBLE_CLASS = "bubble";
    _chart.MIN_RADIUS = 10;

    _chart = dc.singleSelectionChart(dc.colorChart(_chart));

    var _r = d3.scale.linear().domain([0, 100]);

    var _rValueAccessor = function(d) {
        return d.r;
    };

    _chart.r = function(_) {
        if (!arguments.length) return _r;
        _r = _;
        return _chart;
    };

    _chart.radiusValueAccessor = function(_) {
        if (!arguments.length) return _rValueAccessor;
        _rValueAccessor = _;
        return _chart;
    };

    return _chart;
};
