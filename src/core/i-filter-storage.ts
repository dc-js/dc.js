import { ISerializedFilters } from './i-serialized-filters.js';

export interface IFilterListenerParams {
    storageKey: any;
    onFiltersChanged: (filters) => void;
    dimName: string;
    primaryChart: boolean;
    applyFilters: (filters) => void;
}

export interface ISerializeOpts {
    includeStorageKey?: boolean;
}

export interface IFilterStorage {
    setFiltersFor(storageKey: any, filters);
    getFiltersFor(storageKey: any);
    registerFilterListener(opts: IFilterListenerParams): any;
    deRegisterFilterListener(storageKey: any, listner: any): void;
    notifyListeners(storageKey: any, filters): void;
    deRegisterAll(): void;
    serialize(opts?: ISerializeOpts): ISerializedFilters[];
    restore(state: object): void;
}
