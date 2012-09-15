dc.barChart = function(parent, chartGroup) {
    var MIN_BAR_WIDTH = 1;
    var DEFAULT_GAP_BETWEEN_BARS = 2;

    var _chart = dc.stackableChart(dc.coordinateGridChart({}));

    var _numberOfBars;
    var _gap = DEFAULT_GAP_BETWEEN_BARS;
    var _centerBar = false;

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

        addNewBars(bars, groupIndex);

        updateBars(bars, groupIndex);

        deleteBars(bars);
    }

    function addNewBars(bars, groupIndex) {
        var bars = bars.enter().append("rect");

        bars.attr("class", "bar " + dc.constants.STACK_CLASS + groupIndex)
            .attr("x", function(data, dataIndex) {
                return barX(this, data, groupIndex, dataIndex);
            })
            .attr("y", _chart.xAxisY())
            .attr("width", barWidth);

        if (_chart.renderTitle()) {
            bars.append("title").text(_chart.title());
        }

        dc.transition(bars, _chart.transitionDuration())
            .attr("y", function(data, dataIndex) {
                return barY(this, data, dataIndex);
            })
            .attr("height", function(data) {
                return _chart.dataPointHeight(data, getGroupIndexFromBar(this));
            });
    }

    function updateBars(bars, groupIndex) {
        if (_chart.renderTitle()) {
            bars.select("title").text(_chart.title());
        }

        dc.transition(bars, _chart.transitionDuration())
            .attr("x", function(data, dataIndex) {
                return barX(this, data, groupIndex, dataIndex);
            })
            .attr("y", function(data, dataIndex) {
                return barY(this, data, dataIndex);
            })
            .attr("height", function(data) {
                return _chart.dataPointHeight(data, getGroupIndexFromBar(this));
            });
    }

    function deleteBars(bars) {
        dc.transition(bars.exit(), _chart.transitionDuration())
            .attr("y", _chart.xAxisY())
            .attr("height", 0);
    }

    function getNumberOfBars() {
        if (_numberOfBars == null)
            _numberOfBars = _chart.xUnits()(_chart.x().domain()[0], _chart.x().domain()[1]).length;
        return _numberOfBars;
    }

    function barWidth(d) {
        var numberOfBars = getNumberOfBars();
        var w = Math.floor(_chart.xAxisLength() / numberOfBars);
        w -= _gap;
        if (isNaN(w) || w < MIN_BAR_WIDTH)
            w = MIN_BAR_WIDTH;
        return w;
    }

    function setGroupIndexToBar(bar, groupIndex) {
        bar[dc.constants.GROUP_INDEX_NAME] = groupIndex;
    }

    function barX(bar, data, groupIndex, dataIndex) {
        setGroupIndexToBar(bar, groupIndex);
        var position = _chart.x()(_chart.keyAccessor()(data)) + _chart.margins().left;
        if (_centerBar)
            position = position - barWidth(data) / 2;
        return position;
    }

    function getGroupIndexFromBar(bar) {
        var groupIndex = bar[dc.constants.GROUP_INDEX_NAME];
        return groupIndex;
    }

    function barY(bar, data, dataIndex) {
        var groupIndex = getGroupIndexFromBar(bar);
        return _chart.getChartStack().getDataPoint(groupIndex, dataIndex);
    }

    _chart.fadeDeselectedArea = function() {
        var bars = _chart.g().selectAll("rect.bar");

        if (!_chart.brush().empty() && _chart.brush().extent() != null) {
            var start = _chart.brush().extent()[0];
            var end = _chart.brush().extent()[1];

            bars.classed(dc.constants.DESELECTED_CLASS, function(d) {
                var xValue = _chart.keyAccessor()(d);
                return xValue < start || xValue >= end;
            });
        } else {
            bars.classed(dc.constants.DESELECTED_CLASS, false);
        }
    };

    _chart.centerBar = function(_) {
        if (!arguments.length) return _centerBar;
        _centerBar = _;
        return _chart;
    };

    _chart.gap = function(_) {
        if (!arguments.length) return _gap;
        _gap = _;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
