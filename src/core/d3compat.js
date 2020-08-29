import {event} from 'd3-selection';
import {nest} from 'd3-collection';
import {groups} from 'd3-array';

// d3v6 has changed the arguments for event handlers.
// We are creating a wrapper which detects if the first argument is an event, which indicated d3@v6
// Otherwise we assume lower versions of d3.
// The underlying handler will always receive bound datum as the first argument and the event as the second argument.
// It is possible that any of these can actually be undefined (or null).
export function adaptHandler (handler) {
    return function (a, b) {
        if (a && a.target) {
            // d3@v6 - b is __data__, a is the event
            handler.call(this, b, a);
        } else {
            // older d3 - a is __data__, event from global d3.event
            handler.call(this, a, event);
        }
    }
}

function _d3v5Nester ({key, sortKeys, sortValues, entries}) {
    const nester = nest().key(key);
    if (sortKeys) {
        nester.sortKeys(sortKeys);
    }
    if (sortValues) {
        nester.sortValues(sortValues);
    }
    return nester.entries(entries);
}

function _d3v6Nester ({key, sortKeys, sortValues, entries}) {
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
        values: e[1]
    }));
}

export function compatNestHelper ({key, sortKeys, sortValues, entries}) {
    if (groups) {
        // d3@v6
        return _d3v6Nester({key, sortKeys, sortValues, entries});
    } else {
        // older d3
        return _d3v5Nester({key, sortKeys, sortValues, entries});
    }
}
