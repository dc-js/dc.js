import { IChartGroup, IFilterStorage, IMinimalChart } from './chart-group-types';
import { FilterStorage } from './filter-storage';

export class ChartGroup implements IChartGroup {
    private _charts: IMinimalChart[];
    public filterStorage: IFilterStorage;
    public renderlet: () => void;

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

    public renderAll(): void {
        for (const chart of this._charts) {
            chart.render();
        }

        if (typeof this.renderlet === 'function') {
            this.renderlet();
        }
    }

    public redrawAll(): void {
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
