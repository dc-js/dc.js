import {IChartGroup, IMinimalChart} from './chart-group-types';

export class ChartGroup implements IChartGroup {
    private _charts: IMinimalChart[];

    constructor () {
        this._charts = [];
    }

    public list (): IMinimalChart[] {
        return this._charts;
    }

    public has (chart: IMinimalChart): boolean {
        return this._charts.includes(chart);
    }

    public register (chart: IMinimalChart): void {
        this._charts.push(chart);
    }

    public deregister (chart: IMinimalChart): void {
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
        for (const chart of this._charts) {
            if (chart.focus) {
                chart.focus();
            }
        }
    }
}
