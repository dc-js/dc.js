/**
## <a name="data-count" href="#data-count">#</a> Data Count Widget [Concrete] < [Base Chart](#base-chart)
Data count is a simple widget designed to display total number records in the data set vs. the number records selected
by the current filters. Once created data count widget will automatically update the text content of the following elements
under the parent element.

* ".total-count" - total number of records
* ".filter-count" - number of records matched by the current filters

Examples:

* [Nasdaq 100 Index](http://nickqizhu.github.com/dc.js/)

#### dc.dataCount(parent[, chartGroup])
Create a data count widget instance and attach it to the given parent element.

Parameters:

* parent : string - any valid d3 single selector representing typically a dom block element such as a div.
* chartGroup : string (optional) - name of the chart group this chart instance should be placed in. Once a chart is placed
   in a certain chart group then any interaction with such instance will only trigger events and redraw within the same
   chart group.

Return:
A newly created data count widget instance

#### .dimension(allData) - **mandatory**
For data count widget the only valid dimension is the entire data set.

#### .group(groupAll) - **mandatory**
For data count widget the only valid group is the all group.

```js
var ndx = crossfilter(data);
var all = ndx.groupAll();

dc.dataCount(".dc-data-count")
    .dimension(ndx)
    .group(all);
```

**/
dc.dataCount = function(parent, chartGroup) {
    var _formatNumber = d3.format(",d");
    var _chart = dc.baseChart({});

    _chart.doRender = function() {
        _chart.selectAll(".total-count").text(_formatNumber(_chart.dimension().size()));
        _chart.selectAll(".filter-count").text(_formatNumber(_chart.group().value()));

        return _chart;
    };

    _chart.doRedraw = function(){
        return _chart.doRender();
    };

    return _chart.anchor(parent, chartGroup);
};
