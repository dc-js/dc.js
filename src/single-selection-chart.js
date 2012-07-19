dc.singleSelectionChart = function(chart) {
    var _filter;

    chart.hasFilter = function() {
        return _filter != null;
    };

    chart.filter = function(f) {
        if (!arguments.length) return _filter;

        _filter = f;

        if (chart.dataAreSet())
            chart.dimension().filter(_filter);

        if (f) {
            chart.turnOnReset();
        } else {
            chart.turnOffReset();
        }

        return chart;
    };

    return chart;
};
