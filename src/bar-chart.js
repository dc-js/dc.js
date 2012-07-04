dc.barChart = function(selector) {

    var DEFAULT_Y_AXIS_TICKS = 5;
    var MIN_BAR_WIDTH = 1;

    var chart = dc.baseMixin({});

    var margin = {top: 10, right: 50, bottom: 30, left: 20};

    var x;
    var y = d3.scale.linear().range([100, 0]);
    var axisX = d3.svg.axis();
    var axisY = d3.svg.axis();
    var xUnits;

    var brush = d3.svg.brush();

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            var g = chart.generateSvg().append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.rangeRound([0, (chart.width() - margin.left - margin.right)]);
            axisX = axisX.scale(x).orient("bottom");

            y.domain([0, maxY()]).rangeRound([yAxisHeight(), 0]);
            axisY = axisY.scale(y).orient("left").ticks(DEFAULT_Y_AXIS_TICKS);

            g.selectAll("rect")
                .data(chart.group().all())
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", function(d) {
                    return x(d.key) + margin.left;
                })
                .attr("y", function(d) {
                    return margin.top + y(d.value);
                })
                .attr("width", function() {
                    var w = Math.floor(chart.width() / xUnits(x.domain()[0], x.domain()[1]).length);
                    if (isNaN(w) || w < MIN_BAR_WIDTH)
                        w = MIN_BAR_WIDTH;
                    return w;
                })
                .attr("height", function(d) {
                    return yAxisHeight() - y(d.value);
                });

            g.append("g")
                .attr("class", "axis x")
                .attr("transform", "translate(" + margin.left + "," + xAxisY() + ")")
                .call(axisX);

            g.append("g")
                .attr("class", "axis y")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(axisY);

            brush
                .on("brushstart", function(p) {
                console.log(brush.extent());
            })
                .on("brush", function(p) {
                    console.log(brush.extent());
                })
                .on("brushend", function() {
                    console.log(brush.extent());
                });

            var gBrush = g.append("g")
                .attr("class", "brush")
                .attr("transform", "translate(" + margin.left + ", 0)")
                .call(brush.x(x));
            gBrush.selectAll("rect").attr("height", xAxisY());
            gBrush.selectAll(".resize").append("path").attr("d", resizePath);
        }

        return chart;
    };

    function maxY() {
        return chart.group().top(1)[0].value;
    }

    function yAxisHeight() {
        return chart.height() - margin.top - margin.bottom;
    }

    function xAxisY() {
        return (chart.height() - margin.bottom);
    }

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
            brush.extent(_);
            chart.dimension().filterRange(_);
        } else {
            brush.clear();
            chart.dimension().filterAll();
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

    dc.registerChart(chart);

    return chart.anchor(selector);
};
