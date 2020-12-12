import { FilterStorage } from './filter-storage';
import { IFilterStorage } from './i-filter-storage';
import { IChartGroup } from './i-chart-group';
import { IMinimalChart } from './i-minimal-chart';

export class ChartGroup implements IChartGroup {
    private _charts: IMinimalChart[];
    public filterStorage: IFilterStorage;
    public renderlet: () => void;
    public beforeRedrawAll: () => Promise<void>;
    public beforeRenderAll: () => Promise<void>;

    constructor() {
        this._charts = [];
        this.filterStorage = new FilterStorage();
    }

    public list(): IMinimalChart[] {
        return this._charts;
    }

    public has(chart: IMinimalChart): boolean {
        return this._charts.includes(chart);
    }

    public register(chart: IMinimalChart): void {
        this._charts.push(chart);
    }

    public deregister(chart: IMinimalChart): void {
        if (typeof chart.dispose === 'function') {
            chart.dispose();
        }

        this._charts = this._charts.filter(ch => ch !== chart);
    }

    public clear(): void {
        this._charts = [];
    }

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

    public filterAll(): void {
        for (const chart of this._charts) {
            chart.filterAll();
        }
    }

    public refocusAll(): void {
        for (const chart of this._charts) {
            if (chart.focus) {
                chart.focus();
            }
        }
    }
}
