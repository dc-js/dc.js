dc.barChart = function(selector) {

    var chart = dc.baseMixin({});

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            var topG = chart.generateTopLevelG();
        }
    };

    dc.registerChart(chart);

    return chart.anchor(selector);
};
