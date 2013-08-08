dc.legend = function () {
    var _legend = {},
        _parent,
        _x = 0,
        _y = 0;

    var _g;

    _legend.parent = function (p) {
        if (!arguments.length) return _parent;
        _parent = p;
        return _legend;
    };

    _legend.render = function () {
        _g = _parent.svg().append("g")
            .attr("class", "dc-legend")
            .attr("transform", "translate(" + _x + "," + _y + ")");

        _parent.legendables().forEach(function (e) {
            console.log(e);
            _g.append("g")
                .attr("class", "dc-legend-item");
        });
    };

    _legend.x = function (x) {
        if (!arguments.length) return _x;
        _x = x;
        return _chart;
    };

    _legend.y = function (y) {
        if (!arguments.length) return _y;
        _y = y;
        return _chart;
    };

    return _legend;
};
