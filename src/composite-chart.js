dc.compositeChart = function(selector) {
    var SUB_CHART_G_CLASS = "sub";

    var chart = dc.coordinateGridChart({});
    var children = [];

    chart.transitionDuration(500);

    dc.override(chart, "generateG", function(_super){
        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            if (child.dimension() == null) child.dimension(chart.dimension());
            if (child.group() == null) child.group(chart.group());
            child.svg(chart.svg());
            child.height(chart.height());
            child.width(chart.width());
            child.margins(chart.margins());
            child.xUnits(chart.xUnits());
            child.transitionDuration(chart.transitionDuration());
            child.generateG();
            child.g().attr("class", "sub");
        }

        return _super();
    });

    chart.plotData = function() {
        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            child.x(chart.x());
            child.y(chart.y());
            child.xAxis(chart.xAxis());
            child.yAxis(chart.yAxis());

            child.plotData();
        }
    };

    chart.compose = function(charts) {
        children = charts;
        return chart;
    };

    return chart.anchor(selector);
};
