import {FilterMixin} from './filter-mixin';

export class BasicTransformMixin extends FilterMixin {
    constructor () {
        super();

        this._keyAccessor = d => d.key;
        this._valueAccessor = d => d.value;
    }

    data () {
        const data = super.data();

        data.forEach(kv => {
            kv._key = this._keyAccessor(kv);
            kv._value = this._valueAccessor(kv);
        });

        return data;
    }

    keyAccessor (keyAccessor) {
        if (!arguments.length) {
            return this._keyAccessor;
        }
        this._keyAccessor = keyAccessor;
        return this;
    }

    valueAccessor (valueAccessor) {
        if (!arguments.length) {
            return this._valueAccessor;
        }
        this._valueAccessor = valueAccessor;
        return this;
    }

}
