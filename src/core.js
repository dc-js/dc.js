/**
#### Version %VERSION%

The entire dc.js library is scoped under **dc** name space. It does not introduce anything else into the global
name space.

* [Base Chart [abstract]](#base-chart)
* [Color Chart [abstract]](#color-chart)
* [Stackable Chart [abstract]](#stackable-chart)
* [Coordinate Grid Chart [abstract] < Color Chart < Base Chart](#coordinate-grid-chart)
* [Pie Chart [concrete] < Color Chart < Base Chart](#pie-chart)
* [Row Chart [concrete] < Color Chart < Base chart](#row-chart)
* [Bar Chart [concrete] < Stackable Chart < CoordinateGrid Chart](#bar-chart)
* [Line Chart [concrete] < Stackable Chart < CoordinateGrid Chart](#line-chart)
* [Composite Chart [concrete] < CoordinateGrid Chart](#composite-chart)
* [Abstract Bubble Chart [abstract] < Color Chart](#abstract-bubble-chart)
* [Bubble Chart [concrete] < Abstract Bubble Chart < CoordinateGrid Chart](#bubble-chart)
* [Bubble Overlay Chart [concrete] < Abstract Bubble Chart < Base Chart](#bubble-overlay-chart)
* [Geo Choropleth Chart [concrete] < Color Chart < Base Chart](#geo-choropleth-chart)
* [Data Count Widget [concrete] < Base Chart](#data-count)
* [Data Table Widget [concrete] < Base Chart](#data-table)
* [Number Display [Concrete] < Base Chart](#number-display)
* [Legend [concrete]](#legend)
* [Listeners](#listeners)
* [Utilities](#util)

#### Function Chain
Majority of dc functions are designed to allow function chaining, meaning it will return the current chart instance
whenever it is appropriate. Therefore configuration of a chart can be written in the following style.
```js
chart.width(300)
    .height(300)
    .filter("sunday")
```
The API references will highlight the fact if a particular function is not chainable.

**/
var dc = {
    version: "%VERSION%",
    constants: {
        CHART_CLASS: "dc-chart",
        DEBUG_GROUP_CLASS: "debug",
        STACK_CLASS: "stack",
        DESELECTED_CLASS: "deselected",
        SELECTED_CLASS: "selected",
        NODE_INDEX_NAME: "__index__",
        GROUP_INDEX_NAME: "__group_index__",
        DEFAULT_CHART_GROUP: "__default_chart_group__",
        EVENT_DELAY: 40,
        NEGLIGIBLE_NUMBER: 1e-10
    },
    _renderlet: null
};

dc.chartRegistry = function() {
    // chartGroup:string => charts:array
    var _chartMap = {};

    function initializeChartGroup(group) {
        if (!group)
            group = dc.constants.DEFAULT_CHART_GROUP;

        if (!_chartMap[group])
            _chartMap[group] = [];

        return group;
    }

    return {
        has: function(chart) {
            for (var e in _chartMap) {
                if (_chartMap[e].indexOf(chart) >= 0)
                    return true;
            }
            return false;
        },

        register: function(chart, group) {
            group = initializeChartGroup(group);
            _chartMap[group].push(chart);
        },

        clear: function() {
            _chartMap = {};
        },

        list: function(group) {
            group = initializeChartGroup(group);
            return _chartMap[group];
        }
    };
}();

dc.registerChart = function(chart, group) {
    dc.chartRegistry.register(chart, group);
};

dc.hasChart = function(chart) {
    return dc.chartRegistry.has(chart);
};

dc.deregisterAllCharts = function() {
    dc.chartRegistry.clear();
};

/**
## <a name="util" href="#util">#</a> Utilities
**/

/**
#### dc.filterAll([chartGroup])
Clear all filters on every chart within the given chart group. If the chart group is not given then only charts that
belong to the default chart group will be reset.
**/
dc.filterAll = function(group) {
    var charts = dc.chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].filterAll();
    }
};

/**
#### dc.renderAll([chartGroup])
Re-render all charts belong to the given chart group. If the chart group is not given then only charts that belong to
 the default chart group will be re-rendered.
**/
dc.renderAll = function(group) {
    var charts = dc.chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].render();
    }

    if(dc._renderlet !== null)
        dc._renderlet(group);
};

/**
#### dc.redrawAll([chartGroup])
Redraw all charts belong to the given chart group. If the chart group is not given then only charts that belong to the
  default chart group will be re-drawn. Redraw is different from re-render since when redrawing dc charts try to update
  the graphic incrementally instead of starting from scratch.
**/
dc.redrawAll = function(group) {
    var charts = dc.chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].redraw();
    }

    if(dc._renderlet !== null)
        dc._renderlet(group);
};

dc.transition = function(selections, duration, callback) {
    if (duration <= 0 || duration === undefined)
        return selections;

    var s = selections
        .transition()
        .duration(duration);

    if (callback instanceof Function) {
        callback(s);
    }

    return s;
};

dc.units = {};

/**
#### dc.units.integers
This function can be used to in [Coordinate Grid Chart](#coordinate-grid-chart) to define units on x axis.
dc.units.integers is the default x unit scale used by [Coordinate Grid Chart](#coordinate-grid-chart) and should be
used when x range is a sequential of integers.

**/
dc.units.integers = function(s, e) {
    return Math.abs(e - s);
};

/**
#### dc.units.ordinal
This function can be used to in [Coordinate Grid Chart](#coordinate-grid-chart) to define ordinal units on x axis.
Usually this function is used in combination with d3.scale.ordinal() on x axis.
**/
dc.units.ordinal = function(s, e, domain){
    return domain;
};

/**
#### dc.units.fp.precision(precision)
This function generates xunit function in floating-point numbers with the given precision. For example if the function
is invoked with 0.001 precision then the function created will devide a range [0.5, 1.0] with 500 units.

**/
dc.units.fp = {};
dc.units.fp.precision = function(precision){
    var _f = function(s, e){
        var d = Math.abs((e-s)/_f.resolution);
        if(dc.utils.isNegligible(d - Math.floor(d)))
            return Math.floor(d);
        else
            return Math.ceil(d);
    };
    _f.resolution = precision;
    return _f;
};

dc.round = {};
dc.round.floor = function(n) {
    return Math.floor(n);
};
dc.round.ceil = function(n) {
    return Math.ceil(n);
};
dc.round.round = function(n) {
    return Math.round(n);
};

dc.override = function(obj, functionName, newFunction) {
    var existingFunction = obj[functionName];
    obj["_" + functionName] = existingFunction;
    obj[functionName] = newFunction;
};

dc.renderlet = function(_){
    if(!arguments.length) return dc._renderlet;
    dc._renderlet = _;
    return dc;
};

dc.instanceOfChart = function (o) {
    return o instanceof Object && o.__dc_flag__;
};
