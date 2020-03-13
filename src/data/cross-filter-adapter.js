
export class CrossFilterAdapter {
    constructor () {
        this.group = undefined;
        this.dimension = undefined;
        this.cf = undefined;
    }

    clone () {
        return new CrossFilterAdapter(this.group, this.dimension, this.cf);
    }

    data () {
        // V5: revisit after creating separate classes for different types of data
        try {
            // create a copy defensively
            const values = this.group.all();
            return values.map(val => Object.assign({}, val));
        } catch (e) {
            // ignore
        }
        return [];
    }
}
