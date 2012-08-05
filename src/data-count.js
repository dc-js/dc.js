dc.dataCount = function(_parent) {
    var _formatNumber = d3.format(",d");
    var _chart = dc.baseChart({});

    _chart.render = function() {
        _chart.selectAll(".total-count").text(_formatNumber(_chart.dimension().size()));
        _chart.selectAll(".filter-count").text(_formatNumber(_chart.group().value()));

        _chart.invokeRenderlet(_chart);

        return _chart;
    };

    _chart.redraw = function(){
        return _chart.render();
    };

    return _chart.anchor(_parent);
};
