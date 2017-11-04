import * as d3 from 'd3';
import {constants} from './core';

let _dateFormat = d3.time.format('%m/%d/%Y');
/**
 * The default date format for dc.js
 * @memberof dc
 * @method dateFormat
 * @param {Function} [dateFormatter=d3.time.format('%m/%d/%Y')]
 * @return {Function}
 * @default d3.time.format('%m/%d/%Y')
 */
export function dateFormat (dateFormatter = d3.time.format('%m/%d/%Y')) {
    if (!arguments.length) {
        return _dateFormat;
    }
    _dateFormat = dateFormatter;
    return _dateFormat;
}

/**
 * @namespace printers
 * @memberof dc
 * @type {{}}
 */
export const printers = {};

/**
 * Converts a list of filters into a readable string.
 * @method filters
 * @memberof dc.printers
 * @param {Array<dc.filters>} filters
 * @returns {String}
 */
printers.filters = function (filters) {
    let s = '';

    for (let i = 0; i < filters.length; ++i) {
        if (i > 0) {
            s += ', ';
        }
        s += printers.filter(filters[i]);
    }

    return s;
};

/**
 * Converts a filter into a readable string.
 * @method filter
 * @memberof dc.printers
 * @param {dc.filters|any|Array<any>} filter
 * @returns {String}
 */
printers.filter = function (filter) {
    let s = '';

    if (typeof filter !== 'undefined' && filter !== null) {
        if (filter instanceof Array) {
            if (filter.length >= 2) {
                s = `[${utils.printSingleValue(filter[0])} -> ${utils.printSingleValue(filter[1])}]`;
            } else if (filter.length >= 1) {
                s = utils.printSingleValue(filter[0]);
            }
        } else {
            s = utils.printSingleValue(filter);
        }
    }

    return s;
};

/**
 * Returns a function that given a string property name, can be used to pluck the property off an object.  A function
 * can be passed as the second argument to also alter the data being returned.
 *
 * This can be a useful shorthand method to create accessor functions.
 * @method pluck
 * @memberof dc
 * @example
 * let xPluck = dc.pluck('x');
 * let objA = {x: 1};
 * xPluck(objA) // 1
 * @example
 * let xPosition = dc.pluck('x', function (x, i) {
 *     // `this` is the original datum,
 *     // `x` is the x property of the datum,
 *     // `i` is the position in the array
 *     return this.radius + x;
 * });
 * dc.selectAll('.circle').data(...).x(xPosition);
 * @param {String} n
 * @param {Function} [f]
 * @returns {Function}
 */
export function pluck (n, f) {
    if (!f) {
        return function (d) { return d[n]; };
    }
    return function (d, i) { return f.call(d, d[n], i); };
}

/**
 * @namespace utils
 * @memberof dc
 * @type {{}}
 */
export const utils = {};

/**
 * Print a single value filter.
 * @method printSingleValue
 * @memberof dc.utils
 * @param {any} filter
 * @returns {String}
 */
utils.printSingleValue = function (filter) {
    let s = `${filter}`;

    if (filter instanceof Date) {
        s = _dateFormat(filter);
    } else if (typeof (filter) === 'string') {
        s = filter;
    } else if (utils.isFloat(filter)) {
        s = utils.printSingleValue.fformat(filter);
    } else if (utils.isInteger(filter)) {
        s = Math.round(filter);
    }

    return s;
};
utils.printSingleValue.fformat = d3.format('.2f');

/**
 * Arbitrary add one value to another.
 * @method add
 * @memberof dc.utils
 * @todo
 * These assume than any string r is a percentage (whether or not it includes %).
 * They also generate strange results if l is a string.
 * @param {String|Date|Number} l the value to modify
 * @param {Number} r the amount by which to modify the value
 * @param {String} [t] if `l` is a `Date`, the
 * [interval](https://github.com/d3/d3-3.x-api-reference/blob/master/Time-Intervals.md#interval) in
 * the `d3.time` namespace
 * @returns {String|Date|Number}
 */
