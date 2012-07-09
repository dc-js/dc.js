dc.dataCount = function(selector) {
    var formatNumber = d3.format(",d");
    var chart = dc.baseChart({});

    chart.render = function() {
        chart.selectAll(".total-count").text(formatNumber(chart.dimension().size()));
        chart.selectAll(".filter-count").text(formatNumber(chart.group().value()));

        return chart;
    };

    chart.redraw = function(){
        return chart.render();
    };

    dc.registerChart(chart);
    return chart.anchor(selector);
};