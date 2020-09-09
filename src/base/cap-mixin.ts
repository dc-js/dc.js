import { sum } from 'd3-array';
import { Constructor } from '../core/types';
import { ICapMixinConf } from './i-cap-mixin-conf';
import { IBaseMixinConf } from './i-base-mixin-conf';

interface MinimalBase {
    configure(conf: IBaseMixinConf);
    data();
    _computeOrderedGroups(arg0: any);
    onClick(d: any);
    filter(arg0: any[]);
}

/**
 * Cap is a mixin that groups small data elements below a _cap_ into an *others* grouping for both the
 * Row and Pie Charts.
 *
 * The top ordered elements in the group up to the cap amount will be kept in the chart, and the rest
 * will be replaced with an *others* element, with value equal to the sum of the replaced values. The
 * keys of the elements below the cap limit are recorded in order to filter by those keys when the
 * others* element is clicked.
 * @mixin CapMixin
 * @param {Object} Base
 * @returns {CapMixin}
 */
// tslint:disable-next-line:variable-name
export function CapMixin<TBase extends Constructor<MinimalBase>>(Base: TBase) {
    // @ts-ignore
    return class extends Base {
        public _conf: ICapMixinConf;

        constructor(...args: any[]) {
            super();

            const defaultOthersGrouper = (topItems, restItems) => {
                // @ts-ignore
                const restItemsSum = sum(restItems, d => d._value);
                const restKeys = restItems.map(this._conf.keyAccessor);

                if (restItemsSum > 0) {
                    return topItems.concat([
                        {
                            others: restKeys,
                            key: this._conf.othersLabel,
                            _value: restItemsSum,
                        },
                    ]);
                }
                return topItems;
            };

            this.configure({
                cap: Infinity,
                ordering: kv => -kv.value, // emulate old group.top(N) ordering
                takeFront: true,
                othersLabel: 'Others',
                othersGrouper: defaultOthersGrouper,
            });
        }

        public configure(conf: ICapMixinConf): this {
            super.configure(conf);
            return this;
        }

        public conf(): ICapMixinConf {
            return this._conf;
        }

        public data() {
            let items = this._computeOrderedGroups(super.data());

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
                return this._conf.othersGrouper(items, rest);
            }

            return items;
        }

        public cappedKeyAccessor(d, i?) {
            if (d.others) {
                return d.key;
            }
            return this._conf.keyAccessor(d, i);
        }

        public onClick(d, i?) {
            if (d.others) {
                this.filter([d.others]);
            }
            super.onClick(d);
        }
    };
}
