import { nest } from 'd3-collection';
// @ts-ignore, it is missing in d3@v5
import { groups } from 'd3-array';

export interface INesterParams {
    key;
    sortKeys?;
    sortValues?;
    entries;
}

function _d3v5Nester({ key, sortKeys, sortValues, entries }: INesterParams) {
    const nester = nest().key(key);
    if (sortKeys) {
        nester.sortKeys(sortKeys);
    }
    if (sortValues) {
        nester.sortValues(sortValues);
    }
    return nester.entries(entries);
}

function _d3v6Nester({ key, sortKeys, sortValues, entries }: INesterParams) {
    if (sortValues) {
        entries = [...entries].sort(sortValues);
    }
    let out = groups(entries, key);
    if (sortKeys) {
        out = out.sort(sortKeys);
    }

    // remap to d3@v5 structure
    return out.map(e => ({
        key: `${e[0]}`, // d3@v5 always returns key as string
        values: e[1],
    }));
}

export function compatNestHelper({ key, sortKeys, sortValues, entries }: INesterParams) {
    if (groups) {
        // d3@v6
        return _d3v6Nester({ key, sortKeys, sortValues, entries });
    } else {
        // older d3
        return _d3v5Nester({ key, sortKeys, sortValues, entries });
    }
}
