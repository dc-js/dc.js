import { RangedFilter } from './ranged-filter';
import { RangedTwoDimensionalFilter } from './ranged-two-dimensional-filter';
import { TwoDimensionalFilter } from './two-dimensional-filter';
import { HierarchyFilter } from './hierarchy-filter';
import { IFilter } from './i-filter';

export const filterFactory: { [k: string]: (entry: any) => IFilter } = {
    HierarchyFilter: entry => new HierarchyFilter(entry),
    RangedFilter: entry => new RangedFilter(entry[0], entry[1]),
    RangedTwoDimensionalFilter: entry => new RangedTwoDimensionalFilter(entry),
    TwoDimensionalFilter: entry => new TwoDimensionalFilter(entry),
};
