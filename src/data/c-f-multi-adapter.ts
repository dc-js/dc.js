import { ICFFilterHandlerConf } from './c-f-filter-handler';
import { CFGrouping, MinimalCFGroup, ValueAccessor } from '../core/types';
import { CFSimpleAdapter, ICFSimpleAdapterConf } from './c-f-simple-adapter';

export interface LayerSpec {
    name: string;
    group: MinimalCFGroup;
    valueAccessor?: ValueAccessor;
    rawData?;
}

export interface ICFMultiAdapterConf extends ICFSimpleAdapterConf {
    readonly group?: MinimalCFGroup;
    readonly valueAccessor?: ValueAccessor;
    readonly stack?: LayerSpec[];
}

export class CFMultiAdapter extends CFSimpleAdapter {
    protected _conf: ICFMultiAdapterConf;

    constructor() {
        super();

        this.configure({
            stack: [],
            valueAccessor: d => d.value,
        });
    }

    public configure(conf: ICFMultiAdapterConf): this {
        return super.configure(conf);
    }

    public conf(): ICFMultiAdapterConf {
        return super.conf();
    }

    // TODO: better typing
    public data(): any {
        return this._conf.stack.map(layer => {
            let entities = layer.group.all();

            // create a two level deep copy defensively
            entities.map(val => ({ ...val }));

            const valueAccessor = layer.valueAccessor || this._conf.valueAccessor;
            entities.forEach(e => {
                e._value = valueAccessor(e);
            });

            return {
                name: layer.name,
                rawData: entities,
            };
        });
    }
}
