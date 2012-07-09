dc.dataCount = function(selector){
    var chart = dc.baseChart({});


    dc.registerChart(chart);

    return chart.anchor(selector);
};