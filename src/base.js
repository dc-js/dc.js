dc.baseMixin = function(chart) {
    var NO_FILTER = null;

    var _dimension;
    var _group;
    var _filter = NO_FILTER;

    var _anchor;
    var _root;

    var width = 0, height = 0;

    chart.dimension = function(d) {
        if (!arguments.length) return _dimension;
        _dimension = d;
        return chart;
    };

    chart.group = function(g) {
        if (!arguments.length) return _group;
        _group = g;
        return chart;
    };

    chart.filter = function(f) {
        if (!arguments.length) return _filter;

        _filter = f;

        if (chart.dataAreSet())
            chart.dimension().filter(_filter);

        return chart;
    };

    chart.filterAll = function() {
        return chart.filter(NO_FILTER);
    };

    chart.hasFilter = function() {
        return _filter != NO_FILTER;
    };

    chart.dataAreSet = function() {
        return _dimension != undefined && _group != undefined;
    };

    chart.select = function(s) {
        return _root.select(s);
    };

    chart.selectAll = function(s) {
        return _root.selectAll(s);
    };

    chart.anchor = function(a) {
        if (!arguments.length) return _anchor;
        _anchor = a;
        _root = d3.select(_anchor);
        return chart;
    };

    chart.root = function(r) {
        if (!arguments.length) return _root;
        _root = r;
        return chart;
    };

    chart.width = function(w) {
        if (!arguments.length) return width;
        width = w;
        return chart;
    };

    chart.height = function(h) {
        if (!arguments.length) return height;
        height = h;
        return chart;
    };

    chart.resetSvg = function() {
        chart.select("svg").remove();
    };

    chart.generateTopLevelG = function() {
        return chart.root().append("svg")
            .data([chart.group().all()])
            .attr("width", chart.width())
            .attr("height", chart.height())
            .append("g");
    };

    return chart;
};