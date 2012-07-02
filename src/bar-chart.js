dc.barChart = function(selector) {

    var chart = dc.baseMixin({});

    var margin = {top: 10, right: 50, bottom: 20, left: 5};

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            var topG = chart.generateTopLevelG().attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }
    };

    chart.margins = function(m) {
        if (!arguments.length) return margin;
        margin = m;
        return chart;
    }

    dc.registerChart(chart);

    return chart.anchor(selector);
};
