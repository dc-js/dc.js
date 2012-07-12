dc.coordinateGridChart = function(chart) {
    var DEFAULT_Y_AXIS_TICKS = 5;

    chart = dc.baseChart(chart);

    var _margin = {top: 10, right: 50, bottom: 30, left: 20};

    var _x;
    var _axisX = d3.svg.axis();
    var _xUnits = dc.units.integers;

    var _y = d3.scale.linear().range([100, 0]);
    var _axisY = d3.svg.axis();
    var _elasticAxisY = false;

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
    };

    chart.xAxisY = function() {
        return (chart.height() - chart.margins().bottom);
    };

    chart.axisXLength = function() {
        return chart.width() - chart.margins().left - chart.margins().right;
    };

    chart.xUnits = function(_) {
        if (!arguments.length) return _xUnits;
        _xUnits = _;
        return chart;
    };

    chart.renderAxisY = function(g) {
        g.select("g.y").remove();
        _y.domain([0, chart.maxY()]).rangeRound([chart.yAxisHeight(), 0]);
        _axisY = _axisY.scale(_y).orient("left").ticks(DEFAULT_Y_AXIS_TICKS);
        g.append("g")
            .attr("class", "axis y")
            .attr("transform", "translate(" + chart.margins().left + "," + chart.margins().top + ")")
            .call(_axisY);
    };

    chart.y = function(_) {
        if (!arguments.length) return _y;
        _y = _;
        return chart;
    };

    chart.axisY = function(y) {
        if (!arguments.length) return _axisY;
        _axisY = y;
        return chart;
    };

    chart.elasticAxisY = function(_) {
        if (!arguments.length) return _elasticAxisY;
        _elasticAxisY = _;
        return chart;
    };

    chart.maxY = function() {
        return chart.group().orderNatural().top(1)[0].value;
    };

    chart.yAxisHeight = function() {
        return chart.height() - chart.margins().top - chart.margins().bottom;
    };

    return chart;
};
