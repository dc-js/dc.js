/**
## <a name="legend" href="#legend">#</a> Legend [Concrete]
Legend is a attachable widget that can be added to other dc charts to render horizontal legend labels.

```js
chart.legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
```

Examples:
* [Nasdaq 100 Index](http://nickqizhu.github.com/dc.js/)
* [Canadian City Crime Stats](http://nickqizhu.github.com/dc.js/crime/index.html)

**/
dc.legend = function () {
    var LABEL_GAP = 2;

    var _legend = {},
        _parent,
        _x = 0,
        _y = 0,
        _itemHeight = 12,
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

        var itemEnter = _g.selectAll('g.dc-legend-item')
            .data(_parent.legendables())
            .enter()
            .append("g")
            .attr("class", "dc-legend-item")
            .attr("transform", function (d, i) {
                return "translate(0," + i * legendItemHeight() + ")";
            })
            .on("mouseover", function(d){
                    _parent.legendHighlight(d);
            })
            .on("mouseout", function (d) {
                    _parent.legendReset(d);
            });

        itemEnter
            .append("rect")
                .attr("width", _itemHeight)
                .attr("height", _itemHeight)
                .attr("fill", function(d){return d.color;});

        itemEnter.append("text")
                .text(function(d){return d.name;})
                .attr("x", _itemHeight + LABEL_GAP)
                .attr("y", function(){return _itemHeight / 2 + (this.clientHeight?this.clientHeight:13) / 2 - 2;});
    };

    function legendItemHeight() {
        return _gap + _itemHeight;
    }

    /**
    #### .x([value])
    Set or get x coordinate for legend widget. Default value: 0.
    **/
    _legend.x = function (x) {
        if (!arguments.length) return _x;
        _x = x;
        return _legend;
    };

    /**
    #### .y([value])
    Set or get y coordinate for legend widget. Default value: 0.
    **/
    _legend.y = function (y) {
        if (!arguments.length) return _y;
        _y = y;
        return _legend;
    };

    /**
    #### .gap([value])
    Set or get gap between legend items. Default value: 5.
    **/
    _legend.gap = function (gap) {
        if (!arguments.length) return _gap;
        _gap = gap;
        return _legend;
    };

    /**
    #### .itemHeight([value])
    Set or get legend item height. Default value: 12.
    **/
    _legend.itemHeight = function (h) {
        if (!arguments.length) return _itemHeight;
        _itemHeight = h;
        return _legend;
    };

    return _legend;
};
