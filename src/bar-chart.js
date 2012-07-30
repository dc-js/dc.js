dc.barChart = function(_parent) {
    var MIN_BAR_WIDTH = 1;
    var MIN_BAR_HEIGHT = 0;
    var BAR_PADDING_BOTTOM = 1;
    var BAR_PADDING_WIDTH = 2;
    var GROUP_INDEX_NAME = "__group_index__";

    var _stack = [];
    var _barPositionMatrix = [];

    var _chart = dc.coordinateGridChart({});

    _chart.transitionDuration(500);

    _chart.plotData = function() {
        var groups = combineAllGroups();

        precalculateBarPosition(groups);

        for (var groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
            generateBarsPerGroup(groupIndex, groups[groupIndex]);
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
        return _chart.margins().top + _chart.yAxisHeight() - BAR_PADDING_BOTTOM;
    }

    function generateBarsPerGroup(groupIndex, group) {
        var bars = _chart.g().selectAll("rect." + dc.constants.STACK_CLASS + groupIndex)
            .data(group.all());

        // new
        bars.enter()
            .append("rect")
            .attr("class", "bar " + dc.constants.STACK_CLASS + groupIndex)
            .attr("x", function(data, dataIndex) {
                return barX(this, data, groupIndex, dataIndex);
            })
            .attr("y", _chart.xAxisY())
            .attr("width", barWidth);
        dc.transition(bars, _chart.transitionDuration())
            .attr("y", function(data, dataIndex) {
                return barY(this, data, dataIndex);
            })
            .attr("height", barHeight);

        // update
        dc.transition(bars, _chart.transitionDuration())
            .attr("y", function(data, dataIndex) {
                return barY(this, data, dataIndex);
            })
            .attr("height", barHeight);

        // delete
        dc.transition(bars.exit(), _chart.transitionDuration())
            .attr("y", _chart.xAxisY())
            .attr("height", 0);
    }

    function barWidth(d) {
        var numberOfBars = _chart.xUnits()(_chart.x().domain()[0], _chart.x().domain()[1]).length + BAR_PADDING_WIDTH;
        var w = Math.floor(_chart.xAxisLength() / numberOfBars);
        if (isNaN(w) || w < MIN_BAR_WIDTH)
            w = MIN_BAR_WIDTH;
        return w;
    }

    function barX(bar, data, groupIndex, dataIndex) {
        // cache group index in each individual bar to avoid timing issue introduced by transition
        bar[GROUP_INDEX_NAME] = groupIndex;
        return _chart.x()(_chart.keyRetriever()(data)) + _chart.margins().left;
    }

    function barY(bar, data, dataIndex) {
        // cached group index can then be safely retrieved from bar wo/ worrying about transition
        var groupIndex = bar[GROUP_INDEX_NAME];
        return _barPositionMatrix[groupIndex][dataIndex];
    }

    function barHeight(d) {
        var h = (_chart.yAxisHeight() - _chart.y()(_chart.valueRetriever()(d)) - BAR_PADDING_BOTTOM);
        if (isNaN(h) || h < MIN_BAR_HEIGHT)
            h = MIN_BAR_HEIGHT;
        return h;
    }

    _chart.fadeDeselectedArea = function() {
        var bars = _chart.g().selectAll("rect.bar");

        if (!_chart.brush().empty() && _chart.brush().extent() != null) {
            var start = _chart.brush().extent()[0];
            var end = _chart.brush().extent()[1];

            bars.classed(dc.constants.DESELECTED_CLASS, function(d) {
                var xValue = _chart.keyRetriever()(d);
                return xValue < start || xValue >= end;
            });
        } else {
            bars.classed(dc.constants.DESELECTED_CLASS, false);
        }
    };

    _chart.stack = function(_) {
        if (!arguments.length) return _stack;
        _stack = _;
        return _chart;
    };

    // override y axis domain calculation to include stacked groups
    function combineAllGroups() {
        var allGroups = [];

        allGroups.push(_chart.group());

        for (var i = 0; i < _chart.stack().length; ++i)
            allGroups.push(_chart.stack()[i]);

        return allGroups;
    }

    _chart.yAxisMin = function() {
        var min = 0;
        var allGroups = combineAllGroups();

        for (var i = 0; i < allGroups.length; ++i) {
            var group = allGroups[i];
            var m = d3.min(group.all(), function(e) {
                return _chart.valueRetriever()(e);
            });
            if (m < min) min = m;
        }

        return min;
    };

    _chart.yAxisMax = function() {
        var max = 0;
        var allGroups = combineAllGroups();

        for (var i = 0; i < allGroups.length; ++i) {
            var group = allGroups[i];
            max += d3.max(group.all(), function(e) {
                return _chart.valueRetriever()(e);
            });
        }

        return max;
    };

    return _chart.anchor(_parent);
};
