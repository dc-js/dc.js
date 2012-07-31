dc.stackableChart = function(_chart) {
    var MIN_DATA_POINT_HEIGHT = 0;
    var DATA_POINT_PADDING_BOTTOM = 1;

    var _groupStack = [];
    var _valueRetrieverStack = [];
    var _dataPointMatrix = [];

    _chart.stack = function(_) {
        if (!arguments.length) {
            var stack = [];
            for (var i = 0; i < _groupStack.length; i++) {
                stack.push([_groupStack[i], _valueRetrieverStack[i]]);
            }
            return stack;
        } else {
            for (var i = 0; i < _.length; ++i) {
                if (Array.isArray(_[i])) {
                    _groupStack[i] = _[i][0];
                    _valueRetrieverStack[i] = _[i][1];
                } else {
                    _groupStack[i] = _[i];
                    _valueRetrieverStack[i] = _chart.valueRetriever();
                }
            }
            return _chart;
        }
    };

    _chart.allGroups = function() {
        var allGroups = [];

        allGroups.push(_chart.group());

        for (var i = 0; i < _groupStack.length; ++i)
            allGroups.push(_groupStack[i]);

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
        return _chart.margins().top + _chart.yAxisHeight() - DATA_POINT_PADDING_BOTTOM;
    };

    _chart.dataPointHeight = function(d) {
        var h = (_chart.yAxisHeight() - _chart.y()(_chart.valueRetriever()(d)) - DATA_POINT_PADDING_BOTTOM);
        if (isNaN(h) || h < MIN_DATA_POINT_HEIGHT)
            h = MIN_DATA_POINT_HEIGHT;
        return h;
    };

    _chart.calculateDataPointMatrix = function(groups) {
        for (var groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
            var data = groups[groupIndex].all();
            _dataPointMatrix[groupIndex] = [];
            for (var dataIndex = 0; dataIndex < data.length; ++dataIndex) {
                var d = data[dataIndex];
                if (groupIndex == 0)
                    _dataPointMatrix[groupIndex][dataIndex] = _chart.dataPointBaseline() - _chart.dataPointHeight(d);
                else
                    _dataPointMatrix[groupIndex][dataIndex] = _dataPointMatrix[groupIndex - 1][dataIndex] - _chart.dataPointHeight(d);
            }
        }
    };

    _chart.dataPointMatrix = function(_) {
        if (!arguments.length) return _dataPointMatrix;
        _dataPointMatrix = _;
        return _chart;
    };

    return _chart;
};