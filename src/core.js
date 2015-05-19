import {utils} from './utils';

/**
#### Version __VERSION__
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
/* jshint ignore:start */
export var version = __VERSION__;
/* jshint ignore:end */
export var constants = {
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
};
var _renderlet = null;

export var chartRegistry = (function () {
    // chartGroup:string => charts:array
    var _chartMap = {};

    function initializeChartGroup(group) {
        if (!group) {
            group = constants.DEFAULT_CHART_GROUP;
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
}());

export var registerChart = function (chart, group) {
    chartRegistry.register(chart, group);
};

export var deregisterChart = function (chart, group) {
    chartRegistry.deregister(chart, group);
};

export var hasChart = function (chart) {
    return chartRegistry.has(chart);
};

export var deregisterAllCharts = function (group) {
    chartRegistry.clear(group);
};

/**
## Utilities
**/

/**
#### dc.filterAll([chartGroup])
Clear all filters on all charts within the given chart group. If the chart group is not given then
only charts that belong to the default chart group will be reset.
**/
export var filterAll = function (group) {
    var charts = chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].filterAll();
    }
};

/**
#### dc.refocusAll([chartGroup])
Reset zoom level / focus on all charts that belong to the given chart group. If the chart group is
not given then only charts that belong to the default chart group will be reset.
**/
export var refocusAll = function (group) {
    var charts = chartRegistry.list(group);
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
export var renderAll = function (group) {
    var charts = chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].render();
    }

    if (_renderlet !== null) {
        _renderlet(group);
    }
};

/**
#### dc.redrawAll([chartGroup])
Redraw all charts belong to the given chart group. If the chart group is not given then only charts
that belong to the default chart group will be re-drawn. Redraw is different from re-render since
when redrawing dc tries to update the graphic incrementally, using transitions, instead of starting
from scratch.
**/
export var redrawAll = function (group) {
    var charts = chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].redraw();
    }

    if (_renderlet !== null) {
        _renderlet(group);
    }
};

/**
#### dc.disableTransitions
If this boolean is set truthy, all transitions will be disabled, and changes to the charts will happen
immediately.  Default: false
**/
var _disableTransitions = false;
export var disableTransitions = function (_) {
    if (!arguments.length) {
        return _disableTransitions;
    }
    _disableTransitions = _;
};

export var transition = function (selections, duration, callback) {
    if (duration <= 0 || duration === undefined || _disableTransitions) {
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

var units = {};

/**
#### dc.units.integers
`dc.units.integers` is the default value for `xUnits` for the [Coordinate Grid
Chart](#coordinate-grid-chart) and should be used when the x values are a sequence of integers.

It is a function that counts the number of integers in the range supplied in its start and end parameters.

```js
chart.xUnits(dc.units.integers) // already the default
```

**/
units.integers = function (s, e) {
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
units.ordinal = function (s, e, domain) {
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
units.fp = {};
units.fp.precision = function (precision) {
    var _f = function (s, e) {
        var d = Math.abs((e - s) / _f.resolution);
        if (utils.isNegligible(d - Math.floor(d))) {
            return Math.floor(d);
        } else {
            return Math.ceil(d);
        }
    };
    _f.resolution = precision;
    return _f;
};
export {units};

var round = {};
round.floor = function (n) {
    return Math.floor(n);
};
round.ceil = function (n) {
    return Math.ceil(n);
};
round.round = function (n) {
    return Math.round(n);
};
export {round};

export var override = function (obj, functionName, newFunction) {
    var existingFunction = obj[functionName];
    obj['_' + functionName] = existingFunction;
    obj[functionName] = newFunction;
};

export var renderlet = function (_) {
    if (!arguments.length) {
        return _renderlet;
    }
    _renderlet = _;
};

export var instanceOfChart = function (o) {
    return o instanceof Object && o.__dcFlag__ && true;
};
