import { version } from 'd3';

import { event, mouse } from 'd3-selection';
import { nest } from 'd3-collection';

import { d3compat } from '../core/config';

const majorVer = +version[0];

if (majorVer < 6) {
    Object.assign(d3compat, {
        eventHandler: handler => function eventHandler (d, _) {
            handler.call(this, d, event);
        },
        // manual firing of event, usu for tests
        callHandler: function callHandler (handler, that, _, d) {
            // note: dropping event as well as any extra args
            // d3@6 does not pass extra args anymore, so we can't use them and remain compatible
            handler.call(that, d);
        },
        nester: ({key, sortKeys, sortValues, entries}) => {
            const nester = nest().key(key);
            if (sortKeys) {
                nester.sortKeys(sortKeys);
            }
            if (sortValues) {
                nester.sortValues(sortValues);
            }
            return nester.entries(entries);
        },
        pointer: (evt, elem) => mouse(elem)
    });
}
