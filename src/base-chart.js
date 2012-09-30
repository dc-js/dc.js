dc.baseChart = function(_chart) {
    _chart.__dc_flag__ = true;

    var _dimension;
    var _group;

    var _anchor;
    var _root;
    var _svg;

    var _width = 200, _height = 200;

    var _keyAccessor = function(d) {
        return d.key;
    };
    var _valueAccessor = function(d) {
        return d.value;
    };

    var _label = function(d) {
        return d.key;
    };
    var _renderLabel = false;

    var _title = function(d) {
        return d.key + ": " + d.value;
    };
    var _renderTitle = false;

    var _transitionDuration = 750;

    var _filterPrinter = dc.printers.filter;

    var _renderlets = [];

    var _chartGroup = dc.constants.DEFAULT_CHART_GROUP;

    _chart.dimension = function(d) {
        if (!arguments.length) return _dimension;
        _dimension = d;
        return _chart;
    };

    _chart.group = function(g) {
        if (!arguments.length) return _group;
        _group = g;
        return _chart;
    };

    _chart.orderedGroup = function() {
        return _group.order(function(p) {
            return p.key;
        });
    };

    _chart.filterAll = function() {
        return _chart.filter(null);
    };

    _chart.dataAreSet = function() {
        return _dimension != undefined && _group != undefined;
    };

    _chart.select = function(s) {
        return _root.select(s);
    };

    _chart.selectAll = function(s) {
        return _root.selectAll(s);
    };

    _chart.anchor = function(a, chartGroup) {
        if (!arguments.length) return _anchor;
        if (dc.instanceOfChart(a)) {
            _anchor = a.anchor();
            _root = a.root();
        } else {
            _anchor = a;
            _root = d3.select(_anchor);
            _root.classed(dc.constants.CHART_CLASS, true);
            dc.registerChart(_chart, chartGroup);
        }
        _chartGroup = chartGroup;
        return _chart;
    };

    _chart.root = function(r) {
        if (!arguments.length) return _root;
        _root = r;
        return _chart;
    };

    _chart.width = function(w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };

    _chart.height = function(h) {
        if (!arguments.length) return _height;
        _height = h;
        return _chart;
    };

    _chart.svg = function(_) {
        if (!arguments.length) return _svg;
        _svg = _;
        return _chart;
    };

    _chart.resetSvg = function() {
        _chart.select("svg").remove();
        return _chart.generateSvg();
    };

    _chart.generateSvg = function() {
        _svg = _chart.root().append("svg")
            .attr("width", _chart.width())
            .attr("height", _chart.height());
        return _svg;
    };

    _chart.filterPrinter = function(_) {
        if (!arguments.length) return _filterPrinter;
        _filterPrinter = _;
        return _chart;
    };

    _chart.turnOnControls = function() {
        _chart.selectAll(".reset").style("display", null);
        _chart.selectAll(".filter").text(_filterPrinter(_chart.filter())).style("display", null);
    };

    _chart.turnOffControls = function() {
        _chart.selectAll(".reset").style("display", "none");
        _chart.selectAll(".filter").style("display", "none").text(_chart.filter());
    };

    _chart.transitionDuration = function(d) {
        if (!arguments.length) return _transitionDuration;
        _transitionDuration = d;
        return _chart;
    };

    _chart.render = function() {
        if(_dimension == null)
            throw new dc.errors.InvalidStateException("Mandatory attribute chart.dimension is missing on chart["
                + _chart.anchor() + "]");

        if (_group == null)
            throw new dc.errors.InvalidStateException("Mandatory attribute chart.group is missing on chart["
                + _chart.anchor() + "]");

        var result = _chart.doRender();

        _chart.invokeRenderlet(_chart);

        return result;
    };

    _chart.redraw = function() {
        var result = _chart.doRedraw();

        _chart.invokeRenderlet(_chart);

        return result;
    };

    // abstract function stub
    _chart.filter = function(f) {
        // do nothing in base, should be overridden by sub-function
        return _chart;
    };

    _chart.doRender = function() {
        // do nothing in base, should be overridden by sub-function
        return _chart;
    };

    _chart.doRedraw = function() {
        // do nothing in base, should be overridden by sub-function
        return _chart;
    };

    _chart.keyAccessor = function(_) {
        if (!arguments.length) return _keyAccessor;
        _keyAccessor = _;
        return _chart;
    };

    _chart.valueAccessor = function(_) {
        if (!arguments.length) return _valueAccessor;
        _valueAccessor = _;
        return _chart;
    };

    _chart.label = function(_) {
        if (!arguments.length) return _label;
        _label = _;
        _renderLabel = true;
        return _chart;
    };

    _chart.renderLabel = function(_) {
        if (!arguments.length) return _renderLabel;
        _renderLabel = _;
        return _chart;
    };

    _chart.title = function(_) {
        if (!arguments.length) return _title;
        _title = _;
        _renderTitle = true;
        return _chart;
    };

    _chart.renderTitle = function(_) {
        if (!arguments.length) return _renderTitle;
        _renderTitle = _;
        return _chart;
    };

    _chart.renderlet = function(_) {
        _renderlets.push(_);
        return _chart;
    };

    _chart.invokeRenderlet = function(chart) {
        for (var i = 0; i < _renderlets.length; ++i) {
            _renderlets[i](chart);
        }
    };

    _chart.chartGroup = function(_) {
        if (!arguments.length) return _chartGroup;
        _chartGroup = _;
        return _chart;
    };

    return _chart;
};
