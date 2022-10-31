import { BaseAccessor, MinimalCFGroup, ValueAccessor } from '../core/types.js';
import { FilterStorageHelper, IFilterStorageConf } from './filter-storage-helper.js';

export interface ICFSimpleAdapterConf extends IFilterStorageConf {
    readonly group?: MinimalCFGroup;
    readonly groupName?: string;
    readonly valueAccessor?: ValueAccessor;
    readonly ordering?: BaseAccessor<any>;
}

export class CFSimpleAdapter extends FilterStorageHelper {
    protected _conf: ICFSimpleAdapterConf;

    constructor(conf: ICFSimpleAdapterConf = {}) {
        super({
            valueAccessor: d => d.value,
            ordering: d => d.key,
            ...conf,
        });
    }

    public configure(conf: ICFSimpleAdapterConf): this {
        return super.configure(conf);
    }

    public conf(): ICFSimpleAdapterConf {
        return super.conf();
    }

    // TODO: better typing
    public data(): any {
        const entities = this._conf.group.all();

        // create a two level deep copy defensively
        entities.map(val => ({ ...val }));

        entities.forEach(e => {
            e._value = this._conf.valueAccessor(e);
        });

        return entities;
    }
}
