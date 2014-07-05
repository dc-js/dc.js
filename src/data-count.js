/**
## Data Count Widget

Includes: [Base Mixin](#base-mixin)

Data count is a simple widget designed to display total number records in the data set vs. the number records selected
by the current filters. Once created data count widget will automatically update the text content of the following elements
under the parent element.

* ".total-count" - total number of records
* ".filter-count" - number of records matched by the current filters

Examples:

* [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)

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
    var SPAN_CLASS = 'data-count-display';
    var _formatNumber = d3.format(",d");
    var _chart = dc.baseMixin({});
    var _html = {some:"",all:""};

    _chart.html = function(s) {
        if (!arguments.length) return _html;
        if(s.all)
            _html.all = s.all;//if one available
        if(s.some)
            _html.some = s.some;//if some available
        return _chart;
    };

    _chart._doRender = function() {
        var tot = _chart.dimension().size(),
            val = _chart.group().value();
        var all = _formatNumber(tot);
        var selected = _formatNumber(val);

        if((tot===val)&&(_html.all!=="")) {
            _chart.root().text(_html.all.replace('%total-count',all).replace('%filter-count',selected));
        }
        else if(_html.some!=="") {
            _chart.root().text(_html.some.replace('%total-count',all).replace('%filter-count',selected));
        } else {
            _chart.selectAll(".total-count").text(all);
            _chart.selectAll(".filter-count").text(selected);
        }
        return _chart;
    };

    _chart._doRedraw = function(){
        return _chart._doRender();
    };

    return _chart.anchor(parent, chartGroup);
};
