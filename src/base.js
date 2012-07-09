dc.baseChart = function(chart) {
    var _dimension;
    var _group;

    var _anchor;
    var _root;

    var width = 0, height = 0;

    var _transitionDuration = 750;

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

    chart.orderedGroup = function(){
        return _group.order(function(p){return p.key;});
    }

    chart.filterAll = function() {
        return chart.filter(null);
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

    chart.generateSvg = function() {
        return chart.root().append("svg")
            .data([chart.group().top(Infinity)])
            .attr("width", chart.width())
            .attr("height", chart.height());
    };

    chart.turnOnReset = function(){
        chart.select("a.reset").style("display", null);
    };

    chart.turnOffReset = function(){
        chart.select("a.reset").style("display", "none");
    };

    chart.transitionDuration = function(d){
        if(!arguments.length) return _transitionDuration;
        _transitionDuration = d;
        return chart;
    }

    // abstract function stub
    chart.filter = function(f){
        // do nothing in base, should be overridden by sub-function
        return chart;
    }

    chart.render = function(){
        // do nothing in base, should be overridden by sub-function
        return chart;
    }

    return chart;
};