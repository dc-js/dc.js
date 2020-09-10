import { MinimalCFGroup, ValueAccessor } from '../core/types';
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
    readonly layers?: LayerSpec[];
}

export class CFMultiAdapter extends CFSimpleAdapter {
    protected _conf: ICFMultiAdapterConf;

    constructor() {
        super();

        this.configure({
            layers: [],
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
        // Two level defensive copy
        const layers: any[] = this._conf.layers.map(l => ({ ...l }));
        layers.forEach(layer => {
            const valueAccessor = layer.valueAccessor || this._conf.valueAccessor;
            // Two level defensive copy
            const rawData = layer.group.all().map(val => ({ ...val }));
            rawData.forEach(d => {
                d._value = valueAccessor(d);
            });
            layer.rawData = rawData;
        });
        return layers;
    }
}
