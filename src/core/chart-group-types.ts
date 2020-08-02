export interface IMinimalChart {
    render (): void;
    redraw (): void;
    filterAll (): void;
    focus? (): void;
}

export interface IChartGroup {
    register (chart: IMinimalChart): void;
    deregister (chart: IMinimalChart): void;
    renderAll (): void;
    redrawAll (): void;
    filterAll (): void;
    refocusAll (): void;
}
