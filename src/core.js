dc = {
    version: "0.1.0",
    __charts__: []
};

dc.registerChart = function(chart) {
    dc.__charts__.push(chart);
};

dc.hasChart = function(chart) {
    return dc.__charts__.indexOf(chart) >= 0;
};

dc.removeAllCharts = function() {
    dc.__charts__ = [];
};

dc.filterAll = function() {
    for (var i = 0; i < dc.__charts__.length; ++i) {
        dc.__charts__[i].filterAll();
    }
};

dc.renderAll = function() {
    for (var i = 0; i < dc.__charts__.length; ++i) {
        dc.__charts__[i].render();
    }
};
