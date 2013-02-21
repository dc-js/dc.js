dc.barChart = function (parent, chartGroup) {
    var MIN_BAR_WIDTH = 1;
    var DEFAULT_GAP_BETWEEN_BARS = 2;

    var _chart = dc.stackableChart(dc.coordinateGridChart(dc.singleSelectionChart({})));

    var _gap = DEFAULT_GAP_BETWEEN_BARS;
    var _centerBar = false;

    var _numberOfBars;
    var _barWidth;

    _chart.plotData = function () {
        var groups = _chart.allGroups();

        _chart.calculateDataPointMatrixWithinXDomain(groups);

        for (var groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
            generateBarsPerGroup(groupIndex, groups[groupIndex]);
        }
    };

    function generateBarsPerGroup(groupIndex, group) {
        var bars = _chart.chartBodyG().selectAll("rect." + dc.constants.STACK_CLASS + groupIndex)
            .data(_chart.getDataWithinXDomain(group));

        addNewBars(bars, groupIndex);

        updateBars(bars, groupIndex);

        deleteBars(bars);
    }

    function addNewBars(bars, groupIndex) {
        var bars = bars.enter().append("rect");

        bars.attr("class", "bar " + dc.constants.STACK_CLASS + groupIndex)
            .attr("x", function (data, dataIndex) {
                return barX(this, data, groupIndex, dataIndex);
            })
            .attr("y", _chart.baseLineY())
            .attr("width", barWidth);

        if (_chart.isOrdinal())
            bars.on("click", _chart.onClick);

        if (_chart.renderTitle()) {
            bars.append("title").text(_chart.title());
        }

        dc.transition(bars, _chart.transitionDuration())
            .attr("y", function (data, dataIndex) {
                return barY(this, data, dataIndex);
            })
            .attr("height", function (data) {
                return _chart.dataPointHeight(data, getGroupIndexFromBar(this));
            });
    }

    function updateBars(bars, groupIndex) {
        if (_chart.renderTitle()) {
            bars.select("title").text(_chart.title());
        }

        dc.transition(bars, _chart.transitionDuration())
            .attr("x", function (data, dataIndex) {
                return barX(this, data, groupIndex, dataIndex);
            })
            .attr("y", function (data, dataIndex) {
                return barY(this, data, dataIndex);
            })
            .attr("height", function (data) {
                return _chart.dataPointHeight(data, getGroupIndexFromBar(this));
            })
            .attr("width", barWidth);
    }

    function deleteBars(bars) {
        dc.transition(bars.exit(), _chart.transitionDuration())
            .attr("y", _chart.xAxisY())
            .attr("height", 0);
    }

    function getNumberOfBars() {
        if (_numberOfBars == null || _chart.refocused()){
            _numberOfBars = _chart.xUnitCount();
        }
        return _numberOfBars;
    }

    function barWidth(d) {
        if (_barWidth == null || _chart.refocused()) {
            var numberOfBars = getNumberOfBars();
            var w = MIN_BAR_WIDTH;
            if (_chart.isOrdinal())
                w = Math.floor(_chart.xAxisLength() / (numberOfBars + 1));
            else
                w = Math.floor(_chart.xAxisLength() / numberOfBars);

            w -= _gap;

            if (isNaN(w) || w < MIN_BAR_WIDTH)
                w = MIN_BAR_WIDTH;

            _barWidth = w;
        }

        return _barWidth;
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

    _chart.fadeDeselectedArea = function () {
        var bars = _chart.chartBodyG().selectAll("rect.bar");
        var extent = _chart.brush().extent();

        if (_chart.isOrdinal()) {
            if (_chart.filter() != null)
                bars.classed(dc.constants.DESELECTED_CLASS, function (d) {
                    var key = _chart.keyAccessor()(d);
                    return key != _chart.filter();
                });
            else
                bars.classed(dc.constants.DESELECTED_CLASS, false);
        } else {
            if (!_chart.brushIsEmpty(extent)) {
                var start = extent[0];
                var end = extent[1];

                bars.classed(dc.constants.DESELECTED_CLASS, function (d) {
                    var xValue = _chart.keyAccessor()(d);
                    return xValue < start || xValue >= end;
                });
            } else {
                bars.classed(dc.constants.DESELECTED_CLASS, false);
            }
        }
    };

    _chart.centerBar = function (_) {
        if (!arguments.length) return _centerBar;
        _centerBar = _;
        return _chart;
    };

    _chart.gap = function (_) {
        if (!arguments.length) return _gap;
        _gap = _;
        return _chart;
    };

    _chart.extendBrush = function () {
        var extent = _chart.brush().extent();
        if (_chart.round() && !_centerBar) {
            extent[0] = extent.map(_chart.round())[0];
            extent[1] = extent.map(_chart.round())[1];

            _chart.chartBodyG().select(".brush")
                .call(_chart.brush().extent(extent));
        }
        return extent;
    };

    dc.override(_chart, "prepareOrdinalXAxis", function () {
        return this._prepareOrdinalXAxis(_chart.xUnitCount() + 1);
    });

    return _chart.anchor(parent, chartGroup);
};
