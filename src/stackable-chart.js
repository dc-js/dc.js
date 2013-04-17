dc.stackableChart = function (_chart) {
    var MIN_DATA_POINT_HEIGHT = 0;

    var _groupStack = new dc.utils.GroupStack();
    var _allGroups;
    var _allValueAccessors;
    var _allKeyAccessors;

    _chart.stack = function (group, retriever) {
        _groupStack.setDefaultAccessor(_chart.valueAccessor());
        _groupStack.addGroup(group, retriever);

        _chart.expireCache();

        return _chart;
    };

    _chart.expireCache = function(){
        _allGroups = null;
        _allValueAccessors = null;
        _allKeyAccessors = null;
        return _chart;
    };

    _chart.allGroups = function () {
        if (_allGroups == null) {
            _allGroups = [];

            _allGroups.push(_chart.group());

            for (var i = 0; i < _groupStack.size(); ++i)
                _allGroups.push(_groupStack.getGroupByIndex(i));
        }

        return _allGroups;
    };

    _chart.allValueAccessors = function () {
        if (_allValueAccessors == null) {
            _allValueAccessors = [];

            _allValueAccessors.push(_chart.valueAccessor());

            for (var i = 0; i < _groupStack.size(); ++i)
                _allValueAccessors.push(_groupStack.getAccessorByIndex(i));
        }

        return _allValueAccessors;
    };

    _chart.getValueAccessorByIndex = function (groupIndex) {
        return _chart.allValueAccessors()[groupIndex];
    };

    _chart.yAxisMin = function () {
        var min = 0;
        var allGroups = _chart.allGroups();

        for (var groupIndex = 0; groupIndex < allGroups.length; ++groupIndex) {
            var group = allGroups[groupIndex];
            var m = dc.utils.groupMin(group, _chart.getValueAccessorByIndex(groupIndex));
            if (m < min) min = m;
        }

        if (min < 0) {
            min = 0;
            for (var groupIndex = 0; groupIndex < allGroups.length; ++groupIndex) {
                var group = allGroups[groupIndex];
                min += dc.utils.groupMin(group, _chart.getValueAccessorByIndex(groupIndex));
            }
        }

        min = dc.utils.subtract(min, _chart.yAxisPadding());

        return min;
    };

    _chart.yAxisMax = function () {
        var max = 0;
        var allGroups = _chart.allGroups();

        for (var groupIndex = 0; groupIndex < allGroups.length; ++groupIndex) {
            var group = allGroups[groupIndex];
            max += dc.utils.groupMax(group, _chart.getValueAccessorByIndex(groupIndex));
        }

        max = dc.utils.add(max, _chart.yAxisPadding());

        return max;
    };

    _chart.allKeyAccessors = function () {
        if (_allKeyAccessors == null) {
            _allKeyAccessors = [];

            _allKeyAccessors.push(_chart.keyAccessor());

            for (var i = 0; i < _groupStack.size(); ++i)
                _allKeyAccessors.push(_chart.keyAccessor());
        }

        return _allKeyAccessors;
    };

    _chart.getKeyAccessorByIndex = function (groupIndex) {
        return _chart.allKeyAccessors()[groupIndex];
    };

    _chart.xAxisMin = function () {
        var min = null;
        var allGroups = _chart.allGroups();

        for (var groupIndex = 0; groupIndex < allGroups.length; ++groupIndex) {
            var group = allGroups[groupIndex];
            var m = dc.utils.groupMin(group, _chart.getKeyAccessorByIndex(groupIndex));
            if (min == null || min > m) min = m;
        }

        return dc.utils.subtract(min, _chart.xAxisPadding());
    };

    _chart.xAxisMax = function () {
        var max = null;
        var allGroups = _chart.allGroups();

        for (var groupIndex = 0; groupIndex < allGroups.length; ++groupIndex) {
            var group = allGroups[groupIndex];
            var m = dc.utils.groupMax(group, _chart.getKeyAccessorByIndex(groupIndex));
            if (max == null || max < m) max = m;
        }

        return dc.utils.add(max, _chart.xAxisPadding());
    };

    _chart.baseLineY = function () {
        return _chart.y()(0);
    }

    _chart.dataPointBaseline = function () {
        return _chart.margins().top + _chart.baseLineY();
    };

    function getValueFromData(groupIndex, d) {
        return _chart.getValueAccessorByIndex(groupIndex)(d);
    }

    _chart.dataPointHeight = function (d, groupIndex) {
        var value = getValueFromData(groupIndex, d);
        var yPosition = _chart.y()(value);
        var zeroPosition = _chart.baseLineY();
        var h = 0;

        if (value > 0)
            h = zeroPosition - yPosition;
        else
            h = yPosition - zeroPosition;

        if (isNaN(h) || h < MIN_DATA_POINT_HEIGHT)
            h = MIN_DATA_POINT_HEIGHT;

        return h;
    };

    function calculateDataPointMatrix(data, groupIndex) {
        for (var dataIndex = 0; dataIndex < data.length; ++dataIndex) {
            var d = data[dataIndex];
            var value = getValueFromData(groupIndex, d);
            if (groupIndex == 0) {
                if (value > 0)
                    _groupStack.setDataPoint(groupIndex, dataIndex, _chart.dataPointBaseline() - _chart.dataPointHeight(d, groupIndex));
                else
                    _groupStack.setDataPoint(groupIndex, dataIndex, _chart.dataPointBaseline());
            } else {
                if (value > 0)
                    _groupStack.setDataPoint(groupIndex, dataIndex, _groupStack.getDataPoint(groupIndex - 1, dataIndex) - _chart.dataPointHeight(d, groupIndex))
                else if (value < 0)
                    _groupStack.setDataPoint(groupIndex, dataIndex, _groupStack.getDataPoint(groupIndex - 1, dataIndex) + _chart.dataPointHeight(d, groupIndex - 1))
                else // value == 0
                    _groupStack.setDataPoint(groupIndex, dataIndex, _groupStack.getDataPoint(groupIndex - 1, dataIndex))
            }
        }
    }

    _chart.calculateDataPointMatrixForAll = function (groups) {
        for (var groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
            var group = groups[groupIndex];
            var data = group.all();

            calculateDataPointMatrix(data, groupIndex);
        }
    };

    _chart.calculateDataPointMatrixWithinXDomain = function (groups) {
        for (var groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
            var group = groups[groupIndex];
            var data = _chart.getDataWithinXDomain(group);

            calculateDataPointMatrix(data, groupIndex);
        }
    };

    _chart.getChartStack = function () {
        return _groupStack;
    };

    dc.override(_chart, "valueAccessor", function (_) {
        if (!arguments.length) return _chart._valueAccessor();
        _chart.expireCache();
        return _chart._valueAccessor(_);
    });

    dc.override(_chart, "keyAccessor", function (_) {
        if (!arguments.length) return _chart._keyAccessor();
        _chart.expireCache();
        return _chart._keyAccessor(_);
    });

    return _chart;
};
