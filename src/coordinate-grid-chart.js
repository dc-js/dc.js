dc.coordinateGridChart = function(chart) {
    chart = dc.baseChart(chart);

    var _margin = {top: 10, right: 50, bottom: 30, left: 20};
    var _x;
    var _axisX = d3.svg.axis();

    chart.margins = function(m) {
        if (!arguments.length) return _margin;
        _margin = m;
        return chart;
    };

    chart.x = function(_) {
        if (!arguments.length) return _x;
        _x = _;
        return chart;
    };

    chart.axisX = function(_) {
        if (!arguments.length) return _axisX;
        _axisX = _;
        return chart;
    };

    chart.renderAxisX = function(g) {
        g.select("g.x").remove();
        chart.x().range([0, (chart.width() - chart.margins().left - chart.margins().right)]);
        _axisX = _axisX.scale(chart.x()).orient("bottom");
        g.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate(" + chart.margins().left + "," + chart.xAxisY() + ")")
            .call(_axisX);
    }

    chart.xAxisY = function() {
        return (chart.height() - chart.margins().bottom);
    }

    return chart;
};
