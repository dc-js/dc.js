import {sum} from 'd3-array';
import {Constructor} from '../core/types';
import {BaseMixin} from './base-mixin';
import {ICapMixinConf} from './i-cap-mixin-conf';

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
export function CapMixin<TBase extends Constructor<BaseMixin>> (Base: TBase) {
    // @ts-ignore
    return class extends Base {
        public _conf: ICapMixinConf;

        private _takeFront: boolean;
        private _othersLabel: string;
        private _othersGrouper: (topItems, restItems) => (any);

        constructor (...args: any[]) {
            super();

            this._conf.cap = Infinity;
            this._takeFront = true;
            this._othersLabel = 'Others';

            this._othersGrouper = (topItems, restItems) => {
                const restItemsSum = sum(restItems, this.valueAccessor());
                const restKeys = restItems.map(this.keyAccessor());

                if (restItemsSum > 0) {
                    return topItems.concat([{
                        others: restKeys,
                        key: this.othersLabel(),
                        value: restItemsSum
                    }]);
                }
                return topItems;
            };

            // emulate old group.top(N) ordering
            this._conf.ordering = kv => -kv.value;

            // return N "top" groups, where N is the cap, sorted by baseMixin.ordering
            // whether top means front or back depends on takeFront
            this.data(group => {
                if (this._conf.cap === Infinity) {
                    return this._computeOrderedGroups(group.all());
                } else {
                    let items = group.all();
                    let rest;

                    items = this._computeOrderedGroups(items); // sort by baseMixin.ordering

                    if (this._conf.cap) {
                        if (this._takeFront) {
                            rest = items.slice(this._conf.cap);
                            items = items.slice(0, this._conf.cap);
                        } else {
                            const start = Math.max(0, items.length - this._conf.cap);
                            rest = items.slice(0, start);
                            items = items.slice(start);
                        }
                    }

                    if (this._othersGrouper) {
                        return this._othersGrouper(items, rest);
                    }
                    return items;
                }
            });
        }

        public cappedKeyAccessor (d, i?) {
            if (d.others) {
                return d.key;
            }
            return this.keyAccessor()(d, i);
        }

        public cappedValueAccessor (d, i?) {
            if (d.others) {
                return d.value;
            }
            return this.valueAccessor()(d, i);
        }

        /**
         * Get or set the direction of capping. If set, the chart takes the first
         * {@link CapMixin#cap cap} elements from the sorted array of elements; otherwise
         * it takes the last `cap` elements.
         * @memberof CapMixin
         * @instance
         * @param {Boolean} [takeFront=true]
         * @returns {Boolean|CapMixin}
         */
        public takeFront ();
        public takeFront (takeFront): this;
        public takeFront (takeFront?) {
            if (!arguments.length) {
                return this._takeFront;
            }
            this._takeFront = takeFront;
            return this;
        }

        /**
         * Get or set the label for *Others* slice when slices cap is specified.
         * @memberof CapMixin
         * @instance
         * @param {String} [label="Others"]
         * @returns {String|CapMixin}
         */
        public othersLabel ();
        public othersLabel (label): this;
        public othersLabel (label?) {
            if (!arguments.length) {
                return this._othersLabel;
            }
            this._othersLabel = label;
            return this;
        }

        /**
         * Get or set the grouper function that will perform the insertion of data for the *Others* slice
         * if the slices cap is specified. If set to a falsy value, no others will be added.
         *
         * The grouper function takes an array of included ("top") items, and an array of the rest of
         * the items. By default the grouper function computes the sum of the rest.
         * @memberof CapMixin
         * @instance
         * @example
         * // Do not show others
         * chart.othersGrouper(null);
         * // Default others grouper
         * chart.othersGrouper(function (topItems, restItems) {
         *     var restItemsSum = d3.sum(restItems, _chart.valueAccessor()),
         *         restKeys = restItems.map(_chart.keyAccessor());
         *     if (restItemsSum > 0) {
         *         return topItems.concat([{
         *             others: restKeys,
         *             key: _chart.othersLabel(),
         *             value: restItemsSum
         *         }]);
         *     }
         *     return topItems;
         * });
         * @param {Function} [grouperFunction]
         * @returns {Function|CapMixin}
         */
        public othersGrouper ();
        public othersGrouper (grouperFunction): this;
        public othersGrouper (grouperFunction?) {
            if (!arguments.length) {
                return this._othersGrouper;
            }
            this._othersGrouper = grouperFunction;
            return this;
        }

        public onClick (d, i?) {
            if (d.others) {
                this.filter([d.others]);
            }
            super.onClick(d);
        }
    }
}
