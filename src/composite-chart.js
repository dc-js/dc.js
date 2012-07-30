dc.compositeChart = function(selector) {
    var SUB_CHART_G_CLASS = "sub";

    var _chart = dc.coordinateGridChart({});
    var children = [];

    _chart.transitionDuration(500);

    dc.override(_chart, "generateG", function(_super) {
        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            if (child.dimension() == null) child.dimension(_chart.dimension());
            if (child.group() == null) child.group(_chart.group());
            child.svg(_chart.svg());
            child.height(_chart.height());
            child.width(_chart.width());
            child.margins(_chart.margins());
            child.xUnits(_chart.xUnits());
            child.transitionDuration(_chart.transitionDuration());
            child.generateG();
            child.g().attr("class", "sub");
        }

        return _super();
    });

    _chart.plotData = function() {
        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            child.x(_chart.x());
            child.y(_chart.y());
            child.xAxis(_chart.xAxis());
            child.yAxis(_chart.yAxis());

            child.plotData();
        }
    };

    _chart.fadeDeselectedArea = function() {
        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            child.brush(_chart.brush());

            child.fadeDeselectedArea();
        }
    };

    _chart.compose = function(charts) {
        children = charts;
        return _chart;
    };

    _chart.yAxisMin = function() {
        var min = 0;
        var allGroups = combineAllGroups();

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
        var allGroups = combineAllGroups();

        for (var i = 0; i < allGroups.length; ++i) {
            var group = allGroups[i];
            var m = d3.max(group.all(), function(e) {
                return _chart.valueRetriever()(e);
            });
            if(m > max) max = m;
        }

        return max;
    };

    function combineAllGroups() {
        var allGroups = [];

        allGroups.push(_chart.group());

        for (var i = 0; i < children.length; ++i)
            allGroups.push(children[i].group());

        return allGroups;
    }

    return _chart.anchor(selector);
};
