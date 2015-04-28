/**
#### Version %VERSION%
The entire dc.js library is scoped under the **dc** name space. It does not introduce anything else
into the global name space.
#### Function Chaining
Most dc functions are designed to allow function chaining, meaning they return the current chart
instance whenever it is appropriate. This way chart configuration can be written in the following
style:
```js
chart.width(300)
    .height(300)
    .filter('sunday')
```
The getter forms of functions do not participate in function chaining because they necessarily
return values that are not the chart.  (Although some, such as `.svg` and `.xAxis`, return values
that are chainable d3 objects.)

**/

/*jshint -W062*/
/*jshint -W079*/
var dc = {
    version: '%VERSION%',
    constants: {
        CHART_CLASS: 'dc-chart',
        DEBUG_GROUP_CLASS: 'debug',
        STACK_CLASS: 'stack',
        DESELECTED_CLASS: 'deselected',
        SELECTED_CLASS: 'selected',
        NODE_INDEX_NAME: '__index__',
        GROUP_INDEX_NAME: '__group_index__',
        DEFAULT_CHART_GROUP: '__default_chart_group__',
        EVENT_DELAY: 40,
        NEGLIGIBLE_NUMBER: 1e-10
    },
    _renderlet: null
};

dc.chartRegistry = function () {
    // chartGroup:string => charts:array
    var _chartMap = {};

    function initializeChartGroup(group) {
        if (!group) {
            group = dc.constants.DEFAULT_CHART_GROUP;
        }

        if (!_chartMap[group]) {
            _chartMap[group] = [];
        }

        return group;
    }

    return {
        has: function (chart) {
            for (var e in _chartMap) {
                if (_chartMap[e].indexOf(chart) >= 0) {
                    return true;
                }
            }
            return false;
        },

        register: function (chart, group) {
            group = initializeChartGroup(group);
            _chartMap[group].push(chart);
        },

        deregister: function (chart, group) {
            group = initializeChartGroup(group);
            for (var i = 0; i < _chartMap[group].length; i++) {
                if (_chartMap[group][i].anchorName() === chart.anchorName()) {
                    _chartMap[group].splice(i, 1);
                    break;
                }
            }
        },

        clear: function (group) {
            if (group) {
                delete _chartMap[group];
            } else {
                _chartMap = {};
            }
        },

        list: function (group) {
            group = initializeChartGroup(group);
            return _chartMap[group];
        }
    };
}();
/*jshint +W062 */
/*jshint +W079*/

dc.registerChart = function (chart, group) {
    dc.chartRegistry.register(chart, group);
};

dc.deregisterChart = function (chart, group) {
    dc.chartRegistry.deregister(chart, group);
};

dc.hasChart = function (chart) {
    return dc.chartRegistry.has(chart);
};

dc.deregisterAllCharts = function (group) {
    dc.chartRegistry.clear(group);
};

/**
## Utilities
**/

/**
#### dc.filterAll([chartGroup])
Clear all filters on all charts within the given chart group. If the chart group is not given then
only charts that belong to the default chart group will be reset.
**/
dc.filterAll = function (group) {
    var charts = dc.chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].filterAll();
    }
};

/**
#### dc.refocusAll([chartGroup])
Reset zoom level / focus on all charts that belong to the given chart group. If the chart group is
not given then only charts that belong to the default chart group will be reset.
**/
dc.refocusAll = function (group) {
    var charts = dc.chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        if (charts[i].focus) {
            charts[i].focus();
        }
    }
};

/**
#### dc.renderAll([chartGroup])
Re-render all charts belong to the given chart group. If the chart group is not given then only
charts that belong to the default chart group will be re-rendered.
**/
dc.renderAll = function (group) {
    var charts = dc.chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].render();
    }

    if (dc._renderlet !== null) {
        dc._renderlet(group);
    }
};

/**
#### dc.redrawAll([chartGroup])
Redraw all charts belong to the given chart group. If the chart group is not given then only charts
that belong to the default chart group will be re-drawn. Redraw is different from re-render since
when redrawing dc tries to update the graphic incrementally, using transitions, instead of starting
from scratch.
**/
dc.redrawAll = function (group) {
    var charts = dc.chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].redraw();
    }

    if (dc._renderlet !== null) {
        dc._renderlet(group);
    }
};

/**
#### dc.disableTransitions
If this boolean is set truthy, all transitions will be disabled, and changes to the charts will happen
immediately.  Default: false
**/
dc.disableTransitions = false;

dc.transition = function (selections, duration, callback) {
    if (duration <= 0 || duration === undefined || dc.disableTransitions) {
        return selections;
    }

    var s = selections
        .transition()
        .duration(duration);

    if (typeof(callback) === 'function') {
        callback(s);
    }

    return s;
};

dc.units = {};

/**
#### dc.units.integers
`dc.units.integers` is the default value for `xUnits` for the [Coordinate Grid
Chart](#coordinate-grid-chart) and should be used when the x values are a sequence of integers.

It is a function that counts the number of integers in the range supplied in its start and end parameters.

```js
chart.xUnits(dc.units.integers) // already the default
```

**/
dc.units.integers = function (s, e) {
    return Math.abs(e - s);
};

/**
#### dc.units.ordinal
This argument can be passed to the `xUnits` function of the to specify ordinal units for the x
axis. Usually this parameter is used in combination with passing `d3.scale.ordinal()` to `.x`.

It just returns the domain passed to it, which for ordinal charts is an array of all values.

```js
chart.xUnits(dc.units.ordinal)
    .x(d3.scale.ordinal())
```

**/
dc.units.ordinal = function (s, e, domain) {
    return domain;
};

/**
#### dc.units.fp.precision(precision)
This function generates an argument for the [Coordinate Grid Chart's](#coordinate-grid-chart)
`xUnits` function specifying that the x values are floating-point numbers with the given
precision.

The returned function determines how many values at the given precision will fit into the range
supplied in its start and end parameters.

```js
// specify values (and ticks) every 0.1 units
chart.xUnits(dc.units.fp.precision(0.1)
// there are 500 units between 0.5 and 1 if the precision is 0.001
var thousandths = dc.units.fp.precision(0.001);
thousandths(0.5, 1.0) // returns 500
```
**/
dc.units.fp = {};
dc.units.fp.precision = function (precision) {
    var _f = function (s, e) {
        var d = Math.abs((e - s) / _f.resolution);
        if (dc.utils.isNegligible(d - Math.floor(d))) {
            return Math.floor(d);
        } else {
            return Math.ceil(d);
        }
    };
    _f.resolution = precision;
    return _f;
};

dc.round = {};
dc.round.floor = function (n) {
    return Math.floor(n);
};
dc.round.ceil = function (n) {
    return Math.ceil(n);
};
dc.round.round = function (n) {
    return Math.round(n);
};

dc.override = function (obj, functionName, newFunction) {
    var existingFunction = obj[functionName];
    obj['_' + functionName] = existingFunction;
    obj[functionName] = newFunction;
};

dc.renderlet = function (_) {
    if (!arguments.length) {
        return dc._renderlet;
    }
    dc._renderlet = _;
    return dc;
};

dc.instanceOfChart = function (o) {
    return o instanceof Object && o.__dcFlag__ && true;
};
