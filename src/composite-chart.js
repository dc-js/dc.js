dc.compositeChart = function(selector) {
    var chart = dc.coordinateGridChart({});

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

    }

    chart.redrawBrush = function(g) {
        chart._redrawBrush(g);

        fadeDeselectedArea();
    }

    function fadeDeselectedArea() {
    }

    dc.registerChart(chart);

    return chart.anchor(selector);
};
