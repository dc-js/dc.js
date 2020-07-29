import {constants} from './constants';
import {config} from './config';
import {BaseMixin} from '../base/base-mixin';

class ChartGroup {
    private _charts: BaseMixin[];

    constructor () {
        this._charts = [];
    }

    public list (): BaseMixin[] {
        return this._charts;
    }

    public has (chart): boolean {
        return this._charts.indexOf(chart) >= 0;
    }

    public register (chart): void {
        this._charts.push(chart);
    }

    public deregister (chart): void {
        this._charts = this._charts.filter(ch => ch !== chart);
    }

    public clear (): void {
        this._charts = [];
    }

    public renderAll (): void {
        for (const chart of this._charts) {
            chart.render();
        }
    }

    public redrawAll (): void {
        for (const chart of this._charts) {
            chart.redraw();
        }
    }

    public filterAll (): void {
        for (const chart of this._charts) {
            chart.filterAll();
        }
    }

    public refocusAll (): void {
        let chart: any; // disable type checking, BaseMixin does not have focus method
        for (chart of this._charts) {
            if (chart.focus) {
                chart.focus();
            }
        }
    }
}

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
    private _chartMap: {[group: string]: ChartGroup};

    constructor () {
        // chartGroup:string => charts:array
        this._chartMap = {};
    }

    public chartGroup (group?: string): ChartGroup {
        if (!group) {
            group = constants.DEFAULT_CHART_GROUP;
        }

        if (!this._chartMap[group]) {
            this._chartMap[group] = new ChartGroup();
        }

        return this._chartMap[group];
    }

    /**
     * Determine if a given chart instance resides in any group in the registry.
     * @param {Object} chart dc.js chart instance
     * @returns {Boolean}
     */
    public has (chart: BaseMixin): boolean {
        for (const chartGroupName in this._chartMap) {
            if (this._chartMap[chartGroupName].has(chart)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Clear given group if one is provided, otherwise clears all groups.
     * @param {String} group Group name
     * @return {undefined}
     */
    public clear (group?: string): void {
        if (group) {
            if (this._chartMap[group]) {
                this._chartMap[group].clear();
                delete (this._chartMap)[group];
            }
        } else {
            for (const chartGroupName in this._chartMap) {
                this._chartMap[chartGroupName].clear();
            }
            this._chartMap = {};
        }
    }

    /**
     * Get an array of each chart instance in the given group.
     * If no group is provided, the charts in the default group are returned.
     * @param {String} [group] Group name
     * @returns {Array<Object>}
     */
    public list (group?: string): BaseMixin[] {
        return this.chartGroup(group).list();
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
export function registerChart (chart: BaseMixin, group?: string): void {
    chartRegistry.chartGroup(group).register(chart);
}

/**
 * Remove given chart instance from the given group, creating the group if necessary.
 * If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.
 * @function deregisterChart
 * @param {Object} chart dc.js chart instance
 * @param {String} [group] Group name
 * @return {undefined}
 */
export function deregisterChart (chart: BaseMixin, group?: string): void {
    chartRegistry.chartGroup(group).deregister(chart);
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
export function deregisterAllCharts (group?) {
    chartRegistry.clear(group);
}

/**
 * Clear all filters on all charts within the given chart group. If the chart group is not given then
 * only charts that belong to the default chart group will be reset.
 * @function filterAll
 * @param {String} [group]
 * @return {undefined}
 */
export function filterAll (group?: string): void {
    chartRegistry.chartGroup(group).filterAll();
}

/**
 * Reset zoom level / focus on all charts that belong to the given chart group. If the chart group is
 * not given then only charts that belong to the default chart group will be reset.
 * @function refocusAll
 * @param {String} [group]
 * @return {undefined}
 */
export function refocusAll (group?: string): void {
    chartRegistry.chartGroup(group).refocusAll();
}

/**
 * Re-render all charts belong to the given chart group. If the chart group is not given then only
 * charts that belong to the default chart group will be re-rendered.
 * @function renderAll
 * @param {String} [group]
 * @return {undefined}
 */
export function renderAll (group?: string): void {
    chartRegistry.chartGroup(group).renderAll();

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
export function redrawAll (group?: string): void {
    chartRegistry.chartGroup(group).redrawAll();

    if (config._renderlet !== null) {
        config._renderlet(group);
    }
}
