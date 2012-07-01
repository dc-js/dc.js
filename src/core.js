dc = {
    version: "0.1.0",
    charts: []
};

dc.registerChart = function(chart){
  dc.charts.push(chart);
};

dc.hasChart = function(chart){
    return dc.charts.indexOf(chart) >= 0;
};
