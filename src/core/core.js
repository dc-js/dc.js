import {config} from './config';
import {chartRegistry} from './chart-registry';

/**
 * The entire dc.js library is scoped under the **dc** name space. It does not introduce
 * anything else into the global name space.
 *
 * Most `dc` functions are designed to allow function chaining, meaning they return the current chart
 * instance whenever it is appropriate.  The getter forms of functions do not participate in function
 * chaining because they return values that are not the chart, although some,
 * such as {@link dc.baseMixin#svg .svg} and {@link dc.coordinateGridMixin#xAxis .xAxis},
 * return values that are themselves chainable d3 objects.
 * @namespace dc
 * @version <%= conf.pkg.version %>
 * @example
 * // Example chaining
 * chart.width(300)
 *      .height(300)
 *      .filter('sunday');
 */

/**
 * Clear all filters on all charts within the given chart group. If the chart group is not given then
 * only charts that belong to the default chart group will be reset.
 * @memberof dc
 * @method filterAll
 * @param {String} [group]
 * @return {undefined}
 */
export const filterAll = function (group) {
    const charts = chartRegistry.list(group);
    for (let i = 0; i < charts.length; ++i) {
        charts[i].filterAll();
    }
};

/**
 * Reset zoom level / focus on all charts that belong to the given chart group. If the chart group is
 * not given then only charts that belong to the default chart group will be reset.
 * @memberof dc
 * @method refocusAll
 * @param {String} [group]
 * @return {undefined}
 */
export const refocusAll = function (group) {
    const charts = chartRegistry.list(group);
    for (let i = 0; i < charts.length; ++i) {
        if (charts[i].focus) {
            charts[i].focus();
        }
    }
};

/**
 * Re-render all charts belong to the given chart group. If the chart group is not given then only
 * charts that belong to the default chart group will be re-rendered.
 * @memberof dc
 * @method renderAll
 * @param {String} [group]
 * @return {undefined}
 */
export const renderAll = function (group) {
    const charts = chartRegistry.list(group);
    for (let i = 0; i < charts.length; ++i) {
        charts[i].render();
    }

    if (config._renderlet !== null) {
        config._renderlet(group);
    }
};

/**
 * Redraw all charts belong to the given chart group. If the chart group is not given then only charts
 * that belong to the default chart group will be re-drawn. Redraw is different from re-render since
 * when redrawing dc tries to update the graphic incrementally, using transitions, instead of starting
 * from scratch.
 * @memberof dc
 * @method redrawAll
 * @param {String} [group]
 * @return {undefined}
 */
export const redrawAll = function (group) {
    const charts = chartRegistry.list(group);
    for (let i = 0; i < charts.length; ++i) {
        charts[i].redraw();
    }

    if (config._renderlet !== null) {
        config._renderlet(group);
    }
};

/**
 * Start a transition on a selection if transitions are globally enabled
 * ({@link dc.disableTransitions} is false) and the duration is greater than zero; otherwise return
 * the selection. Since most operations are the same on a d3 selection and a d3 transition, this
 * allows a common code path for both cases.
 * @memberof dc
 * @method transition
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
export const afterTransition = function (transition, callback) {
    if (transition.empty() || !transition.duration) {
        callback.call(transition);
    } else {
        let n = 0;
        transition
            .each(function () { ++n; })
            .on('end', function () {
                if (!--n) {
                    callback.call(transition);
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
