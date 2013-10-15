/**
## <a name="stackable-chart" href="#stackable-chart">#</a> Stackable Chart [Abstract]
Stackable chart is an abstract chart introduced to provide cross-chart support of stackability. Concrete implementation of
charts can then selectively mix-in this capability.

**/
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

    /**
    #### .stack(group[, name, accessor])
    Stack a new crossfilter group into this chart with optionally a custom value accessor. All stacks in the same chart will
    share the same key accessor therefore share the same set of keys. In more concrete words, imagine in a stacked bar chart
    all bars will be positioned using the same set of keys on the x axis while stacked vertically. If name is specified then
    it will be used to generate legend label.
    ```js
    // stack group using default accessor
    chart.stack(valueSumGroup)
    // stack group using custom accessor
    .stack(avgByDayGroup, function(d){return d.value.avgByDay;});
    ```

    **/
    _chart.stack = function (group, name, accessor) {
        if(!arguments.length)
            _groupStack.clear();

        _groupStack.setDefaultAccessor(_chart.valueAccessor());

        if (typeof name === 'string') {
            _chart._setGroupName(group, name, accessor);
            _groupStack.addNamedGroup(group, name, accessor);
        }
        else {
            accessor = name;
            _groupStack.addGroup(group, accessor);
        }

        _chart.expireCache();

        return _chart;
    };

    /**
    #### .hideStack(name)
    Hide all stacks on the chart with the given name.
    The chart must be re-rendered for this change to appear.

    **/
    _chart.hideStack = function (stackName) {
        _groupStack.hideGroups(stackName, _chart._getGroupName(_chart.group()) == stackName);
    };

    /**
    #### .showStack(name)
    Show all stacks on the chart with the given name.
    The chart must be re-rendered for this change to appear.

    **/
    _chart.showStack = function (stackName) {
        _groupStack.showGroups(stackName, _chart._getGroupName(_chart.group()) == stackName);
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
            var test;
            if(_chart.isOrdinal()) {
                var domainSet = d3.set(xDomain);
                test = function(p) {
                    return domainSet.has(p.x);
                };
            }
            else {
                test = function(p) {
                    return p.x >= xDomain[0] && p.x <= xDomain[xDomain.length-1];
                };
            }
            _chart.stackLayers().forEach(function (e) {
                e.points.forEach(function (p) {
                    if (test(p))
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
        var min = _chart.allGroups().reduce(function(min,group,groupIndex) {
            var m = dc.utils.groupMin(group, _chart.getKeyAccessorByIndex(groupIndex));
            return (min === null || min > m) ? m : min;
        },null);

        return dc.utils.subtract(min, _chart.xAxisPadding());
    };

    _chart.xAxisMax = function () {
        var max = _chart.allGroups().reduce(function(max,group,groupIndex) {
            var m = dc.utils.groupMax(group, _chart.getKeyAccessorByIndex(groupIndex));
            return (max === null || max < m) ? m : max;
        },null);

        return dc.utils.add(max, _chart.xAxisPadding());
    };

    function calculateDataPointMatrix(group, groupIndex) {
        group.all().forEach(function(d, dataIndex) {
            var key = _chart.getKeyAccessorByIndex(groupIndex)(d);
            var value = _chart.getValueAccessorByIndex(groupIndex)(d);
            _groupStack.setDataPoint(groupIndex, dataIndex, {data: d, x: key, y: value, layer: groupIndex});
        });
    }

    _chart.calculateDataPointMatrixForAll = function () {
        _groupStack.clearDataLayers();
        _chart.allGroups().forEach(calculateDataPointMatrix);
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

    _chart._layerColorAccessor = function(d){return d.layer === undefined ? d.index : d.layer;};
    _chart.colorAccessor(_chart._layerColorAccessor);

    _chart.legendables = function () {
        return _chart.allGroups().map(function (g, i) {
            return dc.utils.createLegendable(_chart, g, _chart.getValueAccessorByIndex(i), _chart.colorCalculator()(i));
        });
    };

    return _chart;
};
