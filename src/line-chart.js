dc.lineChart = function(selector) {
    var chart = dc.coordinateGridChart({});

    chart.transitionDuration(500);

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            chart.generateG();

            redrawLine();

            chart.renderXAxis(chart.g());
            chart.renderYAxis(chart.g());

            chart.renderBrush(chart.g());
        }

        return chart;
    };

    chart.redraw = function() {
        redrawLine();
        chart.redrawBrush(chart.g());
        if (chart.yElasticity())
            chart.renderYAxis(chart.g());
        return chart;
    };

    function redrawLine() {
        chart.g().datum(chart.group().all());

        var path = chart.selectAll("path.line");

        if (path.empty())
            path = chart.g().append("path")
                .attr("class", "line");

        var line = d3.svg.line()
            .x(function(d) {
                return chart.x()(chart.keyFunction()(d));
            })
            .y(function(d) {
                return chart.y()(chart.valueFunction()(d));
            });

        path = path
            .attr("transform", "translate(" + chart.margins().left + "," + chart.margins().top + ")");

        dc.transition(path, chart.transitionDuration(), function(t) {
            t.ease("linear")
        })
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
