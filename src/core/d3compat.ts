// @ts-ignore, TODO
import { event } from 'd3-selection';
// @ts-ignore, it is missing in d3@v5
import { groups } from 'd3-array';

// d3v6 has changed the arguments for event handlers.
// We are creating a wrapper which detects if the first argument is an event, which indicated d3@v6
// Otherwise we assume lower versions of d3.
// The underlying handler will always receive bound datum as the first argument and the event as the second argument.
// It is possible that any of these can actually be undefined (or null).
export function adaptHandler(handler) {
    return function (a, b) {
        if (a && a.target) {
            // d3@v6 - b is __data__, a is the event
            handler.call(this, b, a);
        } else {
            // older d3 - a is __data__, event from global d3.event
            handler.call(this, a, event);
        }
    };
}
