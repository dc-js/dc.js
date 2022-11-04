import { CFSimpleAdapter, ICFSimpleAdapterConf } from '../data/c-f-simple-adapter.js';
import { RemoteDataSource } from './remote-data-source.js';

export interface IRemoteSimpleAdapterConf extends ICFSimpleAdapterConf{
    remoteDataSource?: RemoteDataSource
}

export class RemoteSimpleAdapter extends CFSimpleAdapter {
    protected _conf: IRemoteSimpleAdapterConf;

    constructor(conf: IRemoteSimpleAdapterConf = {}) {
        super(conf);
    }

    public configure(conf: IRemoteSimpleAdapterConf): this {
        return super.configure(conf);
    }

    public conf(): IRemoteSimpleAdapterConf {
        return super.conf();
    }

    // Do nothing, filters will be applied in the remote source
    applyFilters() {}

    data() {
        const chartId = this.conf().chartId;
        const entry = this.conf().remoteDataSource.data.chartData.find(e => e.chartId === chartId);
        return entry.values;
    }
}
