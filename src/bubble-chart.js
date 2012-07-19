dc.bubbleChart = function(selector) {
    var chart = dc.coordinateGridChart({});

    chart.transitionDuration(500);

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            chart.generateG();

            chart.renderXAxis(chart.g());
            chart.renderYAxis(chart.g());

            redrawBubbles();

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
        var bubbles = chart.g().selectAll("circle.bubble")
            .data(chart.group().all());

        // enter
        bubbles.enter()
            .append("circle")
            .attr("class", "bubble")
            .attr("cx", function(d){return bubbleX(d);})
            .attr("cy", function(d){return bubbleY(d);})
            .attr("r", 10);
    }

    function bubbleX(d) {
        return chart.x()(chart.xValue()(d)) + chart.margins().left;
    }

    function bubbleY(d) {
        return chart.margins().top + chart.y()(chart.yValue()(d));
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
