dc.scatterPlot = function (parent, chartGroup) {
    var _chart = dc.coordinateGridChart({});

    var _locator = function (d) {
        return "translate(" + _chart.x()(_chart.keyAccessor()(d)) + "," + _chart.y()(_chart.valueAccessor()(d)) + ")";
    };

    _chart.plotData = function () {
        var symbols = _chart.chartBodyG().selectAll("circle.symbol")
            .data(_chart.data());

        symbols
            .enter()
        .append("circle")
            .attr("class", "symbol")
            .attr("transform", _locator);

        dc.transition(symbols, _chart.transitionDuration(), function (symbols) {
            symbols.attr("transform", _locator)
                .attr("r", 3);
        });

        dc.transition(symbols.exit(), _chart.transitionDuration(), function (symbols) {
            symbols.attr("r", 0).remove();
        });
    };

    return _chart.anchor(parent, chartGroup);
};
