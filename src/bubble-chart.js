dc.bubbleChart = function(selector) {
    var chart = dc.coordinateGridChart({});

    chart.transitionDuration(500);

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            chart.generateG();

            redrawBubbles();

            chart.renderXAxis(chart.g());
            chart.renderYAxis(chart.g());

            chart.renderBrush(chart.g());
        }

        return chart;
    };

    chart.redraw = function() {
        redrawBubbles();

        chart.redrawBrush(chart.g());

        return chart;
    };

    function redrawBubbles() {

    }

    chart.redrawBrush = function(g) {
        chart._redrawBrush(g);

        fadeDeselectedBubbles();
    }

    function fadeDeselectedBubbles() {
    }

    dc.registerChart(chart);

    return chart.anchor(selector);
};
