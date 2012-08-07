dc.coordinateGridChart = function(_chart) {
    var DEFAULT_Y_AXIS_TICKS = 5;
    var GRID_LINE_CLASS = "grid-line";
    var HORIZONTAL_CLASS = "horizontal";
    var VERTICAL_CLASS = "vertical";

    _chart = dc.baseChart(_chart);

    var _margin = {top: 10, right: 50, bottom: 30, left: 20};

    var _g;

    var _x;
    var _xAxis = d3.svg.axis();
    var _xUnits = dc.units.integers;
    var _xAxisPadding = 0;
    var _xElasticity = false;

    var _y;
    var _yAxis = d3.svg.axis();
    var _yAxisPadding = 0;
    var _yElasticity = false;

    var _filter;
    var _brush = d3.svg.brush();
    var _round;

    var _renderHorizontalGridLine = false;
    var _renderVerticalGridLine = false;

    _chart.generateG = function() {
        _g = _chart.svg().append("g")
            .attr("transform", "translate(" + _chart.margins().left + "," + _chart.margins().top + ")");
        return _g;
    };

    _chart.g = function(_) {
        if (!arguments.length) return _g;
        _g = _;
        return _chart;
    };

    _chart.margins = function(m) {
        if (!arguments.length) return _margin;
        _margin = m;
        return _chart;
    };

    _chart.x = function(_) {
        if (!arguments.length) return _x;
        _x = _;
        return _chart;
    };

    _chart.xAxis = function(_) {
        if (!arguments.length) return _xAxis;
        _xAxis = _;
        return _chart;
    };

    _chart.renderXAxis = function(g) {
        g.select("g.x").remove();

        if (_chart.elasticX()) {
            _x.domain([_chart.xAxisMin(), _chart.xAxisMax()]);
        }

        _x.range([0, _chart.xAxisLength()]);
        _xAxis = _xAxis.scale(_chart.x()).orient("bottom");
        g.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate(" + _chart.margins().left + "," + _chart.xAxisY() + ")")
            .call(_xAxis);

        renderVerticalGridLines(g);
    };

    function renderVerticalGridLines(g) {
        if (_renderVerticalGridLine) {
            g.selectAll("g." + VERTICAL_CLASS).remove();

            var ticks = _xAxis.tickValues()?_xAxis.tickValues():_x.ticks(_xAxis.ticks()[0]);

            var gridLineG = g.append("g")
                .attr("class", GRID_LINE_CLASS + " " + VERTICAL_CLASS)
                .attr("transform", "translate(" + _chart.yAxisX() + "," + _chart.margins().top + ")");

            for (var i = 0; i < ticks.length; ++i) {
                var tick = ticks[i];
                gridLineG.append("line")
                    .attr("x1", _x(tick))
                    .attr("y1", _chart.xAxisY() - _chart.margins().top)
                    .attr("x2", _x(tick))
                    .attr("y2", 0);
            }
        }
    }

    _chart.xAxisY = function() {
        return (_chart.height() - _chart.margins().bottom);
    };

    _chart.xAxisLength = function() {
        return _chart.width() - _chart.margins().left - _chart.margins().right;
    };

    _chart.xUnits = function(_) {
        if (!arguments.length) return _xUnits;
        _xUnits = _;
        return _chart;
    };

    _chart.renderYAxis = function(g) {
        g.select("g.y").remove();

        if (_y == null || _chart.elasticY()) {
            _y = d3.scale.linear();
            _y.domain([_chart.yAxisMin(), _chart.yAxisMax()]).rangeRound([_chart.yAxisHeight(), 0]);
        }

        _y.range([_chart.yAxisHeight(), 0]);
        _yAxis = _yAxis.scale(_y).orient("left").ticks(DEFAULT_Y_AXIS_TICKS);

        g.append("g")
            .attr("class", "axis y")
            .attr("transform", "translate(" + _chart.yAxisX() + "," + _chart.margins().top + ")")
            .call(_yAxis);


        renderHorizontalGridLines(g);
    };

    function renderHorizontalGridLines(g) {
        if (_renderHorizontalGridLine) {
            g.selectAll("g." + HORIZONTAL_CLASS).remove();

            var ticks = _yAxis.tickValues()?_yAxis.tickValues():_y.ticks(_yAxis.ticks()[0]);

            var gridLineG = g.append("g")
                .attr("class", GRID_LINE_CLASS + " " + HORIZONTAL_CLASS)
                .attr("transform", "translate(" + _chart.yAxisX() + "," + _chart.margins().top + ")");

            for (var i = 0; i < ticks.length; ++i) {
                if (i == 0) continue;
                var tick = ticks[i];
                gridLineG.append("line")
                    .attr("x1", 1)
                    .attr("y1", _y(tick))
                    .attr("x2", _chart.xAxisLength())
                    .attr("y2", _y(tick));
            }
        }
    }

    _chart.renderHorizontalGridLines = function(_) {
        if (!arguments.length) return _renderHorizontalGridLine;
        _renderHorizontalGridLine = _;
        return _chart;
    };

    _chart.renderVerticalGridLines = function(_){
        if(!arguments.length) return _renderVerticalGridLine;
        _renderVerticalGridLine = _;
        return _chart;
    };

    _chart.yAxisX = function() {
        return _chart.margins().left;
    };

    _chart.y = function(_) {
        if (!arguments.length) return _y;
        _y = _;
        return _chart;
    };

    _chart.yAxis = function(y) {
        if (!arguments.length) return _yAxis;
        _yAxis = y;
        return _chart;
    };

    _chart.elasticY = function(_) {
        if (!arguments.length) return _yElasticity;
        _yElasticity = _;
        return _chart;
    };

    _chart.elasticX = function(_) {
        if (!arguments.length) return _xElasticity;
        _xElasticity = _;
        return _chart;
    };

    _chart.xAxisMin = function() {
        var min = d3.min(_chart.group().all(), function(e) {
            return _chart.keyRetriever()(e);
        });
        return dc.utils.subtract(min, _xAxisPadding);
    };

    _chart.xAxisMax = function() {
        var max = d3.max(_chart.group().all(), function(e) {
            return _chart.keyRetriever()(e);
        });
        return dc.utils.add(max, _xAxisPadding);
    };

    _chart.yAxisMin = function() {
        var min = d3.min(_chart.group().all(), function(e) {
            return _chart.valueRetriever()(e);
        }) - _yAxisPadding;
        return min;
    };

    _chart.yAxisMax = function() {
        var max = d3.max(_chart.group().all(), function(e) {
            return _chart.valueRetriever()(e);
        });
        return dc.utils.add(max, _yAxisPadding);
    };

    _chart.xAxisPadding = function(_) {
        if (!arguments.length) return _xAxisPadding;
        _xAxisPadding = _;
        return _chart;
    };

    _chart.yAxisPadding = function(_) {
        if (!arguments.length) return _yAxisPadding;
        _yAxisPadding = _;
        return _chart;
    };

    _chart.yAxisHeight = function() {
        return _chart.height() - _chart.margins().top - _chart.margins().bottom;
    };

    _chart.round = function(_) {
        if (!arguments.length) return _round;
        _round = _;
        return _chart;
    };

    _chart._filter = function(_) {
        if (!arguments.length) return _filter;
        _filter = _;
        return _chart;
    };

    _chart.filter = function(_) {
        if (!arguments.length) return _filter;

        if (_) {
            _filter = _;
            _chart.brush().extent(_);
            _chart.dimension().filterRange(_);
            _chart.turnOnControls();
        } else {
            _filter = null;
            _chart.brush().clear();
            _chart.dimension().filterAll();
            _chart.turnOffControls();
        }

        return _chart;
    };

    _chart.brush = function(_) {
        if (!arguments.length) return _brush;
        _brush = _;
        return _chart;
    };

    _chart.renderBrush = function(g) {
        _brush.on("brushstart", brushStart)
            .on("brush", brushing)
            .on("brushend", brushEnd);

        var gBrush = g.append("g")
            .attr("class", "brush")
            .attr("transform", "translate(" + _chart.margins().left + ",0)")
            .call(_brush.x(_chart.x()));
        gBrush.selectAll("rect").attr("height", _chart.xAxisY());
        gBrush.selectAll(".resize").append("path").attr("d", _chart.resizeHandlePath);

        if (_filter) {
            _chart.redrawBrush(g);
        }
    };

    function brushStart(p) {
    }

    function brushing(p) {
        var extent = _brush.extent();
        if (_chart.round()) {
            extent[0] = extent.map(_chart.round())[0];
            extent[1] = extent.map(_chart.round())[1];
            _g.select(".brush")
                .call(_brush.extent(extent));
        }
        extent = _brush.extent();
        _chart.filter(_brush.empty() ? null : [extent[0], extent[1]]);
        dc.redrawAll(_chart.chartGroup());
    }

    function brushEnd(p) {
    }

    _chart.redrawBrush = function(g) {
        if (_chart._filter() && _chart.brush().empty())
            _chart.brush().extent(_chart._filter());

        var gBrush = g.select("g.brush");
        gBrush.call(_chart.brush().x(_chart.x()));
        gBrush.selectAll("rect").attr("height", _chart.xAxisY());

        _chart.fadeDeselectedArea();
    };

    _chart.fadeDeselectedArea = function() {
        // do nothing, sub-chart should override this function
    };

    // borrowed from Crossfilter example
    _chart.resizeHandlePath = function(d) {
        var e = +(d == "e"), x = e ? 1 : -1, y = _chart.xAxisY() / 3;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
    };

    _chart.doRender = function() {
        _chart.resetSvg();

        if (_chart.dataAreSet()) {
            _chart.generateG();

            _chart.renderXAxis(_chart.g());
            _chart.renderYAxis(_chart.g());

            _chart.plotData();

            _chart.renderBrush(_chart.g());
        }

        return _chart;
    };

    _chart.doRedraw = function() {
        if (_chart.elasticY())
            _chart.renderYAxis(_chart.g());

        if (_chart.elasticX())
            _chart.renderXAxis(_chart.g());

        _chart.plotData();
        _chart.redrawBrush(_chart.g());

        return _chart;
    };

    _chart.subRender = function() {
        if (_chart.dataAreSet()) {
            _chart.plotData();
        }

        return _chart;
    };

    return _chart;
};
