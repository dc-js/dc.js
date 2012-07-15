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
        chart.g().datum(chart.group().all());

        var path = chart.selectAll("path.line");

        if(path.empty())
            path = chart.g().append("path")
            .attr("class", "line");

        var line = d3.svg.line()
            .x(function(d) {
                return chart.x()(d.key);
            })
            .y(function(d) {
                return chart.y()(d.value);
            });

        path = path
            .attr("transform", "translate("+chart.margins().left+","+chart.margins().top+")");

        dc.transition(path, chart.transitionDuration(), function(t){t.ease("linear")})
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
