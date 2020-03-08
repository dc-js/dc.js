
export class DataProvider {
    constructor () {
        this.group = undefined;
        this.dimension = undefined;
        this.cf = undefined;
    }

    clone () {
        return new DataProvider(this.group, this.dimension, this.cf);
    }
}
