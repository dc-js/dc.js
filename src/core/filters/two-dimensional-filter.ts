import { IFilter } from './i-filter';

export class TwoDimensionalFilter extends Array implements IFilter {
    public readonly filterType = 'TwoDimensionalFilter';

    constructor(filter) {
        super();
        this[0] = filter[0];
        this[1] = filter[1];
    }

    public isFiltered(value) {
        return (
            value.length &&
            value.length === this.length &&
            value[0] === this[0] &&
            value[1] === this[1]
        );
    }

    serialize (): Object {
        return [...this];
    }
}
