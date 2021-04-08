import { version } from 'd3';

import { pointer } from 'd3-selection';
import { groups } from 'd3-array';

import { d3compat } from '../core/config';

const majorVer = +version[0];

if (majorVer > 5) {
    Object.assign(d3compat, {
        eventHandler: handler => function (a, b) {
            if (a && a.target) {
                // d3@v6 - b is __data__, a is the event
                handler.call(this, b, a);
            } else {
                // older d3 - a is __data__, event from global d3.event
                handler.call(this, a);
            }
        },
        nester: ({key, sortKeys, sortValues, entries}) => {
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
        },
        pointer
    });
}