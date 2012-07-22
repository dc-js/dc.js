dc.barChart = function(selector) {
    var MIN_BAR_WIDTH = 1;
    var BAR_PADDING_BOTTOM = 1;

    var chart = dc.coordinateGridChart({});
    var bars;

    chart.transitionDuration(500);

    chart.plotData = function() {
        bars = chart.g().selectAll("rect.bar")
            .data(chart.group().all());

        // new
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return finalBarX(d);
            })
            .attr("y", chart.xAxisY())
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
            .attr("y", chart.xAxisY())
            .attr("height", 0);
    }

    function finalBarWidth() {
        var w = Math.floor(chart.xAxisLength() / chart.xUnits()(chart.x().domain()[0], chart.x().domain()[1]).length);
        if (isNaN(w) || w < MIN_BAR_WIDTH)
            w = MIN_BAR_WIDTH;
        return w;
    }

    function finalBarX(d) {
        return chart.x()(chart.xValue()(d)) + chart.margins().left;
    }

    function finalBarY(d) {
        return chart.margins().top + chart.y()(chart.yValue()(d));
    }

    function finalBarHeight(d) {
        return chart.yAxisHeight() - chart.y()(chart.yValue()(d)) - BAR_PADDING_BOTTOM;
    }

    chart.redrawBrush = function(g) {
        chart._redrawBrush(g);

        fadeDeselectedBars();
    };

    function fadeDeselectedBars() {
        if (!chart.brush().empty() && chart.brush().extent() != null) {
            var start = chart.brush().extent()[0];
            var end = chart.brush().extent()[1];

            bars.classed("deselected", function(d) {
                var xValue = chart.xValue()(d);
                return xValue < start || xValue >= end;
            });
        } else {
            bars.classed("deselected", false);
        }
    }


    dc.registerChart(chart);

    return chart.anchor(selector);
};
