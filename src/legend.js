dc.legend = function () {
    var LABEL_GAP = 2;

    var _legend = {},
        _parent,
        _x = 0,
        _y = 0,
        _gap = 5;

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

        var itemPosition = 0;

        _parent.legendables().forEach(function (e) {
            console.log(e);

            var itemG = _g.append("g")
                .attr("class", "dc-legend-item")
                .attr("transform", "translate(" + [0, itemPosition] + ")");

            var text = itemG.append("text").text(e.name);

            itemG.append("rect")
                .attr("width", textHeight(text))
                .attr("height", textHeight(text))
                .attr("fill", e.color);

            text.attr("x", textHeight(text) + LABEL_GAP)
                .attr("y", textHeight(text));

            itemPosition += legendItemHeight(text);
        });
    };

    function textHeight(text) {
        return text.node().clientHeight;
    }

    function legendItemHeight(text) {
        return _gap + textHeight(text);
    }

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
