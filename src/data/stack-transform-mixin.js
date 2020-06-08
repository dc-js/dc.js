
export const StackTransformMixin =  Base => class extends Base {
    constructor () {
        super();

        this._keyAccessor = d => d.key;
        this._valueAccessor = d => d.value;
    }

    data () {
        const data = super.data();

        data.forEach(l => {
            const valAccessor = l.accessor || this.valueAccessor();
            l.rawData.forEach(kv => {
                kv._key = this._keyAccessor(kv);
                kv._value = valAccessor(kv);
            });
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

};
