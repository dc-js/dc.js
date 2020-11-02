import { MinimalCFGroup, ValueAccessor } from '../core/types';
import { CFSimpleAdapter, ICFSimpleAdapterConf } from './c-f-simple-adapter';

export interface LayerSpec {
    name: string;
    group: MinimalCFGroup;
    valueAccessor?: ValueAccessor;
    rawData?;
}

export interface ICFMultiAdapterConf extends ICFSimpleAdapterConf {
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
        const layers = this.layers().map(l => ({ ...l }));

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

    public layers(): LayerSpec[] {
        if (this._conf.group) {
            // if a stack configuration includes a `group` as well, that become the first layer
            const firstLayer = { name: this._conf.groupName, group: this._conf.group };

            return [firstLayer].concat(this._conf.layers);
        }
        return this._conf.layers;
    }

    public layerByName(name: string): LayerSpec {
        return this._conf.layers.find(l => l.name === name);
    }
}
