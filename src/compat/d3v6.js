import { version } from 'd3';

import { pointer } from 'd3-selection';
import { groups } from 'd3-array';

import { d3compat } from '../core/config';

const majorVer = +version[0];

if (majorVer > 5) {
    Object.assign(d3compat, {
        eventHandler: handler => function eventHandler (event, d) {
            handler.call(this, d, event);
        },
        // manual firing of event, usu for tests
        callHandler: function callHandler (handler, that, event, d) {
            handler.call(that, event, d);
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
