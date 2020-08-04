import {Constructor} from '../../core/types';
import {BaseMixinExt} from './base-mixin';
import {CapMixin as CapMixinNeo} from '../../base/cap-mixin';
import {BaseMixin as BaseMixinNeo} from '../../base/base-mixin';

class Intermediate extends BaseMixinExt(CapMixinNeo(BaseMixinNeo)) { }

export function CapMixinExt<TBase extends Constructor<Intermediate>>(Base: TBase) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
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
        public cap ();
        public cap (count): this;
        public cap (count?) {
            if (!arguments.length) {
                return this._conf.cap;
            }
            this._conf.cap = count;
            return this;
        }
    }
}

export function CapMixin<TBase extends Constructor<BaseMixinNeo>>(Base: TBase) {
    return class extends CapMixinExt(CapMixinNeo(BaseMixinExt(Base))) {
        constructor(...args: any[]) {
            super(...args);
        }
    }
}
