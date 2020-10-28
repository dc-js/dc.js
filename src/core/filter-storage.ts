import { IFilterStorage } from './chart-group-types';

export class FilterStorage implements IFilterStorage {
    // Current filters
    private _filters;

    // List of listeners for each storage key
    // Storage key will be dimension (id shareFilters is true) or the chart itself
    private _listeners: Map<any, { onFiltersChanged: (filters) => void }[]>;

    constructor() {
        this._filters = new Map();
        this._listeners = new Map();
    }

    public registerFilterListener(storageKey: any, onFiltersChanged: (filters) => void): any {
        if (!(this._listeners.get(storageKey) && this._listeners.get(storageKey).length >= 0)) {
            this._listeners.set(storageKey, []);
        }
        const listener = {
            onFiltersChanged,
            storageKey,
        };
        this._listeners.get(storageKey).push(listener);
        return listener;
    }

    public deRegisterFilterListener(storageKey: any, listener: any): void {
        // exclude this listener and retain the rest
        let listeners = this._listeners.get(storageKey);
        listeners = listeners.filter(l => l !== listener);
        this._listeners.set(storageKey, listeners);
    }

    public deRegisterAll(): void {
        this._filters = new Map();
        this._listeners = new Map();
    }

    public notifyListeners(storageKey: any, filters) {
        const listeners = this._listeners.get(storageKey);
        listeners
            .filter(l => typeof l.onFiltersChanged === 'function')
            .forEach(l => {
                l.onFiltersChanged(filters);
            });
    }

    public setFiltersFor(storageKey: any, filters) {
        this._filters.set(storageKey, filters);
    }

    public getFiltersFor(storageKey: any) {
        if (!this._filters.get(storageKey)) {
            this._filters.set(storageKey, []);
        }
        return this._filters.get(storageKey);
    }
}
