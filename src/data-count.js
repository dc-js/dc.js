/**
## Data Count Widget
Includes: [Base Mixin](#base-mixin)

The data count widget is a simple widget designed to display the number of records selected by the
current filters out of the total number of records in the data set. Once created the data count widget
will automatically update the text content of the following elements under the parent element.

* '.total-count' - total number of records
* '.filter-count' - number of records matched by the current filters

Examples:

* [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)
#### dc.dataCount(parent[, chartGroup])
Create a data count widget and attach it to the given parent element.

Parameters:

* parent : string | node | selection - any valid
 [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 a dom block element such as a div; or a dom element or d3 selection.
* chartGroup : string (optional) - name of the chart group this widget should be placed in.
 The data count widget will only react to filter changes in the chart group.

Returns:
A newly created data count widget instance
#### .dimension(allData) - **mandatory**
For the data count widget the only valid dimension is the entire data set.
#### .group(groupAll) - **mandatory**
For the data count widget the only valid group is the group returned by `dimension.groupAll()`.

```js
var ndx = crossfilter(data);
var all = ndx.groupAll();

dc.dataCount('.dc-data-count')
    .dimension(ndx)
    .group(all);
```

**/
dc.dataCount = function (parent, chartGroup) {
    var _formatNumber = d3.format(',d');
    var _chart = dc.baseMixin({});
    var _html = {some:'', all:''};

    /**
     #### html([object])
     Gets or sets an optional object specifying HTML templates to use depending how many items are
     selected. The text `%total-count` will replaced with the total number of records, and the text
     `%filter-count` will be replaced with the number of selected records.
     - all: HTML template to use if all items are selected
     - some: HTML template to use if not all items are selected

     ```js
     counter.html({
         some: '%filter-count out of %total-count records selected',
         all: 'All records selected. Click on charts to apply filters'
     })
     ```
     **/
    _chart.html = function (s) {
        if (!arguments.length) {
            return _html;
        }
        if (s.all) {
            _html.all = s.all;
        }
        if (s.some) {
            _html.some = s.some;
        }
        return _chart;
    };

    /**
    #### formatNumber([formatter])
    Gets or sets an optional function to format the filter count and total count.

    ```js
    counter.formatNumber(d3.format('.2g'))
    ```
    **/
    _chart.formatNumber = function (s) {
        if (!arguments.length) {
            return _formatNumber;
        }
        _formatNumber = s;
        return _chart;
    };

    _chart._doRender = function () {
        var tot = _chart.dimension().size(),
            val = _chart.group().value();
        var all = _formatNumber(tot);
        var selected = _formatNumber(val);

        if ((tot === val) && (_html.all !== '')) {
            _chart.root().html(_html.all.replace('%total-count', all).replace('%filter-count', selected));
        } else if (_html.some !== '') {
            _chart.root().html(_html.some.replace('%total-count', all).replace('%filter-count', selected));
        } else {
            _chart.selectAll('.total-count').text(all);
            _chart.selectAll('.filter-count').text(selected);
        }
        return _chart;
    };

    _chart._doRedraw = function () {
        return _chart._doRender();
    };

    return _chart.anchor(parent, chartGroup);
};
