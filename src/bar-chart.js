dc.barChart = function(parent) {
    var MIN_BAR_WIDTH = 1;
    var MIN_BAR_HEIGHT = 0;
    var BAR_PADDING_BOTTOM = 1;
    var BAR_PADDING_WIDTH = 2;
    var GROUP_INDEX_NAME = "__group_index__";

    var _stack = [];
    var _barPositionMatrix = [];

    var chart = dc.coordinateGridChart({});

    chart.transitionDuration(500);

    chart.plotData = function() {
        var groups = combineAllGroups();

        precalculateBarPosition(groups);

        for (var groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
            var group = groups[groupIndex];

            var bars = chart.g().selectAll("rect.stack" + groupIndex)
                .data(group.all());

            // new
            bars.enter()
                .append("rect")
                .attr("class", "bar stack" + groupIndex)
                .attr("x", function(data, dataIndex){return barX(this, data, groupIndex, dataIndex);})
                .attr("y", chart.xAxisY())
                .attr("width", barWidth);
            dc.transition(bars, chart.transitionDuration())
                .attr("y", function(data, dataIndex) {
                    return barY(this, data, dataIndex);
                })
                .attr("height", barHeight);

            // update
            dc.transition(bars, chart.transitionDuration())
                .attr("y", function(data, dataIndex) {
                    return barY(this, data, dataIndex);
                })
                .attr("height", barHeight);

            // delete
            dc.transition(bars.exit(), chart.transitionDuration())
                .attr("y", chart.xAxisY())
                .attr("height", 0);
        }
    };

    function precalculateBarPosition(groups) {
        for (var groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
            var data = groups[groupIndex].all();
            _barPositionMatrix[groupIndex] = [];
            for (var dataIndex = 0; dataIndex < data.length; ++dataIndex) {
                var d = data[dataIndex];
                if (groupIndex == 0)
                    _barPositionMatrix[groupIndex][dataIndex] = barBaseline() - barHeight(d);
                else
                    _barPositionMatrix[groupIndex][dataIndex] = _barPositionMatrix[groupIndex - 1][dataIndex] - barHeight(d);
            }
        }
    }

    function barBaseline() {
        return chart.margins().top + chart.yAxisHeight() - BAR_PADDING_BOTTOM;
    }

    function barWidth(d) {
        var numberOfBars = chart.xUnits()(chart.x().domain()[0], chart.x().domain()[1]).length + BAR_PADDING_WIDTH;
        var w = Math.floor(chart.xAxisLength() / numberOfBars);
        if (isNaN(w) || w < MIN_BAR_WIDTH)
            w = MIN_BAR_WIDTH;
        return w;
    }

    function barX(bar, data, groupIndex, dataIndex) {
        // cache group index in each individual bar to avoid timing issue introduced by transition
        bar[GROUP_INDEX_NAME] = groupIndex;
        return chart.x()(chart.keyRetriever()(data)) + chart.margins().left;
    }

    function barY(bar, data, dataIndex) {
        // cached group index can then be safely retrieved from bar wo/ worrying about transition
        var groupIndex = bar[GROUP_INDEX_NAME];
        return _barPositionMatrix[groupIndex][dataIndex];
    }

    function barHeight(d) {
        var h = (chart.yAxisHeight() - chart.y()(chart.valueRetriever()(d)) - BAR_PADDING_BOTTOM);
	if ( isNaN(h) || h < MIN_BAR_HEIGHT ) 
	    h = MIN_BAR_HEIGHT;
	return h;
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
        var allGroups = [];

        allGroups.push(chart.group());

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