utils.add = function (l, r, t) {
    if (typeof r === 'string') {
        r = r.replace('%', '');
    }

    if (l instanceof Date) {
        if (typeof r === 'string') {
            r = +r;
        }
        if (t === 'millis') {
            return new Date(l.getTime() + r);
        }
        t = t || 'day';
        return d3.time[t].offset(l, r);
    } else if (typeof r === 'string') {
        const percentage = (+r / 100);
        return l > 0 ? l * (1 + percentage) : l * (1 - percentage);
    }
    return l + r;
};

/**
 * Arbitrary subtract one value from another.
 * @method subtract
 * @memberof dc.utils
 * @todo
 * These assume than any string r is a percentage (whether or not it includes %).
 * They also generate strange results if l is a string.
 * @param {String|Date|Number} l the value to modify
 * @param {Number} r the amount by which to modify the value
 * @param {String} [t] if `l` is a `Date`, the
 * [interval](https://github.com/d3/d3-3.x-api-reference/blob/master/Time-Intervals.md#interval) in
 * the `d3.time` namespace
 * @returns {String|Date|Number}
 */
utils.subtract = function (l, r, t) {
    if (typeof r === 'string') {
        r = r.replace('%', '');
    }

    if (l instanceof Date) {
        if (typeof r === 'string') {
            r = +r;
        }
        if (t === 'millis') {
            return new Date(l.getTime() - r);
        }
        t = t || 'day';
        return d3.time[t].offset(l, -r);
    } else if (typeof r === 'string') {
        const percentage = (+r / 100);
        return l < 0 ? l * (1 + percentage) : l * (1 - percentage);
    }
    return l - r;
};

/**
 * Is the value a number?
 * @method isNumber
 * @memberof dc.utils
 * @param {any} n
 * @returns {Boolean}
 */
utils.isNumber = function (n) {
    return n === +n;
};

/**
 * Is the value a float?
 * @method isFloat
 * @memberof dc.utils
 * @param {any} n
 * @returns {Boolean}
 */
utils.isFloat = function (n) {
    return n === +n && n !== (n | 0);
};

/**
 * Is the value an integer?
 * @method isInteger
 * @memberof dc.utils
 * @param {any} n
 * @returns {Boolean}
 */
utils.isInteger = function (n) {
    return n === +n && n === (n | 0);
};

/**
 * Is the value very close to zero?
 * @method isNegligible
 * @memberof dc.utils
 * @param {any} n
 * @returns {Boolean}
 */
utils.isNegligible = function (n) {
    return !utils.isNumber(n) || (n < constants.NEGLIGIBLE_NUMBER && n > -constants.NEGLIGIBLE_NUMBER);
};

/**
 * Ensure the value is no greater or less than the min/max values.  If it is return the boundary value.
 * @method clamp
 * @memberof dc.utils
 * @param {any} val
 * @param {any} min
 * @param {any} max
 * @returns {any}
 */
utils.clamp = function (val, min, max) {
    if (val < min) {
        return min;
    } else if (val > max) {
        return max;
    }
    return val;
};

/**
 * Using a simple static counter, provide a unique integer id.
 * @method uniqueId
 * @memberof dc.utils
 * @returns {Number}
 */
let _idCounter = 0;
utils.uniqueId = function () {
    return ++_idCounter;
};

/**
 * Convert a name to an ID.
 * @method nameToId
 * @memberof dc.utils
 * @param {String} name
 * @returns {String}
 */
utils.nameToId = function (name) {
    return name.toLowerCase().replace(/[\s]/g, '_').replace(/[.']/g, '');
};

/**
 * Append or select an item on a parent element.
 * @method appendOrSelect
 * @memberof dc.utils
 * @param {d3.selection} parent
 * @param {String} selector
 * @param {String} tag
 * @returns {d3.selection}
 */
utils.appendOrSelect = function (parent, selector, tag) {
    tag = tag || selector;
    let element = parent.select(selector);
    if (element.empty()) {
        element = parent.append(tag);
    }
    return element;
};

/**
 * Return the number if the value is a number; else 0.
 * @method safeNumber
 * @memberof dc.utils
 * @param {Number|any} n
 * @returns {Number}
 */
utils.safeNumber = function (n) { return utils.isNumber(+n) ? +n : 0; };
