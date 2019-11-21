import {constants} from './constants';
import {config} from './config';

/**
 * The chartRegistry object maintains sets of all instantiated dc.js charts under named groups
 * and the default group.
 *
 * A chart group often corresponds to a crossfilter instance. It specifies
 * the set of charts which should be updated when a filter changes on one of the charts or when the
 * global functions {@link filterAll filterAll}, {@link refocusAll refocusAll},
 * {@link renderAll renderAll}, {@link redrawAll redrawAll}, or chart functions
 * {@link baseMixin#renderGroup baseMixin.renderGroup},
 * {@link baseMixin#redrawGroup baseMixin.redrawGroup} are called.
 *
 * @namespace chartRegistry
 * @type {{has, register, deregister, clear, list}}
 */
export const chartRegistry = (function () {
    // chartGroup:string => charts:array
    let _chartMap = {};

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
         * @memberof chartRegistry
         * @param {Object} chart dc.js chart instance
         * @returns {Boolean}
         */
        has: function (chart) {
            for (const e in _chartMap) {
                if (_chartMap[e].indexOf(chart) >= 0) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Add given chart instance to the given group, creating the group if necessary.
         * If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.
         * @method register
         * @memberof chartRegistry
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
         * If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.
         * @method deregister
         * @memberof chartRegistry
         * @param {Object} chart dc.js chart instance
         * @param {String} [group] Group name
         * @return {undefined}
         */
        deregister: function (chart, group) {
            group = initializeChartGroup(group);
            for (let i = 0; i < _chartMap[group].length; i++) {
                if (_chartMap[group][i].anchorName() === chart.anchorName()) {
                    _chartMap[group].splice(i, 1);
                    break;
                }
            }
        },

        /**
         * Clear given group if one is provided, otherwise clears all groups.
         * @method clear
         * @memberof chartRegistry
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
         * @memberof chartRegistry
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
 * If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.
 * @param {Object} chart dc.js chart instance
 * @param {String} [group] Group name
 * @return {undefined}
 */
export const registerChart = function (chart, group) {
    chartRegistry.register(chart, group);
};

/**
 * Remove given chart instance from the given group, creating the group if necessary.
 * If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.
 * @param {Object} chart dc.js chart instance
 * @param {String} [group] Group name
 * @return {undefined}
 */
export const deregisterChart = function (chart, group) {
    chartRegistry.deregister(chart, group);
};

/**
 * Determine if a given chart instance resides in any group in the registry.
 * @param {Object} chart dc.js chart instance
 * @returns {Boolean}
 */
export const hasChart = function (chart) {
    return chartRegistry.has(chart);
};

/**
 * Clear given group if one is provided, otherwise clears all groups.
 * @param {String} group Group name
 * @return {undefined}
 */
export const deregisterAllCharts = function (group) {
    chartRegistry.clear(group);
};

/**
 * Clear all filters on all charts within the given chart group. If the chart group is not given then
 * only charts that belong to the default chart group will be reset.
 * @param {String} [group]
 * @return {undefined}
 */
export const filterAll = function (group) {
    const charts = chartRegistry.list(group);
    for (let i = 0; i < charts.length; ++i) {
        charts[i].filterAll();
    }
};

/**
 * Reset zoom level / focus on all charts that belong to the given chart group. If the chart group is
 * not given then only charts that belong to the default chart group will be reset.
 * @param {String} [group]
 * @return {undefined}
 */
export const refocusAll = function (group) {
    const charts = chartRegistry.list(group);
    for (let i = 0; i < charts.length; ++i) {
        if (charts[i].focus) {
            charts[i].focus();
        }
    }
};

/**
 * Re-render all charts belong to the given chart group. If the chart group is not given then only
 * charts that belong to the default chart group will be re-rendered.
 * @param {String} [group]
 * @return {undefined}
 */
export const renderAll = function (group) {
    const charts = chartRegistry.list(group);
    for (let i = 0; i < charts.length; ++i) {
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
 * @param {String} [group]
 * @return {undefined}
 */
export const redrawAll = function (group) {
    const charts = chartRegistry.list(group);
    for (let i = 0; i < charts.length; ++i) {
        charts[i].redraw();
    }

    if (config._renderlet !== null) {
        config._renderlet(group);
    }
};
