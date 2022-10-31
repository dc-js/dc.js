import { MinimalCFGroup, ValueAccessor } from '../core/types.js';
import { CFSimpleAdapter, ICFSimpleAdapterConf } from './c-f-simple-adapter.js';

export interface LayerSpec {
    name?: string;
    group?: MinimalCFGroup;
    valueAccessor?: ValueAccessor;
}

export interface ICFMultiAdapterConf extends ICFSimpleAdapterConf {
    readonly layers?: LayerSpec[];
}

export class CFMultiAdapter extends CFSimpleAdapter {
    protected _conf: ICFMultiAdapterConf;

    constructor(conf: ICFMultiAdapterConf = {}) {
        super({
            layers: [],
            valueAccessor: d => d.value,
            ...conf,
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
        return this.layers().map(layer => {
            const valueAccessor = layer.valueAccessor || this._conf.valueAccessor;
            // Two level defensive copy
            const rawData = layer.group.all().map(val => ({ ...val, _value: valueAccessor(val) }));

            return { name: layer.name, rawData };
        });
    }

    public layers(): LayerSpec[] {
        if (this._conf.group) {
            // if a stack configuration includes a `group` as well, that become the first layer
            const firstLayer: LayerSpec = { name: this._conf.groupName, group: this._conf.group };

            return [firstLayer].concat(this._conf.layers);
        }
        return this._conf.layers;
    }

    public layerByName(name: string): LayerSpec {
        return this._conf.layers.find(l => l.name === name);
    }
}
