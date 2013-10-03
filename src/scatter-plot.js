dc.scatterPlot = function (parent, chartGroup) {
    var _chart = dc.coordinateGridChart({});

    _chart.plotData = function(){
        _chart.chartBodyG().selectAll("path.dc-symbol")
                .data(_chart.data())
            .enter()
            .append("path")
            .attr("class", "dc-symbol")
            .attr("transform", function(d){
                return "translate("+_chart.x()(_chart.keyAccessor()(d))+","+_chart.y()(_chart.valueAccessor()(d))+")";
            })
            .attr("d", d3.svg.symbol());
    };

    return _chart.anchor(parent, chartGroup);
};
