dc.stackableChart = function(_chart) {
    var MIN_BAR_HEIGHT = 0;
    var BAR_PADDING_BOTTOM = 1;

    var _stack = [];

    _chart.stack = function(_) {
        if (!arguments.length) return _stack;
        _stack = _;
        return _chart;
    };

    _chart.allGroups = function() {
        var allGroups = [];

        allGroups.push(_chart.group());

        for (var i = 0; i < _chart.stack().length; ++i)
            allGroups.push(_chart.stack()[i]);

        return allGroups;
    };

    _chart.yAxisMin = function() {
        var min = 0;
        var allGroups = _chart.allGroups();

        for (var i = 0; i < allGroups.length; ++i) {
            var group = allGroups[i];
            var m = d3.min(group.all(), function(e) {
                return _chart.valueRetriever()(e);
            });
            if (m < min) min = m;
        }

        return min;
    };

    _chart.yAxisMax = function() {
        var max = 0;
        var allGroups = _chart.allGroups();

        for (var i = 0; i < allGroups.length; ++i) {
            var group = allGroups[i];
            max += d3.max(group.all(), function(e) {
                return _chart.valueRetriever()(e);
            });
        }

        return max;
    };

    _chart.dataPointBaseline = function() {
        return _chart.margins().top + _chart.yAxisHeight() - BAR_PADDING_BOTTOM;
    };

    _chart.dataPointHeight = function(d) {
        var h = (_chart.yAxisHeight() - _chart.y()(_chart.valueRetriever()(d)) - BAR_PADDING_BOTTOM);
        if (isNaN(h) || h < MIN_BAR_HEIGHT)
            h = MIN_BAR_HEIGHT;
        return h;
    };

    return _chart;
};