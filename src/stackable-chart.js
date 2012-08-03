dc.stackableChart = function(_chart) {
    var MIN_DATA_POINT_HEIGHT = 0;
    var DATA_POINT_PADDING_BOTTOM = 1;

    var _groupStack = new dc.utils.GroupStack();

    _chart.stack = function(group, retriever) {
        _groupStack.setDefaultRetriever(_chart.valueRetriever());
        _groupStack.addGroup(group, retriever);
        return _chart;
    };

    _chart.allGroups = function() {
        var allGroups = [];

        allGroups.push(_chart.group());

        for (var i = 0; i < _groupStack.size(); ++i)
            allGroups.push(_groupStack.getGroupByIndex(i));

        return allGroups;
    };

    _chart.allValueRetrievers = function() {
        var allRetrievers = [];

        allRetrievers.push(_chart.valueRetriever());

        for (var i = 0; i < _groupStack.size(); ++i)
            allRetrievers.push(_groupStack.getRetrieverByIndex(i));

        return allRetrievers;
    };

    _chart.getValueRetrieverByIndex = function(groupIndex) {
        return _chart.allValueRetrievers()[groupIndex];
    };

    _chart.yAxisMin = function() {
        var min = 0;
        var allGroups = _chart.allGroups();

        for (var groupIndex = 0; groupIndex < allGroups.length; ++groupIndex) {
            var group = allGroups[groupIndex];
            var m = d3.min(group.all(), function(e) {
                return _chart.getValueRetrieverByIndex(groupIndex)(e);
            });
            if (m < min) min = m;
        }

        return min;
    };

    _chart.yAxisMax = function() {
        var max = 0;
        var allGroups = _chart.allGroups();

        for (var groupIndex = 0; groupIndex < allGroups.length; ++groupIndex) {
            var group = allGroups[groupIndex];
            max += d3.max(group.all(), function(e) {
                return _chart.getValueRetrieverByIndex(groupIndex)(e);
            });
        }

        return dc.utils.add(max, _chart.yAxisPadding());
    };

    _chart.allKeyRetrievers = function() {
        var allRetrievers = [];

        allRetrievers.push(_chart.keyRetriever());

        for (var i = 0; i < _groupStack.size(); ++i)
            allRetrievers.push(_chart.keyRetriever());

        return allRetrievers;
    };

    _chart.getKeyRetrieverByIndex = function(groupIndex) {
        return _chart.allKeyRetrievers()[groupIndex];
    };

    _chart.xAxisMin = function() {
        var min = null;
        var allGroups = _chart.allGroups();

        for (var groupIndex = 0; groupIndex < allGroups.length; ++groupIndex) {
            var group = allGroups[groupIndex];
            var m = d3.min(group.all(), function(e) {
                return _chart.getKeyRetrieverByIndex(groupIndex)(e);
            });
            if (min == null || min > m) min = m;
        }

        return dc.utils.subtract(min, _chart.xAxisPadding());
    };

    _chart.xAxisMax = function() {
        var max = null;
        var allGroups = _chart.allGroups();

        for (var groupIndex = 0; groupIndex < allGroups.length; ++groupIndex) {
            var group = allGroups[groupIndex];
            var m = d3.max(group.all(), function(e) {
                return _chart.getKeyRetrieverByIndex(groupIndex)(e);
            });
            if(max == null || max < m) max = m;
        }

        return dc.utils.add(max, _chart.xAxisPadding());
    };

    _chart.dataPointBaseline = function() {
        return _chart.margins().top + _chart.yAxisHeight() - DATA_POINT_PADDING_BOTTOM;
    };

    _chart.dataPointHeight = function(d, groupIndex) {
        var h = (_chart.yAxisHeight() - _chart.y()(_chart.getValueRetrieverByIndex(groupIndex)(d)) - DATA_POINT_PADDING_BOTTOM);
        if (isNaN(h) || h < MIN_DATA_POINT_HEIGHT)
            h = MIN_DATA_POINT_HEIGHT;
        return h;
    };

    _chart.calculateDataPointMatrix = function(groups) {
        for (var groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
            var data = groups[groupIndex].all();
            for (var dataIndex = 0; dataIndex < data.length; ++dataIndex) {
                var d = data[dataIndex];
                if (groupIndex == 0)
                    _groupStack.setDataPoint(groupIndex, dataIndex, _chart.dataPointBaseline() - _chart.dataPointHeight(d, groupIndex));
                else
                    _groupStack.setDataPoint(groupIndex, dataIndex, _groupStack.getDataPoint(groupIndex - 1, dataIndex) - _chart.dataPointHeight(d, groupIndex))
            }
        }
    };

    _chart.getChartStack = function() {
        return _groupStack;
    };

    return _chart;
};
