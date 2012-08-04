dc.compositeChart = function(_parent) {
    var SUB_CHART_CLASS = "sub";

    var _chart = dc.coordinateGridChart({});
    var _children = [];

    _chart.transitionDuration(500);

    dc.override(_chart, "generateG", function(_super) {
        for (var i = 0; i < _children.length; ++i) {
            var child = _children[i];
            if (child.dimension() == null) child.dimension(_chart.dimension());
            if (child.group() == null) child.group(_chart.group());
            child.svg(_chart.svg());
            child.height(_chart.height());
            child.width(_chart.width());
            child.margins(_chart.margins());
            child.yAxisPadding(_chart.yAxisPadding());
            child.xAxisPadding(_chart.xAxisPadding());
            child.xUnits(_chart.xUnits());
            child.transitionDuration(_chart.transitionDuration());
            child.generateG();
            child.g().attr("class", SUB_CHART_CLASS);
        }

        return _super();
    });

    _chart.plotData = function() {
        for (var i = 0; i < _children.length; ++i) {
            var child = _children[i];
            child.x(_chart.x());
            child.y(_chart.y());
            child.xAxis(_chart.xAxis());
            child.yAxis(_chart.yAxis());

            child.plotData();
        }
    };

    _chart.fadeDeselectedArea = function() {
        for (var i = 0; i < _children.length; ++i) {
            var child = _children[i];
            child.brush(_chart.brush());

            child.fadeDeselectedArea();
        }
    };

    _chart.compose = function(charts) {
        _children = charts;
        return _chart;
    };

    function getAllYAxisMinFromChildCharts() {
        var allMins = [];
        for (var i = 0; i < _children.length; ++i) {
            allMins.push(_children[i].yAxisMin());
        }
        return allMins;
    }

    _chart.yAxisMin = function() {
        return d3.min(getAllYAxisMinFromChildCharts());
    };

    function getAllYAxisMaxFromChildCharts() {
        var allMaxes = [];
        for (var i = 0; i < _children.length; ++i) {
            allMaxes.push(_children[i].yAxisMax());
        }
        return allMaxes;
    }

    _chart.yAxisMax = function() {
        return d3.max(getAllYAxisMaxFromChildCharts());
    };

    function getAllXAxisMinFromChildCharts() {
        var allMins = [];
        for (var i = 0; i < _children.length; ++i) {
            allMins.push(_children[i].xAxisMin());
        }
        return allMins;
    }

    _chart.xAxisMin = function() {
        return d3.min(getAllXAxisMinFromChildCharts());
    };

    function getAllXAxisMaxFromChildCharts() {
        var allMaxes = [];
        for (var i = 0; i < _children.length; ++i) {
            allMaxes.push(_children[i].xAxisMax());
        }
        return allMaxes;
    }

    _chart.xAxisMax = function() {
        return d3.max(getAllXAxisMaxFromChildCharts());
    };

    return _chart.anchor(_parent);
};
