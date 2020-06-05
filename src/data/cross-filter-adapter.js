
export class CrossFilterAdapter {
    constructor () {
        this._group = undefined;
        this._dimension = undefined;
        this.cf = undefined;
    }

    dimension (dimension) {
        if (!arguments.length) {
            return this._dimension;
        }
        this._dimension = dimension;
        return this;
    }

    group (group) {
        if (!arguments.length) {
            return this._group;
        }
        this._group = group;
        return this;
    }

    clone () {
        return new CrossFilterAdapter(this.group(), this.dimension(), this.cf);
    }

    data () {
        // V5: revisit after creating separate classes for different types of data
        try {
            // create a copy defensively
            const values = this.group().all();
            return values.map(val => Object.assign({}, val));
        } catch (e) {
            // ignore
        }
        return [];
    }
}
