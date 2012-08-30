dc.lineChart = function(parent, chartGroup) {
    var AREA_BOTTOM_PADDING = 1;
    var DEFAULT_DOT_RADIUS = 5;

    var _chart = dc.stackableChart(dc.coordinateGridChart({}));
    var _renderArea = false;
    var _dotRadius = DEFAULT_DOT_RADIUS;

    _chart.transitionDuration(500);

    _chart.plotData = function() {
        var groups = _chart.allGroups();

        _chart.calculateDataPointMatrix(groups);

        for (var groupIndex = 0; groupIndex < groups.length; ++ groupIndex) {
            var group = groups[groupIndex];
            plotDataByGroup(groupIndex, group);
        }
    };

    function plotDataByGroup(groupIndex, group) {
        var stackedCssClass = getStackedCssClass(groupIndex);

        var g = createGrouping(stackedCssClass, group);

        var line = drawLine(g, stackedCssClass, groupIndex);

        if (_renderArea)
            drawArea(g, stackedCssClass, groupIndex, line);

        if (_chart.renderTitle())
            drawDots(g, groupIndex);
    }

    function getStackedCssClass(groupIndex) {
        return dc.constants.STACK_CLASS + groupIndex;
    }

    function createGrouping(stackedCssClass, group) {
        var g = _chart.g().select("g." + stackedCssClass);

        if (g.empty())
            g = _chart.g().append("g").attr("class", stackedCssClass);

        g.datum(group.all());

        return g;
    }

    function drawLine(g, stackedCssClass, groupIndex) {
        var linePath = g.select("path.line");

        if (linePath.empty())
            linePath = g.append("path")
                .attr("class", "line " + stackedCssClass);

        linePath[0][0][dc.constants.GROUP_INDEX_NAME] = groupIndex;

        var line = d3.svg.line()
            .x(lineX)
            .y(function(d, dataIndex) {
                var groupIndex = this[dc.constants.GROUP_INDEX_NAME];
                return lineY(d, dataIndex, groupIndex);
            });

        dc.transition(linePath, _chart.transitionDuration(),
            function(t) {
                t.ease("linear");
            }).attr("d", line);

        return line;
    }

    var lineX = function(d) {
        return _chart.margins().left + _chart.x()(_chart.keyAccessor()(d));
    };

    var lineY = function(d, dataIndex, groupIndex) {
        return _chart.getChartStack().getDataPoint(groupIndex, dataIndex);
    };

    function drawArea(g, stackedCssClass, groupIndex, line) {
        var areaPath = g.selectAll("path.area");

        if (areaPath.empty())
            areaPath = g.append("path")
                .attr("class", "area " + stackedCssClass);

        areaPath[0][0][dc.constants.GROUP_INDEX_NAME] = groupIndex;

        var area = d3.svg.area()
            .x(line.x())
            .y1(line.y())
            .y0(function(d, dataIndex) {
                var groupIndex = this[dc.constants.GROUP_INDEX_NAME];
                if (groupIndex == 0) return _chart.y()(0) - AREA_BOTTOM_PADDING + _chart.margins().top;
                return _chart.getChartStack().getDataPoint(--groupIndex, dataIndex) - AREA_BOTTOM_PADDING;
            });

        dc.transition(areaPath, _chart.transitionDuration(),
            function(t) {
                t.ease("linear");
            }).attr("d", area);
    }

    _chart.renderArea = function(_) {
        if (!arguments.length) return _renderArea;
        _renderArea = _;
        return _chart;
    };

    function drawDots(g, groupIndex) {
        var dots = g.selectAll("circle.dot")
            .data(g.datum());

        dots.enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", _dotRadius)
            .style("fill-opacity", 1e-6)
            .on("mouseover", function(d) {
                d3.select(this).style("fill-opacity", .8)
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill-opacity", 1e-6)
            })
            .append("title")
            .text(_chart.title());

        dots.attr("cx", lineX)
            .attr("cy", function(d, dataIndex) {
                return lineY(d, dataIndex, groupIndex);
            });

        dots.exit().remove();
    }

    _chart.dotRadius = function(_){
        if(!arguments.length) return _dotRadius;
        _dotRadius = _;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
