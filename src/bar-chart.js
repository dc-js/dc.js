dc.barChart = function (parent, chartGroup) {
    var MIN_BAR_WIDTH = 1;
    var DEFAULT_GAP_BETWEEN_BARS = 2;

    var _chart = dc.stackableChart(dc.coordinateGridChart({}));

    var _gap = DEFAULT_GAP_BETWEEN_BARS;
    var _centerBar = false;

    var _numberOfBars;
    var _barWidth;

    _chart.resetBarProperties = function () {
        _numberOfBars = null;
        _barWidth = null;
        getNumberOfBars();
    };

    _chart.plotData = function () {
        var groups = _chart.allGroups();

        _chart.calculateDataPointMatrixForAll(groups);

        var stackedLayers = _chart.stackedLayers();

        calculateBarWidth();

        var layers = _chart.chartBodyG().selectAll("g.stack")
            .data(stackedLayers);

        layers
            .enter()
            .append("g")
            .attr("class", function (d, i) {
                return "stack " + "_" + i;
            });

        layers.each(function (d, i) {
            var layer = d3.select(this);

            renderBars(layer, d, i);
        });
    };

    function renderBars(layer, d, i) {
        var bars = layer.selectAll("rect.bar")
            .data(d.points);

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("fill", function (d) {
                return _chart.colors()(i);
            })
            .append("title").text(_chart.title());

        dc.transition(bars, _chart.transitionDuration())
            .attr("x", function (d) {
                return _chart.x()(d.x);
            })
            .attr("y", function (d) {
                return _chart.y()(d.y + d.y0);
            })
            .attr("width", _barWidth)
            .attr("height", function (d) {
                return Math.abs(_chart.y()(d.y + d.y0) - _chart.y()(d.y0));
            })
            .select("title").text(_chart.title());

        dc.transition(bars.exit(), _chart.transitionDuration())
            .attr("height", 0)
            .remove();
    }

    function calculateBarWidth() {
        if (_barWidth == null) {
            var numberOfBars = _chart.isOrdinal() ? getNumberOfBars() + 1 : getNumberOfBars();

            var w = Math.floor((_chart.xAxisLength() - (numberOfBars - 1) * _gap) / numberOfBars);

            if (w == Infinity || isNaN(w) || w < MIN_BAR_WIDTH)
                w = MIN_BAR_WIDTH;

            _barWidth = w;
        }
    }

    function getNumberOfBars() {
        if (_numberOfBars == null) {
            _numberOfBars = _chart.xUnitCount();
        }

        return _numberOfBars;
    }

    _chart.fadeDeselectedArea = function () {
        var bars = _chart.chartBodyG().selectAll("rect.bar");
        var extent = _chart.brush().extent();

        if (_chart.isOrdinal()) {
            if (_chart.hasFilter()) {
                bars.classed(dc.constants.SELECTED_CLASS, function (d) {
                    return _chart.hasFilter(_chart.keyAccessor()(d.data));
                });
                bars.classed(dc.constants.DESELECTED_CLASS, function (d) {
                    return !_chart.hasFilter(_chart.keyAccessor()(d.data));
                });
            } else {
                bars.classed(dc.constants.SELECTED_CLASS, false);
                bars.classed(dc.constants.DESELECTED_CLASS, false);
            }
        } else {
            if (!_chart.brushIsEmpty(extent)) {
                var start = extent[0];
                var end = extent[1];

                bars.classed(dc.constants.DESELECTED_CLASS, function (d) {
                    var xValue = _chart.keyAccessor()(d.data);
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
