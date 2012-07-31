dc.barChart = function(_parent) {
    var MIN_BAR_WIDTH = 1;
    var BAR_PADDING_WIDTH = 2;

    var _chart = dc.stackableChart(dc.coordinateGridChart({}));

    _chart.transitionDuration(500);

    _chart.plotData = function() {
        var groups = _chart.allGroups();

        _chart.calculateDataPointMatrix(groups);

        for (var groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
            generateBarsPerGroup(groupIndex, groups[groupIndex]);
        }
    };

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
            .attr("height", _chart.dataPointHeight);

        // update
        dc.transition(bars, _chart.transitionDuration())
            .attr("y", function(data, dataIndex) {
                return barY(this, data, dataIndex);
            })
            .attr("height", _chart.dataPointHeight);

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
        bar[dc.constants.GROUP_INDEX_NAME] = groupIndex;
        return _chart.x()(_chart.keyRetriever()(data)) + _chart.margins().left;
    }

    function barY(bar, data, dataIndex) {
        // cached group index can then be safely retrieved from bar wo/ worrying about transition
        var groupIndex = bar[dc.constants.GROUP_INDEX_NAME];
        return _chart.dataPointMatrix()[groupIndex][dataIndex];
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

    return _chart.anchor(_parent);
};
