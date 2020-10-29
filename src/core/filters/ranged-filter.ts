import { IFilter } from './i-filter';

export class RangedFilter<T> extends Array<T> implements IFilter {
    readonly filterType = 'RangedFilter';

    constructor(low: T, high: T) {
        super();
        this[0] = low;
        this[1] = high;
    }

    isFiltered(value: T): boolean {
        return value >= this[0] && value < this[1];
    }
}
