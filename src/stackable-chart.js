dc.stackableChart = function (_chart) {
    var _groupStack = new dc.utils.GroupStack();
    var _stackLayout = d3.layout.stack()
        .offset("zero")
        .order("default")
        .values(function (d) {
            return d.points;
        });
    var _allGroups;
    var _allValueAccessors;
    var _allKeyAccessors;
    var _stackLayers;

    _chart.stack = function (group, p2, retriever) {
        if (typeof p2 === 'string')
            _chart.setGroupName(group, p2, retriever);
        else if (typeof p2 === 'function')
            retriever = p2;

        _groupStack.setDefaultAccessor(_chart.valueAccessor());
        _groupStack.addGroup(group, retriever);

        _chart.expireCache();

        return _chart;
    };

    _chart.expireCache = function () {
        _allGroups = null;
        _allValueAccessors = null;
        _allKeyAccessors = null;
        _stackLayers = null;
        return _chart;
    };

    _chart.allGroups = function () {
        if (_allGroups === null) {
            _allGroups = [];

            _allGroups.push(_chart.group());

            for (var i = 0; i < _groupStack.size(); ++i)
                _allGroups.push(_groupStack.getGroupByIndex(i));
        }

        return _allGroups;
    };

    _chart.allValueAccessors = function () {
        if (_allValueAccessors === null) {
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
        var min, all = flattenStack();

        min = d3.min(all, function (p) {
            return  (p.y + p.y0 < p.y0) ? (p.y + p.y0) : p.y0;
        });

        min = dc.utils.subtract(min, _chart.yAxisPadding());

        return min;
    };

    _chart.yAxisMax = function () {
        var max, all = flattenStack();

        max = d3.max(all, function (p) {
            return p.y + p.y0;
        });

        max = dc.utils.add(max, _chart.yAxisPadding());

        return max;
    };

    function flattenStack() {
        var all = [];

        if (_chart.x()) {
            var xDomain = _chart.x().domain();

            _chart.stackLayers().forEach(function (e) {
                e.points.forEach(function (p) {
                    if (p.x >= xDomain[0] && p.x <= xDomain[1])
                        all.push(p);
                });
            });
        } else {
            _chart.stackLayers().forEach(function (e) {
                all = all.concat(e.points);
            });
        }

        return all;
    }

    _chart.allKeyAccessors = function () {
        if (_allKeyAccessors === null) {
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
            if (min === null || min > m) min = m;
        }

        return dc.utils.subtract(min, _chart.xAxisPadding());
    };

    _chart.xAxisMax = function () {
        var max = null;
        var allGroups = _chart.allGroups();

        for (var groupIndex = 0; groupIndex < allGroups.length; ++groupIndex) {
            var group = allGroups[groupIndex];
            var m = dc.utils.groupMax(group, _chart.getKeyAccessorByIndex(groupIndex));
            if (max === null || max < m) max = m;
        }

        return dc.utils.add(max, _chart.xAxisPadding());
    };

    function getKeyFromData(groupIndex, d) {
        return _chart.getKeyAccessorByIndex(groupIndex)(d);
    }

    function getValueFromData(groupIndex, d) {
        return _chart.getValueAccessorByIndex(groupIndex)(d);
    }

    function calculateDataPointMatrix(data, groupIndex) {
        for (var dataIndex = 0; dataIndex < data.length; ++dataIndex) {
            var d = data[dataIndex];
            var key = getKeyFromData(groupIndex, d);
            var value = getValueFromData(groupIndex, d);

            _groupStack.setDataPoint(groupIndex, dataIndex, {data: d, x: key, y: value});
        }
    }

    _chart.calculateDataPointMatrixForAll = function () {
        var groups = _chart.allGroups();
        for (var groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
            var group = groups[groupIndex];
            var data = group.all();

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

    _chart.stackLayout = function (stack) {
        if (!arguments.length) return _stackLayout;
        _stackLayout = stack;
        return _chart;
    };

    _chart.stackLayers = function (_) {
        if (!arguments.length) {
            if (_stackLayers === null) {
                _chart.calculateDataPointMatrixForAll();
                _stackLayers = _chart.stackLayout()(_groupStack.toLayers());
            }
            return _stackLayers;
        } else {
            _stackLayers = _;
        }
    };

    _chart.legendables = function () {
        var items = [];
        _allGroups.forEach(function (g, i) {
            items.push(dc.utils.createLegendable(_chart, g, i, _chart.getValueAccessorByIndex(i)));
        });
        return items;
    };

    return _chart;
};
