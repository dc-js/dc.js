import { version } from 'd3';

import { event, mouse } from 'd3-selection';
import { nest } from 'd3-collection';

import { d3compat } from '../core/config';

const majorVer = +version[0];

if (majorVer < 6) {
    Object.assign(d3compat, {
        eventHandler: handler => function eventHandler (a ,b) {
            if (a && a.target) {
                // d3@v6 - b is __data__, a is the event
                handler.call(this, b, a);
            } else {
                // older d3 - a is __data__, event from global d3.event
                handler.call(this, a, event);
            }
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