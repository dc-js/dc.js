dc.barChart = function(parent) {
    var MIN_BAR_WIDTH = 1;
    var BAR_PADDING_BOTTOM = 1;
    var BAR_PADDING_WIDTH = 2;

    var _stack = [];

    var chart = dc.coordinateGridChart({});

    chart.transitionDuration(500);

    chart.plotData = function() {
        var baseData = chart.group().all();
        var groups = combineAllGroups();
        var lastYByIndex = {};
        for (var i = 0; i < baseData.length; ++i) {
            lastYByIndex[i] = chart.margins().top + chart.yAxisHeight();
        }

        for (var i = 0; i < groups.length; ++i) {
            var group = groups[i];

            var bars = chart.g().selectAll("rect.stack" + i)
                .data(group.all());

            // new
            bars.enter()
                .append("rect")
                .attr("class", "bar stack" + i)
                .attr("x", function(d) {
                    return barX(d);
                })
                .attr("y", chart.xAxisY())
                .attr("width", function(d) {
                    return barWidth(d);
                });
            dc.transition(bars, chart.transitionDuration())
                .attr("y", function(d, i) {
                    return barY(d, i, lastYByIndex);
                })
                .attr("height", function(d) {
                    return barHeight(d, lastYByIndex);
                });

            // update
            dc.transition(bars, chart.transitionDuration())
                .attr("y", function(d, i) {
                    return barY(d, i, lastYByIndex);
                })
                .attr("height", function(d) {
                    return barHeight(d, lastYByIndex);
                });

            // delete
            dc.transition(bars.exit(), chart.transitionDuration())
                .attr("y", chart.xAxisY())
                .attr("height", 0);
        }
    };

    function barWidth(d) {
        var numberOfBars = chart.xUnits()(chart.x().domain()[0], chart.x().domain()[1]).length + BAR_PADDING_WIDTH;
        var w = Math.floor(chart.xAxisLength() / numberOfBars);
        if (isNaN(w) || w < MIN_BAR_WIDTH)
            w = MIN_BAR_WIDTH;
        return w;
    }

    function barX(d) {
        return chart.x()(chart.keyRetriever()(d)) + chart.margins().left;
    }

    function barY(d, i, lastYByIndex) {
        var existingBottom = lastYByIndex[i];
        var originalY = chart.margins().top + chart.y()(chart.valueRetriever()(d));
        if (existingBottom == 0) {
            lastYByIndex[i] = originalY;
        }else{
            lastYByIndex[i] -= barHeight(d, lastYByIndex);
        }

        console.log("existing bottom: "+existingBottom+", original Y: "+originalY+", lastY[i]: " + lastYByIndex[i]);

        return lastYByIndex[i];
    }

    function barHeight(d, lastYByIndex) {
        return chart.yAxisHeight() - chart.y()(chart.valueRetriever()(d)) - BAR_PADDING_BOTTOM;
    }

    chart.fadeDeselectedArea = function() {
        var bars = chart.g().selectAll("rect.bar");

        if (!chart.brush().empty() && chart.brush().extent() != null) {
            var start = chart.brush().extent()[0];
            var end = chart.brush().extent()[1];

            bars.classed("deselected", function(d) {
                var xValue = chart.keyRetriever()(d);
                return xValue < start || xValue >= end;
            });
        } else {
            bars.classed("deselected", false);
        }
    };

    chart.stack = function(_) {
        if (!arguments.length) return _stack;
        _stack = _;
        return chart;
    };

    // override y axis domain calculation to include stacked groups
    function combineAllGroups() {
        var allGroups = [chart.group()];

        for (var i = 0; i < chart.stack().length; ++i)
            allGroups.push(chart.stack()[i]);
        return allGroups;
    }

    chart.yAxisMin = function() {
        var min = 0;
        var allGroups = combineAllGroups();

        for (var i = 0; i < allGroups.length; ++i) {
            var group = allGroups[i];
            var m = d3.min(group.all(), function(e) {
                return chart.valueRetriever()(e);
            });
            if (m < min) min = m;
        }

        return min;
    };

    chart.yAxisMax = function() {
        var max = 0;
        var allGroups = combineAllGroups();

        for (var i = 0; i < allGroups.length; ++i) {
            var group = allGroups[i];
            max += d3.max(group.all(), function(e) {
                return chart.valueRetriever()(e);
            });
        }

        return max;
    };

    return chart.anchor(parent);
};
