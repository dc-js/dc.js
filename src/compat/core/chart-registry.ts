import { chartRegistry } from '../../core/chart-registry';
import { config } from './config';
import { IMinimalChart } from '../../core/i-minimal-chart';

export * from '../../core/chart-group';
export * from '../../core/filter-storage';
export * from '../../core/chart-registry';

/**
 * Add given chart instance to the given group, creating the group if necessary.
 * If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.
 * @function registerChart
 * @param {Object} chart dc.js chart instance
 * @param {String} [group] Group name
 * @return {undefined}
 */
export function registerChart(chart: IMinimalChart, group?: string): void {
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
export function deregisterChart(chart: IMinimalChart, group?: string): void {
    chartRegistry.chartGroup(group).deregister(chart);
}

/**
 * Determine if a given chart instance resides in any group in the registry.
 * @function hasChart
 * @param {Object} chart dc.js chart instance
 * @returns {Boolean}
 */
export function hasChart(chart: IMinimalChart): boolean {
    return chartRegistry.has(chart);
}

/**
 * Clear given group if one is provided, otherwise clears all groups.
 * @function deregisterAllCharts
 * @param {String} group Group name
 * @return {undefined}
 */
export function deregisterAllCharts(group?) {
    chartRegistry.clear(group);
}

/**
 * Clear all filters on all charts within the given chart group. If the chart group is not given then
 * only charts that belong to the default chart group will be reset.
 * @function filterAll
 * @param {String} [group]
 * @return {undefined}
 */
export function filterAll(group?: string): void {
    chartRegistry.chartGroup(group).filterAll();
}

/**
 * Reset zoom level / focus on all charts that belong to the given chart group. If the chart group is
 * not given then only charts that belong to the default chart group will be reset.
 * @function refocusAll
 * @param {String} [group]
 * @return {undefined}
 */
export function refocusAll(group?: string): void {
    chartRegistry.chartGroup(group).refocusAll();
}

/**
 * Re-render all charts belong to the given chart group. If the chart group is not given then only
 * charts that belong to the default chart group will be re-rendered.
 * @function renderAll
 * @param {String} [group]
 * @return {undefined}
 */
export function renderAll(group?: string): void {
    chartRegistry.chartGroup(group).renderAll();

    // @ts-ignore
    if (config._renderlet !== null) {
        // @ts-ignore
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
export function redrawAll(group?: string): void {
    chartRegistry.chartGroup(group).redrawAll();

    // @ts-ignore
    if (config._renderlet !== null) {
        // @ts-ignore
        config._renderlet(group);
    }
}
export { ISerializedFilters } from '../../core/i-serialized-filters';
