import { CFSimpleAdapter, ICFSimpleAdapterConf } from './c-f-simple-adapter';
import { sum } from 'd3-array';
import { sortBy } from '../core/utils';

export interface ICFDataCapHelperConf extends ICFSimpleAdapterConf {
    readonly othersGrouper?: (topItems, restItems) => any;
    readonly othersLabel?: string;
    readonly takeFront?: boolean;
    readonly cap?: number;
}

export class CFDataCapHelper extends CFSimpleAdapter {
    protected _conf: ICFDataCapHelperConf;
    private _restKeys: string[];

    constructor(conf: ICFDataCapHelperConf = {}) {
        const defaultOthersGrouper = (topItems, restItems) => {
            // @ts-ignore
            const restItemsSum = sum(restItems, d => d._value);

            if (restItemsSum > 0) {
                return topItems.concat([
                    {
                        others: true,
                        key: this._conf.othersLabel,
                        _value: restItemsSum,
                    },
                ]);
            }
            return topItems;
        };

        super({
            cap: Infinity,
            takeFront: true,
            othersLabel: 'Others',
            othersGrouper: defaultOthersGrouper,
            ordering: kv => -kv.value, // emulate old group.top(N) ordering
            ...conf,
        });
    }

    public configure(conf: ICFDataCapHelperConf): this {
        return super.configure(conf);
    }

    public conf(): ICFDataCapHelperConf {
        return super.conf();
    }

    public data() {
        let items = sortBy(super.data(), this._conf.ordering);

        if (this._conf.cap === Infinity) {
            return items;
        }

        // return N "top" groups, where N is the cap, sorted by baseMixin.ordering
        // whether top means front or back depends on takeFront
        let rest;

        if (this._conf.cap) {
            if (this._conf.takeFront) {
                rest = items.slice(this._conf.cap);
                items = items.slice(0, this._conf.cap);
            } else {
                const start = Math.max(0, items.length - this._conf.cap);
                rest = items.slice(0, start);
                items = items.slice(start);
            }
        }

        if (this._conf.othersGrouper) {
            this._restKeys = rest.map(d => d.key);
            return this._conf.othersGrouper(items, rest);
        }

        return items;
    }

    public filter();
    public filter(filter): this;
    public filter(filter?) {
        if (!arguments.length) {
            return super.filter();
        }

        if (filter === this._conf.othersLabel) {
            // We have an interesting situation here. Cross filter expects lists of keys to filtered, while the chart needs
            // to see 'Others' also as part of the filters in order to fade that slice
            // A hack is to include all underlying keys as well as 'Others' to the filters.
            const filters = [...this._restKeys, this._conf.othersLabel];
            return super.filter([filters]);
        }

        return super.filter(filter);
    }
}
