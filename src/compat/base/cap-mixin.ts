import { Constructor } from '../../core/types';
import { BaseMixinExt } from './base-mixin';
import { BaseMixin as BaseMixinNeo } from '../../base/base-mixin';
import { CFDataCapHelper } from '../../data/c-f-data-cap-helper';

class Intermediate extends BaseMixinExt(BaseMixinNeo) {}

export function CapMixinExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);

            this.dataProvider(new CFDataCapHelper());
        }

        /**
         * Get or set the count of elements to that will be included in the cap. If there is an
         * {@link CapMixin#othersGrouper othersGrouper}, any further elements will be combined in an
         * extra element with its name determined by {@link CapMixin#othersLabel othersLabel}.
         *
         * As of dc.js 2.1 and onward, the capped charts use
         * {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#group_all group.all()}
         * and {@link BaseMixin#ordering BaseMixin.ordering()} to determine the order of
         * elements. Then `cap` and {@link CapMixin#takeFront takeFront} determine how many elements
         * to keep, from which end of the resulting array.
         *
         * **Migration note:** Up through dc.js 2.0.*, capping used
         * {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#group_top group.top(N)},
         * which selects the largest items according to
         * {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#group_order group.order()}.
         * The chart then sorted the items according to {@link BaseMixin#ordering baseMixin.ordering()}.
         * So the two values essentially had to agree, but if the `group.order()` was incorrect (it's
         * easy to forget about), the wrong rows or slices would be displayed, in the correct order.
         *
         * If your chart previously relied on `group.order()`, use `chart.ordering()` instead. As of
         * 2.1.5, the ordering defaults to sorting from greatest to least like `group.top(N)` did.
         *
         * If you want to cap by one ordering but sort by another, you can still do this by
         * specifying your own {@link BaseMixin#data `.data()`} callback. For details, see the example
         * {@link https://dc-js.github.io/dc.js/examples/cap-and-sort-differently.html Cap and Sort Differently}.
         * @memberof CapMixin
         * @instance
         * @param {Number} [count=Infinity]
         * @returns {Number|CapMixin}
         */
        public cap();
        public cap(count): this;
        public cap(count?) {
            if (!arguments.length) {
                // @ts-ignore
                return this._dataProvider.conf().cap;
            }
            // @ts-ignore
            this._dataProvider.configure({ cap: count });
            return this;
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
        public takeFront();
        public takeFront(takeFront): this;
        public takeFront(takeFront?) {
            if (!arguments.length) {
                // @ts-ignore
                return this._dataProvider.conf().takeFront;
            }
            // @ts-ignore
            this._dataProvider.configure({ takeFront: takeFront });
            return this;
        }

        /**
         * Get or set the label for *Others* slice when slices cap is specified.
         * @memberof CapMixin
         * @instance
         * @param {String} [label="Others"]
         * @returns {String|CapMixin}
         */
        public othersLabel();
        public othersLabel(label): this;
        public othersLabel(label?) {
            if (!arguments.length) {
                // @ts-ignore
                return this._dataProvider.conf().othersLabel;
            }
            // @ts-ignore
            this._dataProvider.configure({ othersLabel: label });
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
        public othersGrouper();
        public othersGrouper(grouperFunction): this;
        public othersGrouper(grouperFunction?) {
            if (!arguments.length) {
                // @ts-ignore
                return this._dataProvider.conf().othersGrouper;
            }
            // @ts-ignore
            this._dataProvider.configure({ othersGrouper: grouperFunction });
            return this;
        }
    };
}

export function CapMixin<TBase extends Constructor<BaseMixinNeo>>(Base: TBase) {
    return class extends CapMixinExt(BaseMixinExt(Base)) {
        constructor(...args: any[]) {
            super(...args);
        }
    };
}
