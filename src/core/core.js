import {utils} from './utils';
import {constants} from './constants';
import {config} from './config';

/**
 * The entire dc.js library is scoped under the **dc** name space. It does not introduce
 * anything else into the global name space.
 *
 * Most `dc` functions are designed to allow function chaining, meaning they return the current chart
 * instance whenever it is appropriate.  The getter forms of functions do not participate in function
 * chaining because they return values that are not the chart, although some,
 * such as {@link dc.baseMixin#svg .svg} and {@link dc.coordinateGridMixin#xAxis .xAxis},
 * return values that are themselves chainable d3 objects.
 * @namespace dc
 * @version <%= conf.pkg.version %>
 * @example
 * // Example chaining
 * chart.width(300)
 *      .height(300)
 *      .filter('sunday');
 */

/**
 * The dc.chartRegistry object maintains sets of all instantiated dc.js charts under named groups
 * and the default group.
 *
 * A chart group often corresponds to a crossfilter instance. It specifies
 * the set of charts which should be updated when a filter changes on one of the charts or when the
 * global functions {@link dc.filterAll dc.filterAll}, {@link dc.refocusAll dc.refocusAll},
 * {@link dc.renderAll dc.renderAll}, {@link dc.redrawAll dc.redrawAll}, or chart functions
 * {@link dc.baseMixin#renderGroup baseMixin.renderGroup},
 * {@link dc.baseMixin#redrawGroup baseMixin.redrawGroup} are called.
 *
 * @namespace chartRegistry
 * @memberof dc
 * @type {{has, register, deregister, clear, list}}
 */
export const chartRegistry = (function () {
    // chartGroup:string => charts:array
    var _chartMap = {};

    function initializeChartGroup (group) {
        if (!group) {
            group = constants.DEFAULT_CHART_GROUP;
        }

        if (!_chartMap[group]) {
            _chartMap[group] = [];
        }

        return group;
    }

    return {
        /**
         * Determine if a given chart instance resides in any group in the registry.
         * @method has
         * @memberof dc.chartRegistry
         * @param {Object} chart dc.js chart instance
         * @returns {Boolean}
         */
        has: function (chart) {
            for (let e in _chartMap) {
                if (_chartMap[e].indexOf(chart) >= 0) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Add given chart instance to the given group, creating the group if necessary.
         * If no group is provided, the default group `dc.constants.DEFAULT_CHART_GROUP` will be used.
         * @method register
         * @memberof dc.chartRegistry
         * @param {Object} chart dc.js chart instance
         * @param {String} [group] Group name
         * @return {undefined}
         */
        register: function (chart, group) {
            group = initializeChartGroup(group);
            _chartMap[group].push(chart);
        },

        /**
         * Remove given chart instance from the given group, creating the group if necessary.
         * If no group is provided, the default group `dc.constants.DEFAULT_CHART_GROUP` will be used.
         * @method deregister
         * @memberof dc.chartRegistry
         * @param {Object} chart dc.js chart instance
         * @param {String} [group] Group name
         * @return {undefined}
         */
        deregister: function (chart, group) {
            group = initializeChartGroup(group);
            for (var i = 0; i < _chartMap[group].length; i++) {
                if (_chartMap[group][i].anchorName() === chart.anchorName()) {
                    _chartMap[group].splice(i, 1);
                    break;
                }
            }
        },

        /**
         * Clear given group if one is provided, otherwise clears all groups.
         * @method clear
         * @memberof dc.chartRegistry
         * @param {String} group Group name
         * @return {undefined}
         */
        clear: function (group) {
            if (group) {
                delete _chartMap[group];
            } else {
                _chartMap = {};
            }
        },

        /**
         * Get an array of each chart instance in the given group.
         * If no group is provided, the charts in the default group are returned.
         * @method list
         * @memberof dc.chartRegistry
         * @param {String} [group] Group name
         * @returns {Array<Object>}
         */
        list: function (group) {
            group = initializeChartGroup(group);
            return _chartMap[group];
        }
    };
})();

/**
 * Add given chart instance to the given group, creating the group if necessary.
 * If no group is provided, the default group `dc.constants.DEFAULT_CHART_GROUP` will be used.
 * @memberof dc
 * @method registerChart
 * @param {Object} chart dc.js chart instance
 * @param {String} [group] Group name
 * @return {undefined}
 */
export const registerChart = function (chart, group) {
    chartRegistry.register(chart, group);
};

/**
 * Remove given chart instance from the given group, creating the group if necessary.
 * If no group is provided, the default group `dc.constants.DEFAULT_CHART_GROUP` will be used.
 * @memberof dc
 * @method deregisterChart
 * @param {Object} chart dc.js chart instance
 * @param {String} [group] Group name
 * @return {undefined}
 */
export const deregisterChart = function (chart, group) {
    chartRegistry.deregister(chart, group);
};

/**
 * Determine if a given chart instance resides in any group in the registry.
 * @memberof dc
 * @method hasChart
 * @param {Object} chart dc.js chart instance
 * @returns {Boolean}
 */
export const hasChart = function (chart) {
    return chartRegistry.has(chart);
};

/**
 * Clear given group if one is provided, otherwise clears all groups.
 * @memberof dc
 * @method deregisterAllCharts
 * @param {String} group Group name
 * @return {undefined}
 */
export const deregisterAllCharts = function (group) {
    chartRegistry.clear(group);
};

/**
 * Clear all filters on all charts within the given chart group. If the chart group is not given then
 * only charts that belong to the default chart group will be reset.
 * @memberof dc
 * @method filterAll
 * @param {String} [group]
 * @return {undefined}
 */
export const filterAll = function (group) {
    var charts = chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].filterAll();
    }
};

