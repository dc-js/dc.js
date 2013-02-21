dc.singleSelectionChart = function(_chart) {
    var _filter;
    var _filterHandler = function(dimension, filter){
        dimension.filter(filter);
        return filter;
    };

    _chart.hasFilter = function() {
        return _filter != null;
    };

    _chart.filter = function(_) {
        if (!arguments.length) return _filter;

        _filter = _;

        if (_chart.dataSet() && _chart.dimension().filter != undefined){
            var f = _filterHandler(_chart.dimension(), _filter);
            _filter = f?f:_filter;
        }

        if (_) {
            _chart.turnOnControls();
        } else {
            _chart.turnOffControls();
        }

        _chart.invokeFilteredListener(_chart, _);

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
        dc.events.trigger(function() {
            _chart.filterTo(toFilter == _chart.filter() ? null : toFilter);
        });
    };

    _chart.filterTo = function(toFilter) {
        _chart.filter(toFilter);
        dc.redrawAll(_chart.chartGroup());
    };

    _chart.filterHandler = function(_){
        if(!arguments.length) return _filterHandler;
        _filterHandler = _;
        return _chart;
    };

    return _chart;
};
