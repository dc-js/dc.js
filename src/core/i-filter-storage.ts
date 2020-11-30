export interface IFilterListenerParams {
    storageKey: any;
    onFiltersChanged: (filters) => void;
    chartId: string;
    primaryChart: boolean;
}

export interface IFilterStorage {
    setFiltersFor(storageKey: any, filters);
    getFiltersFor(storageKey: any);
    registerFilterListener(opts: IFilterListenerParams): any;
    deRegisterFilterListener(storageKey: any, listner: any): void;
    notifyListeners(storageKey: any, filters): void;
    deRegisterAll(): void;
    serialize(): Object;
    restore(state: Object): void;
}
