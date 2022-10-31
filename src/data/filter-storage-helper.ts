import { CFFilterHandler, ICFFilterHandlerConf } from './c-f-filter-handler.js';
import { IFilterStorage } from '../core/i-filter-storage.js';

export interface IFilterStorageConf extends ICFFilterHandlerConf {
    readonly filterStorage?: IFilterStorage;
    readonly chartId?: string;
    readonly primaryChart?: boolean;
    readonly shareFilters?: boolean;
    readonly onFiltersChanged?: (filters) => void;
}

export class FilterStorageHelper extends CFFilterHandler {
    private _listenerRegToken: any;
    protected _conf: IFilterStorageConf;

    constructor(conf: IFilterStorageConf = {}) {
        super({
            // @ts-ignore
            shareFilters: true,
            ...conf,
        });
    }

    public conf(): IFilterStorageConf {
        return super.conf();
    }

    public configure(conf: IFilterStorageConf): this {
        super.configure(conf);
        this._ensureListenerRegistered();
        return this;
    }

    private _ensureListenerRegistered() {
        if (!this._conf.filterStorage) {
            return;
        }

        // If it was already registered, we check if the storage ky is still same
        // in case that has changed we need to de-register and register afresh

        const storageKey = this._storageKey();

        if (this._listenerRegToken) {
            if (this._listenerRegToken.storageKey === storageKey) {
                // all good, storageKey has not changed
                return;
            }
            // storageKey changed, de-register first
            this._deRegisterListener();
        }

        this._listenerRegToken = this._conf.filterStorage.registerFilterListener({
            storageKey,
            onFiltersChanged: this._conf.onFiltersChanged,
            chartId: this._conf.chartId,
            primaryChart: this._conf.primaryChart,
            applyFilters: filters => this.applyFilters(),
        });
    }

    private _deRegisterListener() {
        this._conf.filterStorage.deRegisterFilterListener(
            this._listenerRegToken.storageKey,
            this._listenerRegToken
        );
        this._listenerRegToken = undefined;
    }

    private _storageKey() {
        if (this._conf.shareFilters) {
            return this._conf.dimension;
        } else {
            return this;
        }
    }

    get filters(): any[] {
        return this._conf.filterStorage.getFiltersFor(this._storageKey());
    }

    set filters(value: any[]) {
        this._conf.filterStorage.setFiltersFor(this._storageKey(), value);
    }

    public notifyListeners(filters) {
        this._conf.filterStorage.notifyListeners(this._storageKey(), filters);
    }

    public dispose() {
        super.dispose();
        if (this._listenerRegToken) {
            this._deRegisterListener();
        }
    }
}
