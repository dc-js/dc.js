dc.barChart = function(selector) {

    var DEFAULT_Y_AXIS_TICKS = 5;
    var MIN_BAR_WIDTH = 1;
    var BAR_PADDING_BOTTOM = 1;

    var chart = dc.baseChart({});

    var margin = {top: 10, right: 50, bottom: 30, left: 20};

    var x;
    var y = d3.scale.linear().range([100, 0]);
    var axisX = d3.svg.axis();
    var axisY = d3.svg.axis();
    var elasticAxisY = false;
    var xUnits = dc.units.integers;

    var g;
    var bars;
    var filter;
    var brush = d3.svg.brush();
    var round;

    chart.transitionDuration(500);

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            g = chart.generateSvg().append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            renderAxisX();

            renderAxisY();

            redrawBars();

            renderBrush();
        }

        return chart;
    };

    function renderAxisX() {
        g.select("g.x").remove();
        x.range([0, (chart.width() - margin.left - margin.right)]);
        axisX = axisX.scale(x).orient("bottom");
        g.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate(" + margin.left + "," + xAxisY() + ")")
            .call(axisX);
    }

    function renderAxisY() {
        g.select("g.y").remove();
        y.domain([0, maxY()]).rangeRound([yAxisHeight(), 0]);
        axisY = axisY.scale(y).orient("left").ticks(DEFAULT_Y_AXIS_TICKS);
        g.append("g")
            .attr("class", "axis y")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(axisY);
    }

    function renderBrush() {
        brush.on("brushstart", brushStart)
            .on("brush", brushing)
            .on("brushend", brushEnd);

        var gBrush = g.append("g")
            .attr("class", "brush")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(brush.x(x));
        gBrush.selectAll("rect").attr("height", xAxisY());
        gBrush.selectAll(".resize").append("path").attr("d", resizePath);

        if (filter) {
            redrawBrush();
        }
    }

    function brushStart(p) {
    }

    function brushing(p) {
        var extent = brush.extent();
        if (round) {
            extent[0] = extent.map(round)[0];
            extent[1] = extent.map(round)[1];
            g.select(".brush")
                .call(brush.extent(extent));
        }
        chart.filter([brush.extent()[0], brush.extent()[1]]);
        dc.redrawAll();
    }

    function brushEnd(p) {
    }

    chart.redraw = function() {
        redrawBars();
        redrawBrush();
        if(elasticAxisY)
            renderAxisY();
        return chart;
    };

    function redrawBars() {
        bars = g.selectAll("rect.bar")
            .data(chart.group().all());

        // new
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return finalBarX(d);
            })
            .attr("y", xAxisY())
            .attr("width", function() {
                return finalBarWidth();
            });
        dc.transition(bars, chart.transitionDuration())
            .attr("y", function(d) {
                return finalBarY(d);
            })
            .attr("height", function(d) {
                return finalBarHeight(d);
            });

        // update
        dc.transition(bars, chart.transitionDuration())
            .attr("y", function(d) {
                return finalBarY(d);
            })
            .attr("height", function(d) {
                return finalBarHeight(d);
            });

        // delete
        dc.transition(bars.exit(), chart.transitionDuration())
            .attr("y", xAxisY())
            .attr("height", 0);
    }

    chart.axisXLength = function() {
        return chart.width() - chart.margins().left - chart.margins().right;
    }

    function finalBarWidth() {
        var w = Math.floor(chart.axisXLength() / xUnits(x.domain()[0], x.domain()[1]).length);
        if (isNaN(w) || w < MIN_BAR_WIDTH)
            w = MIN_BAR_WIDTH;
        return w;
    }

    function finalBarX(d) {
        return x(d.key) + margin.left;
    }

    function finalBarY(d) {
        return margin.top + y(d.value);
    }

    function finalBarHeight(d) {
        return yAxisHeight() - y(d.value) - BAR_PADDING_BOTTOM;
    }

    function redrawBrush() {
        if (filter && brush.empty())
            brush.extent(filter);

        var gBrush = g.select("g.brush");
        gBrush.call(brush.x(x));
        gBrush.selectAll("rect").attr("height", xAxisY());

        fadeDeselectedBars();
    }

    function fadeDeselectedBars() {
        if (!brush.empty() && brush.extent() != null) {
            var start = brush.extent()[0];
            var end = brush.extent()[1];

            bars.classed("deselected", function(d) {
                return d.key < start || d.key >= end;
            });
        } else {
            bars.classed("deselected", false);
        }
    }

    function maxY() {
        return chart.group().orderNatural().top(1)[0].value;
    }

    function yAxisHeight() {
        return chart.height() - margin.top - margin.bottom;
    }

    function xAxisY() {
        return (chart.height() - margin.bottom);
    }

    // borrowed from Crossfilter example
    function resizePath(d) {
        var e = +(d == "e"), x = e ? 1 : -1, y = xAxisY() / 3;
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

    chart.filter = function(_) {
        if (_) {
            filter = _;
            brush.extent(_);
            chart.dimension().filterRange(_);
            chart.turnOnReset();
        } else {
            filter = null;
            brush.clear();
            chart.dimension().filterAll();
            chart.turnOffReset();
        }

        return chart;
    };

    chart.margins = function(m) {
        if (!arguments.length) return margin;
        margin = m;
        return chart;
    };

    chart.x = function(_) {
        if (!arguments.length) return x;
        x = _;
        return chart;
    };

    chart.y = function(_) {
        if (!arguments.length) return y;
        y = _;
        return chart;
    };

    chart.xUnits = function(f) {
        if (!arguments.length) return xUnits;
        xUnits = f;
        return chart;
    };

    chart.axisX = function(x) {
        if (!arguments.length) return axisX;
        axisX = x;
        return chart;
    };

    chart.axisY = function(y) {
        if (!arguments.length) return axisY;
        axisY = y;
        return chart;
    };

    chart.round = function(_) {
        if (!arguments.length) return round;
        round = _;
        return chart;
    };

    chart.elasticAxisY = function(_){
        if(!arguments.length) return elasticAxisY;
        elasticAxisY = _;
        return chart;
    }

    dc.registerChart(chart);

    return chart.anchor(selector);
};