/**
 * Reset zoom level / focus on all charts that belong to the given chart group. If the chart group is
 * not given then only charts that belong to the default chart group will be reset.
 * @memberof dc
 * @method refocusAll
 * @param {String} [group]
 * @return {undefined}
 */
export const refocusAll = function (group) {
    var charts = chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        if (charts[i].focus) {
            charts[i].focus();
        }
    }
};

/**
 * Re-render all charts belong to the given chart group. If the chart group is not given then only
 * charts that belong to the default chart group will be re-rendered.
 * @memberof dc
 * @method renderAll
 * @param {String} [group]
 * @return {undefined}
 */
export const renderAll = function (group) {
    var charts = chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].render();
    }

    if (config._renderlet !== null) {
        config._renderlet(group);
    }
};

/**
 * Redraw all charts belong to the given chart group. If the chart group is not given then only charts
 * that belong to the default chart group will be re-drawn. Redraw is different from re-render since
 * when redrawing dc tries to update the graphic incrementally, using transitions, instead of starting
 * from scratch.
 * @memberof dc
 * @method redrawAll
 * @param {String} [group]
 * @return {undefined}
 */
export const redrawAll = function (group) {
    var charts = chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].redraw();
    }

    if (config._renderlet !== null) {
        config._renderlet(group);
    }
};

/**
 * Start a transition on a selection if transitions are globally enabled
 * ({@link dc.disableTransitions} is false) and the duration is greater than zero; otherwise return
 * the selection. Since most operations are the same on a d3 selection and a d3 transition, this
 * allows a common code path for both cases.
 * @memberof dc
 * @method transition
 * @param {d3.selection} selection - the selection to be transitioned
 * @param {Number|Function} [duration=250] - the duration of the transition in milliseconds, a
 * function returning the duration, or 0 for no transition
 * @param {Number|Function} [delay] - the delay of the transition in milliseconds, or a function
 * returning the delay, or 0 for no delay
 * @param {String} [name] - the name of the transition (if concurrent transitions on the same
 * elements are needed)
 * @returns {d3.transition|d3.selection}
 */
