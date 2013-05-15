dc.selectableChart = function (_chart) {
    var _filters = [];
    var _filterHandler = function (dimension, filters) {
        if (filters.length == 0)
            dimension.filter(null);
        else
            dimension.filter(filters[0]);

        return filters;
    };

    _chart.hasFilter = function (filter) {
        if (!arguments.length) return _filters.length > 0;
        return _filters.indexOf(filter) >= 0;
    };

    function removeFilter(_) {
        _filters.splice(_filters.indexOf(_), 1);
    }

    function addFilter(_) {
        _filters.push(_);
    }

    function resetFilters() {
        _filters = [];
    }

    _chart.filter = function (_) {
        if (!arguments.length) return _filters.length > 0 ? _filters[0] : null;

        if (_ == null) {
            resetFilters();
        } else {
            if (_chart.hasFilter(_))
                removeFilter(_);
            else
                addFilter(_);
        }

        if (_chart.dataSet() && _chart.dimension().filter != undefined) {
            var fs = _filterHandler(_chart.dimension(), _filters);
            _filters = fs ? fs : _filters;
        }

        _chart.invokeFilteredListener(_chart, _);

        if (_chart.hasFilter()) {
            _chart.turnOnControls();
        } else {
            _chart.turnOffControls();
        }

        dc.redrawAll(_chart.chartGroup());

        return _chart;
    };

    _chart.filters = function () {
        return _filters;
    };

    _chart.highlightSelected = function (e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, true);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, false);
    };

    _chart.fadeDeselected = function (e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, false);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, true);
    };

    _chart.resetHighlight = function (e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, false);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, false);
    };

    _chart.onClick = function (d) {
        var filter = _chart.keyAccessor()(d);
        dc.events.trigger(function () {
            _chart.filter(filter);
        });
    };

    _chart.filterHandler = function (_) {
        if (!arguments.length) return _filterHandler;
        _filterHandler = _;
        return _chart;
    };

    return _chart;
};
