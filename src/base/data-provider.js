
export class DataProvider {
    constructor (group, dimension) {
        this.group = group;
        this.dimension = dimension;
        this.cf = null;
    }

    clone () {
        return new DataProvider(this.group, this.dimension, this.cf);
    }
}
