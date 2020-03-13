import {sum} from 'd3-array';

export const CapperMixin = Base => class extends Base {
    constructor () {
        super();

        this._cap = Infinity;
        this._takeFront = true;
        this._othersLabel = 'Others';
        this._restKeys = [];
        this._preCapOrderBy = kv => -kv.value;

        this._othersGrouper = (topItems, restItems) => {
            const restItemsSum = sum(restItems, d => d._value);

            this._restKeys = restItems.map(d => d.key);

            if (restItemsSum > 0) {
                return topItems.concat([{
                    key: this.othersLabel(),
                    _key: this.othersLabel(),
                    _value: restItemsSum
                }]);
            }
            return topItems;
        };

        // emulate old group.top(N) ordering
        // this.ordering(kv => -kv.value);
    }

    data () {
        let items = super.data();
        items = items.sort((a, b) => this._preCapOrderBy(a) - this._preCapOrderBy(b));

        if (this._cap === Infinity) {
            return items;
        } else {
            let rest;

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
    }

    filter (filter) {
        if (!arguments.length) {
            return super.filter();
        }

        if (filter === this.othersLabel()) {
            // We have an interesting situation here. Cross filter expects lists of keys to filtered, while the chart needs
            // to see 'Others' also as part of the filters in order to fade that slice
            // A hack is to include all underlying keys as well as 'Others' to the filters.
            const filters = Array.from(this._restKeys);
            filters.push(this.othersLabel());
            return super.filter([filters]);
        }

        return super.filter(filter);
    }

    cap (count) {
        if (!arguments.length) {
            return this._cap;
        }
        this._cap = count;
        return this;
    }

    takeFront (takeFront) {
        if (!arguments.length) {
            return this._takeFront;
        }
        this._takeFront = takeFront;
        return this;
    }

    othersLabel (label) {
        if (!arguments.length) {
            return this._othersLabel;
        }
        this._othersLabel = label;
        return this;
    }

    othersGrouper (grouperFunction) {
        if (!arguments.length) {
            return this._othersGrouper;
        }
        this._othersGrouper = grouperFunction;
        return this;
    }

    preCapOrderBy (preCapOrderBy) {
        if (!arguments.length) {
            return this._preCapOrderBy;
        }
        this._preCapOrderBy = preCapOrderBy;
        return this;
    }
};
