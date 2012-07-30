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
            chart.turnOnControls();
        } else {
            chart.turnOffControls();
        }

        return chart;
    };

    chart.currentFilter = function() { 
       return _filter;
    };

    chart.highlightSelected = function(e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, true);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, false);
    }

    chart.fadeDeselected = function(e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, false);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, true);
    }

    chart.resetHighlight = function(e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, false);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, false);
    }

    return chart;
};
