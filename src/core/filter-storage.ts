import { IFilterListenerParams, IFilterStorage, ISerializeOpts } from './i-filter-storage.js';
import { IFilter } from './filters/i-filter.js';
import { filterFactory } from './filters/filter-factory.js';
import { ISerializedFilters } from './i-serialized-filters.js';
import { Dispatch, dispatch } from 'd3-dispatch';

export class FilterStorage implements IFilterStorage {
    // Current filters
    private _filters;

    // List of listeners for each storage key
    // Storage key will be dimension (id shareFilters is true) or the chart itself
    private _listenerChains: Map<any, IFilterListenerParams[]>;

    // notify when filter changes for any of the charts
    private _filterChangeListener: Dispatch<object>;

    constructor() {
        this._filters = new Map();
        this._listenerChains = new Map();
        this._filterChangeListener = dispatch('filter-changed');
    }

    public onFilterChange(key: string, callback) {
        this._filterChangeListener.on(`filter-changed.${key}`, callback);
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

        const chartIds = listenerChain.map(lsnr => lsnr.dimName);
        this._filterChangeListener.call('filter-changed', this, {
            chartIds,
            filters: this._filters.get(storageKey),
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

    public resetFiltersAndNotify(storageKey) {
        this.setFiltersAndNotify(storageKey, []);
    }

    public setFiltersAndNotify(storageKey, filters) {
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

    public deserializeFiltersSetAndNotify(storageKey, entry) {
        const filters = this._deSerializeFilters(entry.filterType, entry.values);
        this.setFiltersAndNotify(storageKey, filters);
    }

    public serialize({ includeStorageKey }: ISerializeOpts = {}): ISerializedFilters[] {
        // Include items that have active filters
        // In case of Composite charts, include only the parent chart
        return Array.from(this._listenerChains.values())
            .map(listenersList => {
                // check if any item in the list corresponds to a non-child chart
                const listener = listenersList.find(l => l.primaryChart);

                if (listener) {
                    const filters = this._filters.get(listener.storageKey);
                    if (filters && filters.length > 0) {
                        const entry = this._serializeFilters(listener.dimName, filters);
                        if (includeStorageKey) {
                            entry.storageKey = listener.storageKey;
                        }
                        return entry;
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
                    lsnrsChain.find(listener => listener.dimName === entry.dimName)
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

            this.setFiltersAndNotify(storageKey, filters);
        }
    }

    private _serializeFilters(dimName: string, filters: any[]): ISerializedFilters {
        if (typeof filters[0].isFiltered !== 'function') {
            return {
                dimName,
                filterType: 'Simple',
                values: [...filters], // defensively clone
            };
        }

        const filtersWithType: IFilter[] = filters;
        return {
            dimName,
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
