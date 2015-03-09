/**
## Cap Mixin
Cap is a mixin that groups small data elements below a _cap_ into an *others* grouping for both the
Row and Pie Charts.

The top ordered elements in the group up to the cap amount will be kept in the chart, and the rest
will be replaced with an *others* element, with value equal to the sum of the replaced values. The
keys of the elements below the cap limit are recorded in order to filter by those keys when the
*others* element is clicked.

**/
dc.capMixin = function (_chart) {

    var _cap = Infinity;
    var _capPercent = 0; // By default nothing is limited by percentage

    var _othersLabel = 'Others';

    var _othersGrouper = function (topRows) {
        var topRowsSum = d3.sum(topRows, _chart.valueAccessor()),
            allRows = _chart.group().all(),
            allRowsSum = d3.sum(allRows, _chart.valueAccessor()),
            topKeys = topRows.map(_chart.keyAccessor()),
            allKeys = allRows.map(_chart.keyAccessor()),
            topSet = d3.set(topKeys),
            others = allKeys.filter(function (d) {return !topSet.has(d);});
        if (allRowsSum > topRowsSum) {
            return topRows.concat([{'others': others, 'key': _othersLabel, 'value': allRowsSum - topRowsSum}]);
        }
        return topRows;
    };

    _chart.cappedKeyAccessor = function (d, i) {
        if (d.others) {
            return d.key;
        }
        return _chart.keyAccessor()(d, i);
    };

    _chart.cappedValueAccessor = function (d, i) {
        if (d.others) {
            return d.value;
        }
        return _chart.valueAccessor()(d, i);
    };

    _chart.data(function (group) {
        var topRows = [];

        // Gives an ORDERED set of rows based on cap
        if (_cap === Infinity) {
            topRows = _chart._computeOrderedGroups(group.all());
        } else {
            topRows = group.top(_cap); // ordered by crossfilter group order (default value)
            topRows = _chart._computeOrderedGroups(topRows); // re-order using ordering (default key)
        }

        // Apply percentage cap
        if (_capPercent && _capPercent != 0) {
            var allRowsSum = d3.sum(group.all(), _chart.valueAccessor());

            // Test individual rows to avoid ordering problems
            for (var i = 0; i < topRows.length; i++) {
                var row = topRows[i];

                if (row.value < ((_capPercent / 100) * allRowsSum)) {
                    // Row has failed - remove it
                    topRows.splice(i, 1);
                    i--;
                }
            }
        }

        if ((_capPercent != 0 || _cap != Infinity) && _othersGrouper) return _othersGrouper(topRows);
        return topRows;
    });

    /**
    #### .cap([count])
    Get or set the count of elements to that will be included in the cap.
    **/
    _chart.cap = function (_) {
        if (!arguments.length) {
            return _cap;
        }
        _cap = _;
        return _chart;
    };

    /**
    #### .capPercentage([percent])
    Get or set the minimum percentage (of total data) a group must be to be included in the cap.
    **/
    _chart.capPercentage = function (_) {
        if (!arguments.length) {
            return _capPercent;
        }
        _capPercent = _;
        return _chart;
    };

    /**
    #### .othersLabel([label])
    Get or set the label for *Others* slice when slices cap is specified. Default label is **Others**.
    **/
    _chart.othersLabel = function (_) {
        if (!arguments.length) {
            return _othersLabel;
        }
        _othersLabel = _;
        return _chart;
    };

    /**
    #### .othersGrouper([grouperFunction])
    Get or set the grouper function that will perform the insertion of data for the *Others* slice
    if the slices cap is specified. If set to a falsy value, no others will be added. By default the
    grouper function computes the sum of all values below the cap.
    ```js
    chart.othersGrouper(function (data) {
        // compute the value for others, presumably the sum of all values below the cap
        var othersSum  = yourComputeOthersValueLogic(data)

        // the keys are needed to properly filter when the others element is clicked
        var othersKeys = yourComputeOthersKeysArrayLogic(data);

        // add the others row to the dataset
        data.push({'key': 'Others', 'value': othersSum, 'others': othersKeys });

        return data;
    });
    ```
    **/
    _chart.othersGrouper = function (_) {
        if (!arguments.length) {
            return _othersGrouper;
        }
        _othersGrouper = _;
        return _chart;
    };

    dc.override(_chart, 'onClick', function (d) {
        if (d.others) {
            _chart.filter([d.others]);
        }
        _chart._onClick(d);
    });

    return _chart;
};
