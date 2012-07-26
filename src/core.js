dc = {
    version: "0.6.0",
    _charts: []
};

dc.registerChart = function(chart) {
    dc._charts.push(chart);
};

dc.hasChart = function(chart) {
    return dc._charts.indexOf(chart) >= 0;
};

dc.deregisterAllCharts = function() {
    dc._charts = [];
};

dc.filterAll = function() {
    for (var i = 0; i < dc._charts.length; ++i) {
        dc._charts[i].filterAll();
    }
};

dc.renderAll = function() {
    for (var i = 0; i < dc._charts.length; ++i) {
        dc._charts[i].render();
    }
};

dc.redrawAll = function() {
    for (var i = 0; i < dc._charts.length; ++i) {
        dc._charts[i].redraw();
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

dc.override = function(obj, functionName, newFunction) {
    var existingFunction = obj[functionName];
    newFunction._ = existingFunction;
    obj[functionName] = function(){return newFunction(existingFunction);};
}
