export interface IFilter {
    filterType: string;
    isFiltered(value): boolean;
    serialize(): Object;
}
