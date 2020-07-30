import {IChartGroup, IMinimalChart} from './chart-group-types';

export class ChartGroup implements IChartGroup {
    private _charts: IMinimalChart[];

    constructor() {
        this._charts = [];
    }

    public list(): IMinimalChart[] {
        return this._charts;
    }

    public has(chart: IMinimalChart): boolean {
        return this._charts.indexOf(chart) >= 0;
    }

    register(chart: IMinimalChart): void {
        this._charts.push(chart);
    }

    deregister(chart: IMinimalChart): void {
        this._charts = this._charts.filter(ch => ch !== chart);
    }

    public clear(): void {
        this._charts = [];
    }

    renderAll(): void {
        for (const chart of this._charts) {
            chart.render();
        }
    }

    redrawAll(): void {
        for (const chart of this._charts) {
            chart.redraw();
        }
    }

    filterAll(): void {
        for (const chart of this._charts) {
            chart.filterAll();
        }
    }

    refocusAll(): void {
        for (const chart of this._charts) {
            if (chart.focus) {
                chart.focus();
            }
        }
    }
}
