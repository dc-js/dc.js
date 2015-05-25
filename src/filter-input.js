/**
## input Filter Widget
Includes: [Base Mixin](#base-mixin)

The input filter data widget is a simple widget designed to display an input field allowing to filter the data
that matches the text typed. 

As opposed to the other graphs, this doesn't display any result and doesn't update its display, it's just to input an filter other graphs

Examples:

#### dc.inputFilter(parent[, chartGroup])
Create an input widget and attach it to the given parent element.

Parameters:

* parent : string | node | selection - any valid
 [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 a dom block element such as a div; or a dom element or d3 selection.
* chartGroup : string (optional) - name of the chart group this widget should be placed in.

Returns:
A newly created input widget instance
#### .dimension(data) - **mandatory**

```js
var data=[{"firstname":"John","lastname":"Coltrane"}{"firstname":"Miles",lastname:"Davis"] 
var ndx = crossfilter(data);
var dimension = ndx.dimension(function(d) {
  return d.lastname.toLowerCase() + " "+ d.firstname.toLowerCase();
});

dc.inputFilter('.search')
    .dimension(dimension);
    // you don't need the group() function
```

**/

dc.inputFilter = function (parent, chartGroup) {
    var _chart = dc.baseMixin({});
    var _html = function() {return "<input class='form-control input-lg' placeholder='search'/>"};
    var _normalize = function (s) { return s.toLowerCase()};
    var _filterFunction = function(q) { 
      _chart.dimension().filterFunction(function (d){return d.indexOf (q) !== -1;});
    };
    var _throttleDuration=200;
    var _throttleTimer;

    _chart.group(function (){throw "the group function on inputFilter should never be called, please report the issue"});

    _chart._doRender = function () {
      _chart.root().html(_html());

      _chart.root().selectAll("input").on("input", function() {
        _filterFunction(_normalize(this.value));
        _throttle();
      });
      return _chart;
    };

    function _throttle() {
      window.clearTimeout(_throttleTimer);
      _throttleTimer = window.setTimeout(function() {
          dc.redrawAll();
      }, _throttleDuration);
    }

    _chart._doRedraw = function () {
      return _chart;
    };

    _chart.html = function (s) {
        if (!arguments.length) {
            return _html;
        }
        if (typeof s == "string")
          _html = function (){return s};
        else
          _html = s;
        return _chart;
    };

    _chart.normalize = function (s) {
        if (!arguments.length) {
            return _normalize;
        }
        _normalize = s;
        return _chart;
    };

    _chart.filterFunction = function (s) {
        if (!arguments.length) {
            return _filterFunction;
        }
        _filterFunction = s;
        return _chart;
    };

    _chart.throttle = function (s) {
        if (!arguments.length) {
            return _throttleDuration;
        }
        _throttleDuration = s;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
