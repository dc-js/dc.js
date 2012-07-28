dc.singleSelectionChart = function(chart) {
    var SELECTED_CLASS = "selected";
    var DESELECTED_CLASS = "deselected";

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

    chart.currentFilter = function() { 
       return _filter;
    };

    chart.highlightSelected = function(e) {
        d3.select(e).classed(SELECTED_CLASS, true);
        d3.select(e).classed(DESELECTED_CLASS, false);
    }

    chart.fadeDeselected = function(e) {
        d3.select(e).classed(SELECTED_CLASS, false);
        d3.select(e).classed(DESELECTED_CLASS, true);
    }

    chart.resetHighlight = function(e) {
        d3.select(e).classed(SELECTED_CLASS, false);
        d3.select(e).classed(DESELECTED_CLASS, false);
    }

    return chart;
};
