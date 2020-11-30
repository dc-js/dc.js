export interface IFilterStorage {
    setFiltersFor(storageKey: any, filters);
    getFiltersFor(storageKey: any);
    registerFilterListener(storageKey: any, onFiltersChanged: (filters) => void): any;
    deRegisterFilterListener(storageKey: any, listner: any): void;
    notifyListeners(storageKey: any, filters): void;
    deRegisterAll(): void;
}
