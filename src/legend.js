dc.legend = function () {
    var _legend = {},
        _parent,
        _x = 0,
        _y = 0,
        _gap = 3;

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

        var itemHeight, itemPosition = 0;

        _parent.legendables().forEach(function (e) {
            var itemG = _g.append("g")
                .attr("class", "dc-legend-item")
                .attr("transform", "translate("+[0, itemPosition]+")");
            var text = itemG
                .append("text")
                .text(e.name);

            itemHeight = _gap + text.node().clientHeight;
            itemPosition += itemHeight;
        });
    };

    _legend.x = function (x) {
        if (!arguments.length) return _x;
        _x = x;
        return _legend;
    };

    _legend.y = function (y) {
        if (!arguments.length) return _y;
        _y = y;
        return _legend;
    };

    _legend.gap = function (gap) {
        if (!arguments.length) return _gap;
        _gap = gap;
        return _legend;
    };

    return _legend;
};