export const transition = function (selection, duration, delay, name) {
    if (config.disableTransitions || duration <= 0) {
        return selection;
    }

    var s = selection.transition(name);

    if (duration >= 0 || duration !== undefined) {
        s = s.duration(duration);
    }
    if (delay >= 0 || delay !== undefined) {
        s = s.delay(delay);
    }

    return s;
};

/* somewhat silly, but to avoid duplicating logic */
export const optionalTransition = function (enable, duration, delay, name) {
    if (enable) {
        return function (selection) {
            return transition(selection, duration, delay, name);
        };
    } else {
        return function (selection) {
            return selection;
        };
    }
};

// See http://stackoverflow.com/a/20773846
export const afterTransition = function (transition, callback) {
    if (transition.empty() || !transition.duration) {
        callback.call(transition);
    } else {
        var n = 0;
        transition
            .each(function () { ++n; })
            .on('end', function () {
                if (!--n) {
                    callback.call(transition);
                }
            });
    }
};

/**
 * @namespace units
 * @memberof dc
 * @type {{}}
 */
export const units = {};

/**
 * The default value for {@link dc.coordinateGridMixin#xUnits .xUnits} for the
 * {@link dc.coordinateGridMixin Coordinate Grid Chart} and should
 * be used when the x values are a sequence of integers.
 * It is a function that counts the number of integers in the range supplied in its start and end parameters.
 * @method integers
 * @memberof dc.units
 * @see {@link dc.coordinateGridMixin#xUnits coordinateGridMixin.xUnits}
 * @example
 * chart.xUnits(dc.units.integers) // already the default
 * @param {Number} start
 * @param {Number} end
 * @returns {Number}
 */
units.integers = function (start, end) {
    return Math.abs(end - start);
};

/**
 * This argument can be passed to the {@link dc.coordinateGridMixin#xUnits .xUnits} function of a
 * coordinate grid chart to specify ordinal units for the x axis. Usually this parameter is used in
 * combination with passing
 * {@link https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales d3.scaleOrdinal}
 * to {@link dc.coordinateGridMixin#x .x}.
 *
 * As of dc.js 3.0, this is purely a placeholder or magic value which causes the chart to go into ordinal mode; the
 * function is not called.
 * @method ordinal
 * @memberof dc.units
 * @return {uncallable}
 * @see {@link https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales d3.scaleOrdinal}
 * @see {@link dc.coordinateGridMixin#xUnits coordinateGridMixin.xUnits}
 * @see {@link dc.coordinateGridMixin#x coordinateGridMixin.x}
 * @example
 * chart.xUnits(dc.units.ordinal)
 *      .x(d3.scaleOrdinal())
 */
units.ordinal = function () {
    throw new Error('dc.units.ordinal should not be called - it is a placeholder');
};

/**
 * @namespace fp
 * @memberof dc.units
 * @type {{}}
 */
units.fp = {};
/**
 * This function generates an argument for the {@link dc.coordinateGridMixin Coordinate Grid Chart}
 * {@link dc.coordinateGridMixin#xUnits .xUnits} function specifying that the x values are floating-point
 * numbers with the given precision.
 * The returned function determines how many values at the given precision will fit into the range
 * supplied in its start and end parameters.
 * @method precision
 * @memberof dc.units.fp
 * @see {@link dc.coordinateGridMixin#xUnits coordinateGridMixin.xUnits}
 * @example
 * // specify values (and ticks) every 0.1 units
 * chart.xUnits(dc.units.fp.precision(0.1)
 * // there are 500 units between 0.5 and 1 if the precision is 0.001
 * var thousandths = dc.units.fp.precision(0.001);
 * thousandths(0.5, 1.0) // returns 500
 * @param {Number} precision
 * @returns {Function} start-end unit function
 */
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

export const renderlet = function (_) {
    if (!arguments.length) {
        return config._renderlet;
    }
    config._renderlet = _;
    return null;
};

export const instanceOfChart = function (o) {
    return o instanceof Object && o.__dcFlag__ && true;
};
