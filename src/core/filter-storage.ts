import { IFilterListenerParams, IFilterStorage } from './i-filter-storage';
import { IFilter } from './filters/i-filter';
import { filterFactory } from './filters/filter-factory';
import { ISerializedFilters } from './i-serialized-filters';

export class FilterStorage implements IFilterStorage {
    // Current filters
    private _filters;

    // List of listeners for each storage key
    // Storage key will be dimension (id shareFilters is true) or the chart itself
    private _listenerChains: Map<any, IFilterListenerParams[]>;

    constructor() {
        this._filters = new Map();
        this._listenerChains = new Map();
    }

    public registerFilterListener(params: IFilterListenerParams): any {
        const storageKey = params.storageKey;
        if (!this._listenerChains.get(storageKey)) {
            this._listenerChains.set(storageKey, []);
        }
        const listener = { ...params };
        this._listenerChains.get(storageKey).push(listener);
        return listener;
    }

    public deRegisterFilterListener(storageKey: any, listener: any): void {
        // exclude this listener and retain the rest
        let listenerChain = this._listenerChains.get(storageKey);
        listenerChain = listenerChain.filter(l => l !== listener);
        this._listenerChains.set(storageKey, listenerChain);
    }

    public deRegisterAll(): void {
        this._filters = new Map();
        this._listenerChains = new Map();
    }

    public notifyListeners(storageKey: any, filters) {
        const listenerChain = this._listenerChains.get(storageKey);
        listenerChain
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

    public serialize(): object[] {
        // Include items that have active filters
        // In case of Composite charts, include only the parent chart
        return Array.from(this._listenerChains.values())
            .map(listenersList => {
                // check if any item in the list corresponds to a non-child chart
                const listener = listenersList.find(l => l.primaryChart);

                if (listener) {
                    const filters = this._filters.get(listener.storageKey);
                    if (filters && filters.length > 0) {
                        return this._serializeFilters(listener.chartId, filters);
                    }
                }
                return undefined;
            })
            .filter(o => o); // Exclude all undefined
    }

    public restore(entries: ISerializedFilters[]): void {
        const listenerChains = Array.from(this._listenerChains.values());

        const filtersToRestore = new Map(
            entries.map(entry => {
                // Find a listenerChain that has same chartId registered
                const listenerChain = listenerChains.find((lsnrsChain: IFilterListenerParams[]) =>
                    lsnrsChain.find(listener => listener.chartId === entry.chartId)
                );

                // convert to appropriate dc IFilter objects
                const filters = this._deSerializeFilters(entry.filterType, entry.values);

                // pickup storageKey from first entry - all entries will have same storage key
                const storageKey = listenerChain[0].storageKey;

                return [storageKey, filters];
            })
        );

        for (const storageKey of this._listenerChains.keys()) {
            // reset a filter if it is not getting restored
            const filters = filtersToRestore.has(storageKey)
                ? filtersToRestore.get(storageKey)
                : [];

            // Update filters in the storage
            this.setFiltersFor(storageKey, filters);

            // Apply filters with the DataProvider - it will update CrossFilter
            // Applying it to just first entry is sufficient as these share the underlying dimension
            const listenerChain = this._listenerChains.get(storageKey);
            if (listenerChain && listenerChain[0]) {
                listenerChain[0].applyFilters(filters);
            }

            // Notify charts that filter has been updated
            this.notifyListeners(storageKey, filters);
        }
    }

    private _serializeFilters(chartId: string, filters: any[]): ISerializedFilters {
        if (typeof filters[0].isFiltered !== 'function') {
            return {
                chartId,
                filterType: 'Simple',
                values: filters,
            };
        }

        const filtersWithType: IFilter[] = filters;
        return {
            chartId,
            filterType: filtersWithType[0].filterType,
            values: filtersWithType.map(f => f.serialize()),
        };
    }

    private _deSerializeFilters(filterType, values) {
        // Simple filters are simple list of items, not need to any additional instantiation
        if (filterType === 'Simple') {
            return values;
        }

        // Lookup filter factory based on the filter type
        const filterCreator = filterFactory[filterType];

        return values.map(f => filterCreator(f));
    }
}
