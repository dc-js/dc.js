dc.lineChart = function(selector) {
    var chart = dc.coordinateGridChart({});

    chart.transitionDuration(500);

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            chart.generateG();
            chart.renderAxisX(chart.g());
            chart.renderAxisY(chart.g());

            redrawLine();

            chart.renderBrush(chart.g());
        }

        return chart;
    };

    chart.redraw = function() {
        redrawLine();
        chart.redrawBrush(chart.g());
        if (chart.elasticAxisY())
            chart.renderAxisY(chart.g());
        return chart;
    };

    function redrawLine() {
        chart.selectAll("path.line").remove();

        var all = chart.group().all();
        chart.g().datum(all);

        var line = d3.svg.line()
            .x(function(d) {
                return chart.x()(d.key);
            })
            .y(function(d) {
                return chart.y()(d.value);
            });

        chart.g().append("path")
            .attr("class", "line")
            .attr("transform", "translate("+chart.margins().left+","+chart.margins().top+")")
            .attr("d", line);
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
