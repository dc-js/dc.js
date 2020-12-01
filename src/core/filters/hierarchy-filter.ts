import { IFilter } from './i-filter';

export class HierarchyFilter extends Array implements IFilter {
    public readonly filterType = 'HierarchyFilter';

    constructor(path) {
        super();

        for (let i = 0; i < path.length; i++) {
            this[i] = path[i];
        }
    }

    public isFiltered(value): boolean {
        const filter = this;

        if (!(filter.length && value && value.length && value.length >= filter.length)) {
            return false;
        }

        for (let i = 0; i < filter.length; i++) {
            if (value[i] !== filter[i]) {
                return false;
            }
        }

        return true;
    }

    serialize (): Object {
        return [...this];
    }
}
