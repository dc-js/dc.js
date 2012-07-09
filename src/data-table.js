dc.dataTable = function(selector) {
    var chart = dc.baseChart({});

    chart.render = function() {
        return chart;
    };

    chart.redraw = function(){
        return chart.render();
    };

    dc.registerChart(chart);
    return chart.anchor(selector);
};