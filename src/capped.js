dc.capped = function (_chart) {

    var _cap = Infinity;

    var _othersLabel = "Others";

    var _othersGrouper = function (topRows) {
        var topRowsSum = d3.sum(topRows, _chart.valueAccessor()),
            allRows = _chart.group().all(),
            allRowsSum = d3.sum(allRows, _chart.valueAccessor()),
            topKeys = topRows.map(_chart.keyAccessor()),
            allKeys = allRows.map(_chart.keyAccessor()),
            topSet = d3.set(topKeys),
            others = allKeys.filter(function(d){return !topSet.has(d);});
        topRows.push({"others": others,"key": _othersLabel, "value": allRowsSum - topRowsSum });
    };

    _chart.assembleCappedData = function() {
        if (_cap == Infinity) {
            return _chart.computeOrderedGroups();
        } else {
            var topRows = _chart.group().top(_cap); // ordered by value
            topRows = _chart.computeOrderedGroups(topRows); // re-order by key
            if (_othersGrouper) _othersGrouper(topRows);
            return topRows;
        }
    };

    _chart.cap = function (_) {
        if (!arguments.length) return _cap;
        _cap = _;
        return _chart;
    };

    _chart.othersLabel = function (_) {
        if (!arguments.length) return _othersLabel;
        _othersLabel = _;
        return _chart;
    };

    // if set to falsy value, no others row will be added
    _chart.othersGrouper = function (_) {
        if (!arguments.length) return _othersGrouper;
        _othersGrouper = _;
        return _chart;
    };

    dc.override(_chart, "onClick", function (d) {
        if (d.others)
            d.others.forEach(function(f) {
                _chart.filter(f);
            });
        _chart._onClick(d);
    });

    return _chart;
};
