import { IChartGroup } from '../core/i-chart-group.js';
import { IFilterStorage } from '../core/i-filter-storage.js';
import { ISerializedFilters } from '../core/i-serialized-filters.js';

export interface IRemoteDataSourceConf {
    chartGroup?: IChartGroup;
    filterStorage?: IFilterStorage;
    remoteURL?: string;
}

function dateTimeReviver(key, value) {
    const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    if (typeof value === 'string' && dateFormat.test(value)) {
        return new Date(value);
    }
    return value;
}

export class RemoteDataSource {
    public data: any;
    private _conf: IRemoteDataSourceConf;

    constructor(conf: IRemoteDataSourceConf) {
        this.configure(conf);
        if (!conf.filterStorage) {
            this.configure({ filterStorage: conf.chartGroup.filterStorage });
        }
        this._hookToChartGroup();
    }

    public configure(conf: IRemoteDataSourceConf): this {
        this._conf = { ...this._conf, ...conf };
        return this;
    }

    public conf(): IRemoteDataSourceConf {
        return this._conf;
    }

    protected async fetchData(remoteURL: string, serializedFilters: ISerializedFilters[]) {
        const response = await fetch(remoteURL, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            body: JSON.stringify({ filters: serializedFilters }),
        });
        const txtBody = await response.text();
        return JSON.parse(txtBody, dateTimeReviver);
    }

    private _hookToChartGroup() {
        const chartGroup = this._conf.chartGroup;
        const refreshData = async () => {
            this.data = await this.fetchData(
                this._conf.remoteURL,
                this._conf.filterStorage.serialize()
            );
        };

        chartGroup.beforeRenderAll = refreshData;
        chartGroup.beforeRedrawAll = refreshData;
    }
}
