export interface IMinimalChart {
    render(): void;
    redraw(): void;
    filterAll(): void;
    focus?(): void;
    dispose?(): void;
}

export interface IChartGroup {
    register(chart: IMinimalChart): void;
    deregister(chart: IMinimalChart): void;
    renderAll(): void;
    redrawAll(): void;
    filterAll(): void;
    refocusAll(): void;
    filterStorage: IFilterStorage;
}

export interface IFilterStorage {
    setFiltersFor(storageKey: any, filters);
    getFiltersFor(storageKey: any);
    registerFilterListener(storageKey: any, onFiltersChanged: (filters) => void): any;
    deRegisterFilterListener(storageKey: any, listner: any): void;
    notifyListeners(storageKey: any, filters): void;
    deRegisterAll(): void;
}
