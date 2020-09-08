import { MinimalCFGroup } from '../core/types';
import { CFFilterHandler, ICFFilterHandlerConf } from './c-f-filter-handler';

export interface ICFSimpleAdapterConf extends ICFFilterHandlerConf {
    group?: MinimalCFGroup;
}

export class CFSimpleAdapter extends CFFilterHandler {
    protected _conf: ICFSimpleAdapterConf;

    constructor() {
        super();
    }

    public configure(conf: ICFSimpleAdapterConf): this {
        return super.configure(conf);
    }

    public conf(): ICFSimpleAdapterConf {
        return super.conf();
    }

    public data() {
        const entities = this._conf.group.all();
        // create a two level deep copy defensively
        return entities.map(val => ({ ...val }));
    }
}
