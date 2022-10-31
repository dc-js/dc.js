import { chartRegistry } from '../../core/chart-registry.js';
import { config } from './config.js';
import { IMinimalChart } from '../../core/i-minimal-chart.js';

export * from '../../core/chart-group.js';
export * from '../../core/filter-storage.js';
export * from '../../core/chart-registry.js';

/**
 * Add given chart instance to the given group, creating the group if necessary.
 * If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.
 */
export function registerChart(chart: IMinimalChart, group?: string): void {
    chartRegistry.chartGroup(group).register(chart);
}

/**
 * Remove given chart instance from the given group, creating the group if necessary.
 * If no group is provided, the default group `constants.DEFAULT_CHART_GROUP` will be used.
 */
export function deregisterChart(chart: IMinimalChart, group?: string): void {
    chartRegistry.chartGroup(group).deregister(chart);
}

/**
 * Determine if a given chart instance resides in any group in the registry.
 */
export function hasChart(chart: IMinimalChart): boolean {
    return chartRegistry.has(chart);
}

/**
 * Clear given group if one is provided, otherwise clears all groups.
 */
export function deregisterAllCharts(group?) {
    chartRegistry.clear(group);
}

/**
 * Clear all filters on all charts within the given chart group. If the chart group is not given then
 * only charts that belong to the default chart group will be reset.
 */
export function filterAll(group?: string): void {
    chartRegistry.chartGroup(group).filterAll();
}

/**
 * Reset zoom level / focus on all charts that belong to the given chart group. If the chart group is
 * not given then only charts that belong to the default chart group will be reset.
 */
export function refocusAll(group?: string): void {
    chartRegistry.chartGroup(group).refocusAll();
}

/**
 * Re-render all charts belong to the given chart group. If the chart group is not given then only
 * charts that belong to the default chart group will be re-rendered.
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
 */
export function redrawAll(group?: string): void {
    chartRegistry.chartGroup(group).redrawAll();

    // @ts-ignore
    if (config._renderlet !== null) {
        // @ts-ignore
        config._renderlet(group);
    }
}
export { ISerializedFilters } from '../../core/i-serialized-filters.js';
