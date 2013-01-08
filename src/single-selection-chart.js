dc.singleSelectionChart = function(_chart) {
    var _filter;

    _chart.hasFilter = function() {
        return _filter != null;
    };

    _chart.filter = function(_) {
        if (!arguments.length) return _filter;

        _filter = _;

        if (_chart.dataAreSet() && _chart.dimension() != undefined)
            _chart.dimension().filter(_filter);

        if (_) {
            _chart.turnOnControls();
        } else {
            _chart.turnOffControls();
        }

        return _chart;
    };

    _chart.highlightSelected = function(e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, true);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, false);
    };

    _chart.fadeDeselected = function(e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, false);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, true);
    };

    _chart.resetHighlight = function(e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, false);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, false);
    };

    _chart.onClick = function(d) {
        var toFilter = _chart.keyAccessor()(d);
        if (toFilter == _chart.filter()) {
            dc.events.trigger(function() {
                _chart.filter(null);
                dc.redrawAll(_chart.chartGroup());
            });
        } else {
            dc.events.trigger(function() {
                _chart.filter(toFilter);
                dc.redrawAll(_chart.chartGroup());
            });
        }
    };

    return _chart;
};
