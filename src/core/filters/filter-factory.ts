import { RangedFilter } from './ranged-filter.js';
import { RangedTwoDimensionalFilter } from './ranged-two-dimensional-filter.js';
import { TwoDimensionalFilter } from './two-dimensional-filter.js';
import { HierarchyFilter } from './hierarchy-filter.js';
import { IFilter } from './i-filter.js';

export const filterFactory: { [k: string]: (entry: any) => IFilter } = {
    HierarchyFilter: entry => new HierarchyFilter(entry),
    RangedFilter: entry => new RangedFilter(entry[0], entry[1]),
    RangedTwoDimensionalFilter: entry => new RangedTwoDimensionalFilter(entry),
    TwoDimensionalFilter: entry => new TwoDimensionalFilter(entry),
};
