dc.singleSelectionChart = function(_chart) {
    var _filter;

    _chart.hasFilter = function() {
        return _filter != null;
    };

    _chart.filter = function(f) {
        if (!arguments.length) return _filter;

        _filter = f;

        if (_chart.dataAreSet())
            _chart.dimension().filter(_filter);

        if (f) {
            _chart.turnOnControls();
        } else {
            _chart.turnOffControls();
        }

        return _chart;
    };

    _chart.currentFilter = function() {
       return _filter;
    };

    _chart.highlightSelected = function(e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, true);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, false);
    }

    _chart.fadeDeselected = function(e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, false);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, true);
    }

    _chart.resetHighlight = function(e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, false);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, false);
    }

    return _chart;
};
