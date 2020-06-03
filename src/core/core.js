import {config} from './config';

/**
 * Start a transition on a selection if transitions are globally enabled
 * ({@link disableTransitions} is false) and the duration is greater than zero; otherwise return
 * the selection. Since most operations are the same on a d3 selection and a d3 transition, this
 * allows a common code path for both cases.
 * @function transition
 * @param {d3.selection} selection - the selection to be transitioned
 * @param {Number|Function} [duration=250] - the duration of the transition in milliseconds, a
 * function returning the duration, or 0 for no transition
 * @param {Number|Function} [delay] - the delay of the transition in milliseconds, or a function
 * returning the delay, or 0 for no delay
 * @param {String} [name] - the name of the transition (if concurrent transitions on the same
 * elements are needed)
 * @returns {d3.transition|d3.selection}
 */
export const transition = function (selection, duration, delay, name) {
    if (config.disableTransitions || duration <= 0) {
        return selection;
    }

    let s = selection.transition(name);

    if (duration >= 0 || duration !== undefined) {
        s = s.duration(duration);
    }
    if (delay >= 0 || delay !== undefined) {
        s = s.delay(delay);
    }

    return s;
};

/* somewhat silly, but to avoid duplicating logic */
export const optionalTransition = function (enable, duration, delay, name) {
    if (enable) {
        return function (selection) {
            return transition(selection, duration, delay, name);
        };
    } else {
        return function (selection) {
            return selection;
        };
    }
};

// See http://stackoverflow.com/a/20773846
export const afterTransition = function (_transition, callback) {
    if (_transition.empty() || !_transition.duration) {
        callback.call(_transition);
    } else {
        let n = 0;
        _transition
            .each(() => { ++n; })
            .on('end', () => {
                if (!--n) {
                    callback.call(_transition);
                }
            });
    }
};

export const renderlet = function (_) {
    if (!arguments.length) {
        return config._renderlet;
    }
    config._renderlet = _;
    return null;
};

export const instanceOfChart = function (o) {
    return o instanceof Object && o.__dcFlag__ && true;
};
