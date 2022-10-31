import { FilterStorage } from './filter-storage.js';
import { IFilterStorage } from './i-filter-storage.js';
import { IChartGroup } from './i-chart-group.js';
import { IMinimalChart } from './i-minimal-chart.js';

/**
 * A chart group often corresponds to a set of linked charts.
 * For example, when using crossfilter, it is typically charts linked to same crossfilter instance.
 * It specifies the set of charts which should be updated when a filter changes on one of the charts.
 * The {@linkcode BaseMixin} methods {@linkcode BaseMixin.renderGroup | renderGroup} and
 * {@linkcode BaseMixin.redrawGroup | redrawGroup} call {@linkcode renderAll} and {@linkcode redrawAll}
 * on the chart group.
 *
 * `dc` charts created without specifying a chartGroup are registered with the default ChartGroup.
 * It is recommended that all `dc` charts are created with an explicit chartGroup.
 *
 * This has been introduced in v5 to facilitate automated garage collection of charts.
 * SPAs (Single Page Applications), or any other environments where set of charts need to be unloaded,
 * should use explicit chartGroups.
 *
 * It is possible to register non dc charts (or any other object) with the chartGroup.
 * Please see {@linkcode IMinimalChart} to understand the methods the chartGroup will be invoking.
 *
 * `dc` charts do not hard depend on this class. So, it is possible to replace it with any compliant
 * implementation. {@linkcode IChartGroup} specifies what rest of the `dc` expects.
 */
export class ChartGroup implements IChartGroup {
    private _charts: IMinimalChart[];

    /**
     * It stores filter state of charts.
     *
     * @category Ninja
     */
    public filterStorage: IFilterStorage;

    /**
     * This callback is invoked after {@linkcode redrawAll} and {@linkcode renderAll}.
     *
     * @example
     * ```
     * chartGroup.renderlet = () => {
     *     // user code
     * }
     * ```
     *
     * @category Intermediate
     */
    public renderlet: () => void;

    /**
     * This is an `async` callback.
     * It can be used for quite sophisticated purposes.
     * For example, the RemoteDataAdaptors can request data from a remote service based on
     * current filters and await till results are received.
     *
     * @category Intermediate
     * @see {@link beforeRenderAll}
     */
    public beforeRedrawAll: () => Promise<void>;

    /**
     * Similar to {@linkcode beforeRedrawAll}.
     *
     * @category Intermediate
     * @see {@link beforeRedrawAll}
     */
    public beforeRenderAll: () => Promise<void>;

    /**
     * Create a new instance. Please note it does not take a name as parameter.
     */
    constructor() {
        this._charts = [];
        this.filterStorage = new FilterStorage();
    }

    /**
     * List of charts in the group. It returns the internal storage without defensive cloning.
     *
     * @category Intermediate
     */
    public list(): IMinimalChart[] {
        return this._charts;
    }

    /**
     * Check if the chart is registered with this chartGroup.
     *
     * @category Intermediate
     */
    public has(chart: IMinimalChart): boolean {
        return this._charts.includes(chart);
    }

    /**
     * dc charts will register themselves. Non dc charts will need to call this method.
     *
     * @category Intermediate
     */
    public register(chart: IMinimalChart): void {
        this._charts.push(chart);
    }

    /**
     * dc charts will deregister themselves.
     *
     * @category Intermediate
     */
    public deregister(chart: IMinimalChart): void {
        if (typeof chart.dispose === 'function') {
            chart.dispose();
        }

        this._charts = this._charts.filter(ch => ch !== chart);
    }

    /**
     * Remove all charts from the registry.
     * Should not be called directly - it may leave charts in inconsistent state.
     *
     * @category Ninja
     */
    public clear(): void {
        this._charts = [];
    }

    /**
     * Once all charts have been registered, this function should be called.
     * It will do the following in order:
     * - invoke async callback {@linkcode beforeRenderAll},
     * - invoke {@linkcode BaseMixin.render | render} on each of the charts,
     * - invoke callback {@linkcode renderlet}.
     *
     * Typically this will be called only once.
     */
    public async renderAll(): Promise<void> {
        if (typeof this.beforeRenderAll === 'function') {
            await this.beforeRenderAll();
        }

        for (const chart of this._charts) {
            chart.render();
        }

        if (typeof this.renderlet === 'function') {
            this.renderlet();
        }
    }

    /**
     * Redraw all the charts.
     *
     * When a filter is modified for any of the charts or there is a change in the underlying data,
     * all linked charts will need be redrawn.
     *
     * It will do the following in order:
     * - invoke async callback {@linkcode beforeRedrawAll},
     * - invoke {@linkcode BaseMixin.redraw | redraw} on each of the charts,
     * - invoke callback {@linkcode renderlet}.
     *
     * For any filter changes, this will be called by dc charts internally.
     * However, if there is a change in data (like rows getting added), this function
     * needs to be called to see the updated data.
     */
    public async redrawAll(): Promise<void> {
        if (typeof this.beforeRedrawAll === 'function') {
            await this.beforeRedrawAll();
        }

        for (const chart of this._charts) {
            chart.redraw();
        }

        if (typeof this.renderlet === 'function') {
            this.renderlet();
        }
    }

    /**
     * Reset filters for all the charts. This can be used to implement `Reset All` in the UI.
     */
    public filterAll(): void {
        for (const chart of this._charts) {
            chart.filterAll();
        }
    }

    /**
     * Refocus all the charts that support focusing.
     */
    public refocusAll(): void {
        for (const chart of this._charts) {
            if (chart.focus) {
                chart.focus();
            }
        }
    }
}
