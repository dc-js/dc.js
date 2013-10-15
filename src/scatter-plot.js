dc.scatterPlot = function (parent, chartGroup) {
    var _chart = dc.coordinateGridChart({});

    var _locator = function (d) {
        return "translate(" + _chart.x()(_chart.keyAccessor()(d)) + "," + _chart.y()(_chart.valueAccessor()(d)) + ")";
    };

    var _symbolSize = 3;

    _chart.transitionDuration(0); // turn off transition by default for scatterplot

    _chart.plotData = function () {
        var symbols = _chart.chartBodyG().selectAll("circle.symbol")
            .data(_chart.data());

        symbols
            .enter()
        .append("circle")
            .attr("class", "symbol")
            .attr("fill", _chart.getColor(0))
            .attr("transform", _locator);

        dc.transition(symbols, _chart.transitionDuration())
            .attr("transform", _locator)
            .attr("r", _symbolSize);

        dc.transition(symbols.filter(function(d){return _chart.valueAccessor()(d) == 0;}), _chart.transitionDuration())
                    .attr("r", 0).remove(); // remove empty groups

        dc.transition(symbols.exit(), _chart.transitionDuration())
            .attr("r", 0).remove();
    };

    /**
    #### .symbolSize([radius])
    Set or get radius for symbols, default: 3.

    **/
    _chart.symbolSize = function(s){
        if(!arguments.length) return _symbolSize;
        _symbolSize = s;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
