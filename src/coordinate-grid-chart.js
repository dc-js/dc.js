dc.coordinateGridChart = function(chart) {
    var DEFAULT_Y_AXIS_TICKS = 5;

    chart = dc.baseChart(chart);

    var _margin = {top: 10, right: 50, bottom: 30, left: 20};

    var _g;

    var _x;
    var _axisX = d3.svg.axis();
    var _xUnits = dc.units.integers;

    var _y = d3.scale.linear().range([100, 0]);
    var _axisY = d3.svg.axis();
    var _elasticAxisY = false;

    var _filter;
    var _brush = d3.svg.brush();
    var _round;

    chart.generateG = function() {
        _g = chart.generateSvg().append("g")
            .attr("transform", "translate(" + chart.margins().left + "," + chart.margins().top + ")");
    }

    chart.g = function(_){
        if(!arguments.length) return _g;
        _g = _;
        return chart;
    }

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

    chart.round = function(_) {
        if (!arguments.length) return _round;
        _round = _;
        return chart;
    };

    chart._filter = function(_) {
        if (!arguments.length) return _filter;
        _filter = _;
        return chart;
    };

    chart.brush = function(_) {
        if (!arguments.length) return _brush;
        _brush = _;
        return chart;
    };

    chart.renderBrush = function(g) {
        _brush.on("brushstart", brushStart)
            .on("brush", brushing)
            .on("brushend", brushEnd);

        var gBrush = g.append("g")
            .attr("class", "brush")
            .attr("transform", "translate(" + chart.margins().left + ",0)")
            .call(_brush.x(chart.x()));
        gBrush.selectAll("rect").attr("height", chart.xAxisY());
        gBrush.selectAll(".resize").append("path").attr("d", chart.resizeHandlePath);

        if (_filter) {
            chart.redrawBrush(g);
        }
    }

    function brushStart(p) {
    }

    function brushing(p) {
        var extent = _brush.extent();
        if (chart.round()) {
            extent[0] = extent.map(chart.round())[0];
            extent[1] = extent.map(chart.round())[1];
            _g.select(".brush")
                .call(_brush.extent(extent));
        }
        chart.filter([_brush.extent()[0], _brush.extent()[1]]);
        dc.redrawAll();
    }

    function brushEnd(p) {
    }

    chart._redrawBrush = function(g) {
        if (chart._filter() && chart.brush().empty())
            chart.brush().extent(chart._filter());

        var gBrush = g.select("g.brush");
        gBrush.call(chart.brush().x(chart.x()));
        gBrush.selectAll("rect").attr("height", chart.xAxisY());
    }

    // borrowed from Crossfilter example
    chart.resizeHandlePath = function(d) {
        var e = +(d == "e"), x = e ? 1 : -1, y = chart.xAxisY() / 3;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
    }

    return chart;
};
