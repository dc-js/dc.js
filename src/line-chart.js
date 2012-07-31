dc.lineChart = function(parent) {
    var AREA_BOTTOM_PADDING = 1;

    var _chart = dc.stackableChart(dc.coordinateGridChart({}));
    var _renderArea = false;

    _chart.transitionDuration(500);

    _chart.plotData = function() {
        var groups = _chart.allGroups();

        _chart.calculateDataPointMatrix(groups);

        for (var groupIndex = 0; groupIndex < groups.length; ++ groupIndex) {
            var group = groups[groupIndex];
            var stackedCssClass = dc.constants.STACK_CLASS + groupIndex;
            var g = _chart.g().select("g." + stackedCssClass);

            if (g.empty())
                g = _chart.g().append("g").attr("class", stackedCssClass);

            g.datum(group.all());

            var linePath = g.select("path.line");

            if (linePath.empty())
                linePath = g.append("path")
                    .attr("class", "line " + stackedCssClass);

            linePath[0][0][dc.constants.GROUP_INDEX_NAME] = groupIndex;

            var line = d3.svg.line()
                .x(function(d) {
                    return _chart.margins().left + _chart.x()(_chart.keyRetriever()(d));
                })
                .y(function(d, dataIndex) {
                    var groupIndex = this[dc.constants.GROUP_INDEX_NAME];
                    return _chart.dataPointMatrix()[groupIndex][dataIndex];
                });

            dc.transition(linePath, _chart.transitionDuration(),
                function(t) {
                    t.ease("linear");
                }).attr("d", line);

            if (_renderArea) {
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
                        return _chart.dataPointMatrix()[groupIndex - 1][dataIndex];
                    });

                dc.transition(areaPath, _chart.transitionDuration(),
                    function(t) {
                        t.ease("linear");
                    }).attr("d", area);
            }
        }
    };

    _chart.renderArea = function(_) {
        if (!arguments.length) return _renderArea;
        _renderArea = _;
        return _chart;
    };

    return _chart.anchor(parent);
};
