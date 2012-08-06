dc = {
    version: "0.7.0",
    constants : {
        STACK_CLASS: "stack",
        DESELECTED_CLASS: "deselected",
        SELECTED_CLASS: "selected",
        GROUP_INDEX_NAME: "__group_index__",
        DEFAULT_CHART_GROUP: "__default_chart_group__"
    }
};

dc.chartRegistry = function() {
    // chartGroup:string => charts:array
    var _chartMap = {};

    this.has = function(chart) {
        for(e in _chartMap){
            if(_chartMap[e].indexOf(chart) >= 0)
                return true;
        }
        return false;
    };

    function initializeChartGroup(group) {
        group = group;

        if (!group)
            group = dc.constants.DEFAULT_CHART_GROUP;

        if (!_chartMap[group])
            _chartMap[group] = [];

        return group;
    }

    this.register = function(chart, group) {
        group = initializeChartGroup(group);
        _chartMap[group].push(chart);
    };

    this.clear = function() {
        _chartMap = {};
    };

    this.list = function(group) {
        group = initializeChartGroup(group);
        return _chartMap[group];
    };

    return this;
}();

dc.registerChart = function(chart, group) {
    dc.chartRegistry.register(chart, group);
};

dc.hasChart = function(chart) {
    return dc.chartRegistry.has(chart);
};

dc.deregisterAllCharts = function() {
    dc.chartRegistry.clear();
};

dc.filterAll = function(group) {
    var charts = dc.chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].filterAll();
    }
};

dc.renderAll = function(group) {
    var charts = dc.chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].render();
    }
};

dc.redrawAll = function(group) {
    var charts = dc.chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].redraw();
    }
};

dc.transition = function(selections, duration, callback) {
    if (duration <= 0)
        return selections;

    var s = selections
        .transition()
        .duration(duration);

    if (callback instanceof Function) {
        callback(s);
    }

    return s;
};

dc.units = {};
dc.units.integers = function(s, e) {
    return new Array(Math.abs(e - s));
};

dc.round = {};
dc.round.floor = function(n) {
    return Math.floor(n);
};
dc.round.ceil = function(n) {
    return Math.ceil(n);
};
dc.round.round = function(n) {
    return Math.round(n);
};

dc.override = function(obj, functionName, newFunction) {
    var existingFunction = obj[functionName];
    obj[functionName] = function() {
        var expression = "newFunction(";

        for (var i = 0; i < arguments.length; ++i)
            expression += "argument[" + i + "],";

        expression += "existingFunction);";

        return eval(expression);
    };
};
