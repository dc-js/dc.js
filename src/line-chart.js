dc.lineChart = function(parent) {
    var AREA_BOTTOM_PADDING = 1;

    var _chart = dc.coordinateGridChart({});

    var _renderArea = false;

    _chart.transitionDuration(500);

    _chart.plotData = function() {
        _chart.g().datum(_chart.group().all());

        var linePath = _chart.g().selectAll("path.line");

        if (linePath.empty())
            linePath = _chart.g().append("path")
                .attr("class", "line");

        var line = d3.svg.line()
            .x(function(d) {
                return _chart.x()(_chart.keyRetriever()(d));
            })
            .y(function(d) {
                return _chart.y()(_chart.valueRetriever()(d));
            });

        var translateByMargins = "translate(" + _chart.margins().left + "," + _chart.margins().top + ")";

        linePath = linePath
            .attr("transform", translateByMargins);

        dc.transition(linePath, _chart.transitionDuration(),
            function(t) {
                t.ease("linear");
            }).attr("d", line);

        if (_renderArea) {
            var areaPath = _chart.g().selectAll("path.area");

            if(areaPath.empty())
                areaPath = _chart.g().append("path")
                    .attr("class", "area")
                    .attr("transform", translateByMargins);

            var area = d3.svg.area()
                .x(line.x())
                .y1(line.y())
                .y0(_chart.y()(0) - AREA_BOTTOM_PADDING);

            dc.transition(areaPath, _chart.transitionDuration(), function(t){
                t.ease("linear");
            }).attr("d", area);
        }
    };

    _chart.renderArea = function(_) {
        if (!arguments.length) return _renderArea;
        _renderArea = _;
        return _chart;
    };

    return _chart.anchor(parent);
};
