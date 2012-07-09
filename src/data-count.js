dc.dataCount = function(selector){
    var chart = dc.baseChart({});

    chart.render = function(){
        chart.selectAll(".total-count").text(chart.dimension().size());

        return chart;
    };

    dc.registerChart(chart);
    return chart.anchor(selector);
};