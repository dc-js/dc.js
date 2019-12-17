import {sum} from 'd3-array';

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
export const CapMixin = Base => class extends Base {
    constructor () {
        super();

        this._cap = Infinity;
        this._takeFront = true;
        this._othersLabel = 'Others';

        this._othersGrouper = (topItems, restItems) => {
            const restItemsSum = sum(restItems, this.valueAccessor()),
                restKeys = restItems.map(this.keyAccessor());
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
        this.ordering(kv => -kv.value);

        // return N "top" groups, where N is the cap, sorted by baseMixin.ordering
        // whether top means front or back depends on takeFront
        this.data(group => {
            if (this._cap === Infinity) {
                return this._computeOrderedGroups(group.all());
            } else {
                let items = group.all(), rest;
                items = this._computeOrderedGroups(items); // sort by baseMixin.ordering

                if (this._cap) {
                    if (this._takeFront) {
                        rest = items.slice(this._cap);
                        items = items.slice(0, this._cap);
                    } else {
                        const start = Math.max(0, items.length - this._cap);
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

    cappedKeyAccessor (d, i) {
        if (d.others) {
            return d.key;
        }
        return this.keyAccessor()(d, i);
    }

    cappedValueAccessor (d, i) {
        if (d.others) {
            return d.value;
        }
        return this.valueAccessor()(d, i);
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
    cap (count) {
        if (!arguments.length) {
            return this._cap;
        }
        this._cap = count;
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
    takeFront (takeFront) {
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
    othersLabel (label) {
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
    othersGrouper (grouperFunction) {
        if (!arguments.length) {
            return this._othersGrouper;
        }
        this._othersGrouper = grouperFunction;
        return this;
    }

    onClick (d) {
        if (d.others) {
            this.filter([d.others]);
        }
        super.onClick(d);
    }
};
