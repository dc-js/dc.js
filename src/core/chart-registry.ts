import {constants} from './constants';
import {config} from './config';
import {BaseMixin} from '../base/base-mixin';

/**
 * The ChartRegistry maintains sets of all instantiated dc.js charts under named groups
 * and the default group. There is a single global ChartRegistry object named `chartRegistry`
 *
 * A chart group often corresponds to a crossfilter instance. It specifies
 * the set of charts which should be updated when a filter changes on one of the charts or when the
 * global functions {@link filterAll filterAll}, {@link refocusAll refocusAll},
 * {@link renderAll renderAll}, {@link redrawAll redrawAll}, or chart functions
 * {@link baseMixin#renderGroup baseMixin.renderGroup},
 * {@link baseMixin#redrawGroup baseMixin.redrawGroup} are called.
 */
class ChartRegistry {
    private _chartMap: {[group: string]: BaseMixin[]};

    constructor () {
        // chartGroup:string => charts:array
        this._chartMap = {};
    }

    public _initializeChartGroup (group?: string): string {
        if (!group) {
            group = constants.DEFAULT_CHART_GROUP;
        }

        if (!(this._chartMap)[group]) {
            (this._chartMap)[group] = [];
        }

        return group;
    }

    /**
     * Determine if a given chart instance resides in any group in the registry.
     * @param {Object} chart dc.js chart instance
     * @returns {Boolean}
     */
    public has (chart: BaseMixin): boolean {
        for (const e in this._chartMap) {
            if ((this._chartMap)[e].indexOf(chart) >= 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Add given chart instance to the given group, creating the group if necessary.
     * If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.
     * @param {Object} chart dc.js chart instance
     * @param {String} [group] Group name
     * @return {undefined}
     */
    public register (chart: BaseMixin, group: string): void {
        const _chartMap = this._chartMap;
        group = this._initializeChartGroup(group);
        _chartMap[group].push(chart);
    }

    /**
     * Remove given chart instance from the given group, creating the group if necessary.
     * If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.
     * @param {Object} chart dc.js chart instance
     * @param {String} [group] Group name
     * @return {undefined}
     */
    public deregister (chart: BaseMixin, group: string): void {
        group = this._initializeChartGroup(group);
        for (let i = 0; i < (this._chartMap)[group].length; i++) {
            if ((this._chartMap)[group][i].anchorName() === chart.anchorName()) {
                (this._chartMap)[group].splice(i, 1);
                break;
            }
        }
    }

    /**
     * Clear given group if one is provided, otherwise clears all groups.
     * @param {String} group Group name
     * @return {undefined}
     */
    public clear (group: string): void {
        if (group) {
            delete (this._chartMap)[group];
        } else {
            this._chartMap = {};
        }
    }

    /**
     * Get an array of each chart instance in the given group.
     * If no group is provided, the charts in the default group are returned.
     * @param {String} [group] Group name
     * @returns {Array<Object>}
     */
    public list (group: string): BaseMixin[] {
        group = this._initializeChartGroup(group);
        return (this._chartMap)[group];
    }
}

/**
 * The chartRegistry object maintains sets of all instantiated dc.js charts under named groups
 * and the default group. See {@link ChartRegistry ChartRegistry} for its methods.
 */
export const chartRegistry = new ChartRegistry();

/**
 * Add given chart instance to the given group, creating the group if necessary.
 * If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.
 * @function registerChart
 * @param {Object} chart dc.js chart instance
 * @param {String} [group] Group name
 * @return {undefined}
 */
export function registerChart (chart: BaseMixin, group: string): void {
    chartRegistry.register(chart, group);
}

/**
 * Remove given chart instance from the given group, creating the group if necessary.
 * If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.
 * @function deregisterChart
 * @param {Object} chart dc.js chart instance
 * @param {String} [group] Group name
 * @return {undefined}
 */
export function deregisterChart (chart: BaseMixin, group: string): void {
    chartRegistry.deregister(chart, group);
}

/**
 * Determine if a given chart instance resides in any group in the registry.
 * @function hasChart
 * @param {Object} chart dc.js chart instance
 * @returns {Boolean}
 */
export function hasChart (chart: BaseMixin): boolean {
    return chartRegistry.has(chart);
}

/**
 * Clear given group if one is provided, otherwise clears all groups.
 * @function deregisterAllCharts
 * @param {String} group Group name
 * @return {undefined}
 */
export const deregisterAllCharts = function (group) {
    chartRegistry.clear(group);
};

/**
 * Clear all filters on all charts within the given chart group. If the chart group is not given then
 * only charts that belong to the default chart group will be reset.
 * @function filterAll
 * @param {String} [group]
 * @return {undefined}
 */
export function filterAll (group: string): void {
    const charts = chartRegistry.list(group);
    for (let i = 0; i < charts.length; ++i) {
        charts[i].filterAll();
    }
}

/**
 * Reset zoom level / focus on all charts that belong to the given chart group. If the chart group is
 * not given then only charts that belong to the default chart group will be reset.
 * @function refocusAll
 * @param {String} [group]
 * @return {undefined}
 */
export function refocusAll (group: string): void {
    const charts = chartRegistry.list(group);
    for (let i = 0; i < charts.length; ++i) {
        // @ts-ignore
        if (charts[i].focus) {
            // @ts-ignore
            charts[i].focus();
        }
    }
}

/**
 * Re-render all charts belong to the given chart group. If the chart group is not given then only
 * charts that belong to the default chart group will be re-rendered.
 * @function renderAll
 * @param {String} [group]
 * @return {undefined}
 */
export function renderAll (group: string): void {
    const charts = chartRegistry.list(group);
    for (let i = 0; i < charts.length; ++i) {
        charts[i].render();
    }

    if (config._renderlet !== null) {
        config._renderlet(group);
    }
}

/**
 * Redraw all charts belong to the given chart group. If the chart group is not given then only charts
 * that belong to the default chart group will be re-drawn. Redraw is different from re-render since
 * when redrawing dc tries to update the graphic incrementally, using transitions, instead of starting
 * from scratch.
 * @function redrawAll
 * @param {String} [group]
 * @return {undefined}
 */
export function redrawAll (group: string): void {
    const charts = chartRegistry.list(group);
    for (let i = 0; i < charts.length; ++i) {
        charts[i].redraw();
    }

    if (config._renderlet !== null) {
        config._renderlet(group);
    }
}
