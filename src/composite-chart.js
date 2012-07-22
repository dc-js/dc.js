dc.compositeChart = function(selector) {
    var chart = dc.coordinateGridChart({});
    var children;

    chart.transitionDuration(500);

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            chart.generateG();

            chart.renderXAxis(chart.g());
            chart.renderYAxis(chart.g());

            redrawChildCharts();

            chart.renderBrush(chart.g());
        }

        return chart;
    };

    chart.redraw = function() {
        redrawChildCharts();
        chart.redrawBrush(chart.g());
        if (chart.elasticY())
            chart.renderYAxis(chart.g());
        return chart;
    };

    function redrawChildCharts() {
        for(var i = 0; i < children.length;++i){
            var child = children[i];
        }
    }

    chart.compose = function(charts){
        children = charts;
        for(var i = 0; i < children.length;++i){
            var child = children[i];
            if(child.dimension()==null) child.dimension(chart.dimension());
            if(child.group()==null) child.group(chart.group());
        }
        return chart;
    };

    dc.registerChart(chart);

    return chart.anchor(selector);
};
