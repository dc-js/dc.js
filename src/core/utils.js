import {timeDay, timeHour, timeMinute, timeMonth, timeSecond, timeWeek, timeYear} from 'd3-time';
import {format} from 'd3-format';

import {constants} from './constants';
import {config} from './config';

/**
 * Returns a function that given a string property name, can be used to pluck the property off an object.  A function
 * can be passed as the second argument to also alter the data being returned.
 *
 * This can be a useful shorthand method to create accessor functions.
 * @example
 * var xPluck = pluck('x');
 * var objA = {x: 1};
 * xPluck(objA) // 1
 * @example
 * var xPosition = pluck('x', function (x, i) {
 *     // `this` is the original datum,
 *     // `x` is the x property of the datum,
 *     // `i` is the position in the array
 *     return this.radius + x;
 * });
 * selectAll('.circle').data(...).x(xPosition);
 * @function pluck
 * @param {String} n
 * @param {Function} [f]
 * @returns {Function}
 */
export const pluck = function (n, f) {
    if (!f) {
        return function (d) { return d[n]; };
    }
    return function (d, i) { return f.call(d, d[n], i); };
};

/**
 * @namespace utils
 * @type {{}}
 */
export const utils = {};

/**
 * Print a single value filter.
 * @method printSingleValue
 * @memberof utils
 * @param {any} filter
 * @returns {String}
 */
utils.printSingleValue = function (filter) {
    let s = `${filter}`;

    if (filter instanceof Date) {
        s = config.dateFormat(filter);
    } else if (typeof (filter) === 'string') {
        s = filter;
    } else if (utils.isFloat(filter)) {
        s = utils.printSingleValue.fformat(filter);
    } else if (utils.isInteger(filter)) {
        s = Math.round(filter);
    }

    return s;
};
utils.printSingleValue.fformat = format('.2f');

// convert 'day' to d3.timeDay and similar
utils._toTimeFunc = function (t) {
    const mappings = {
        'second': timeSecond,
        'minute': timeMinute,
        'hour': timeHour,
        'day': timeDay,
        'week': timeWeek,
        'month': timeMonth,
        'year': timeYear
    };
    return mappings[t];
};

/**
 * Arbitrary add one value to another.
 *
 * If the value l is of type Date, adds r units to it. t becomes the unit.
 * For example utils.add(dt, 3, 'week') will add 3 (r = 3) weeks (t= 'week') to dt.
 *
 * If l is of type numeric, t is ignored. In this case if r is of type string,
 * it is assumed to be percentage (whether or not it includes %). For example
 * utils.add(30, 10) will give 40 and utils.add(30, '10') will give 33.
 *
 * They also generate strange results if l is a string.
 * @method add
 * @memberof utils
 * @param {Date|Number} l the value to modify
 * @param {String|Number} r the amount by which to modify the value
 * @param {Function|String} [t=d3.timeDay] if `l` is a `Date`, then this should be a
 * [d3 time interval](https://github.com/d3/d3-time/blob/master/README.md#_interval).
 * For backward compatibility with dc.js 2.0, it can also be the name of an interval, i.e.
 * 'millis', 'second', 'minute', 'hour', 'day', 'week', 'month', or 'year'
 * @returns {Date|Number}
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
        t = t || timeDay;
        if (typeof t !== 'function') {
            t = utils._toTimeFunc(t);
        }
        return t.offset(l, r);
    } else if (typeof r === 'string') {
        const percentage = (+r / 100);
        return l > 0 ? l * (1 + percentage) : l * (1 - percentage);
    } else {
        return l + r;
    }
};

/**
 * Arbitrary subtract one value from another.
 *
 * If the value l is of type Date, subtracts r units from it. t becomes the unit.
 * For example utils.subtract(dt, 3, 'week') will subtract 3 (r = 3) weeks (t= 'week') from dt.
 *
 * If l is of type numeric, t is ignored. In this case if r is of type string,
 * it is assumed to be percentage (whether or not it includes %). For example
 * utils.subtract(30, 10) will give 20 and utils.subtract(30, '10') will give 27.
 *
 * They also generate strange results if l is a string.
 * @method subtract
 * @memberof utils
 * @param {Date|Number} l the value to modify
 * @param {String|Number} r the amount by which to modify the value
 * @param {Function|String} [t=d3.timeDay] if `l` is a `Date`, then this should be a
 * [d3 time interval](https://github.com/d3/d3-time/blob/master/README.md#_interval).
 * For backward compatibility with dc.js 2.0, it can also be the name of an interval, i.e.
 * 'millis', 'second', 'minute', 'hour', 'day', 'week', 'month', or 'year'
 * @returns {Date|Number}
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
        t = t || timeDay;
        if (typeof t !== 'function') {
            t = utils._toTimeFunc(t);
        }
        return t.offset(l, -r);
    } else if (typeof r === 'string') {
        const percentage = (+r / 100);
        return l < 0 ? l * (1 + percentage) : l * (1 - percentage);
    } else {
        return l - r;
    }
};

/**
 * Is the value a number?
 * @method isNumber
 * @memberof utils
 * @param {any} n
 * @returns {Boolean}
 */
utils.isNumber = function (n) {
    return n === +n;
};

/**
 * Is the value a float?
 * @method isFloat
 * @memberof utils
 * @param {any} n
 * @returns {Boolean}
 */
utils.isFloat = function (n) {
    return n === +n && n !== (n | 0);
};

/**
 * Is the value an integer?
 * @method isInteger
 * @memberof utils
 * @param {any} n
 * @returns {Boolean}
 */
utils.isInteger = function (n) {
    return n === +n && n === (n | 0);
};

/**
 * Is the value very close to zero?
 * @method isNegligible
 * @memberof utils
 * @param {any} n
 * @returns {Boolean}
 */
utils.isNegligible = function (n) {
    return !utils.isNumber(n) || (n < constants.NEGLIGIBLE_NUMBER && n > -constants.NEGLIGIBLE_NUMBER);
};

/**
 * Ensure the value is no greater or less than the min/max values.  If it is return the boundary value.
 * @method clamp
 * @memberof utils
 * @param {any} val
 * @param {any} min
 * @param {any} max
 * @returns {any}
 */
utils.clamp = function (val, min, max) {
    return val < min ? min : (val > max ? max : val);
};

/**
 * Given `x`, return a function that always returns `x`.
 *
 * {@link https://github.com/d3/d3/blob/master/CHANGES.md#internals `d3.functor` was removed in d3 version 4}.
 * This function helps to implement the replacement,
 * `typeof x === "function" ? x : utils.constant(x)`
 * @method constant
 * @memberof utils
 * @param {any} x
 * @returns {Function}
 */
utils.constant = function (x) {
    return function () {
        return x;
    };
};

/**
 * Using a simple static counter, provide a unique integer id.
 * @method uniqueId
 * @memberof utils
 * @returns {Number}
 */
let _idCounter = 0;
utils.uniqueId = function () {
    return ++_idCounter;
};

/**
 * Convert a name to an ID.
 * @method nameToId
 * @memberof utils
 * @param {String} name
 * @returns {String}
 */
utils.nameToId = function (name) {
    return name.toLowerCase().replace(/[\s]/g, '_').replace(/[\.']/g, '');
};

/**
 * Append or select an item on a parent element.
 * @method appendOrSelect
 * @memberof utils
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
 * @memberof utils
 * @param {Number|any} n
 * @returns {Number}
 */
utils.safeNumber = function (n) { return utils.isNumber(+n) ? +n : 0;};

/**
 * Return true if both arrays are equal, if both array are null these are considered equal
 * @method arraysEqual
 * @memberof utils
 * @param {Array|null} a1
 * @param {Array|null} a2
 * @returns {Boolean}
 */
utils.arraysEqual = function (a1, a2) {
    if (!a1 && !a2) {
        return true;
    }

    if (!a1 || !a2) {
        return false;
    }

    return a1.length === a2.length &&
        // If elements are not integers/strings, we hope that it will match because of toString
        // Test cases cover dates as well.
        a1.every((elem, i) => elem.valueOf() === a2[i].valueOf());
};

// ******** Sunburst Chart ********
utils.allChildren = function (node) {
    let paths = [];
    paths.push(node.path);
    console.log('currentNode', node);
    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            paths = paths.concat(utils.allChildren(node.children[i]));
        }
    }
    return paths;
};

// builds a d3 Hierarchy from a collection
// TODO: turn this monster method something better.
utils.toHierarchy = function (list, accessor) {
    const root = {'key': 'root', 'children': []};
    for (let i = 0; i < list.length; i++) {
        const data = list[i];
        const parts = data.key;
        const value = accessor(data);
        let currentNode = root;
        for (let j = 0; j < parts.length; j++) {
            const currentPath = parts.slice(0, j + 1);
            const children = currentNode.children;
            const nodeName = parts[j];
            let childNode;
            if (j + 1 < parts.length) {
                // Not yet at the end of the sequence; move down the tree.
                childNode = findChild(children, nodeName);

                // If we don't already have a child node for this branch, create it.
                if (childNode === void 0) {
                    childNode = {'key': nodeName, 'children': [], 'path': currentPath};
                    children.push(childNode);
                }
                currentNode = childNode;
            } else {
                // Reached the end of the sequence; create a leaf node.
                childNode = {'key': nodeName, 'value': value, 'data': data, 'path': currentPath};
                children.push(childNode);
            }
        }
    }
    return root;
};

function findChild (children, nodeName) {
    for (let k = 0; k < children.length; k++) {
        if (children[k].key === nodeName) {
            return children[k];
        }
    }
}

utils.getAncestors = function (node) {
    const path = [];
    let current = node;
    while (current.parent) {
        path.unshift(current.name);
        current = current.parent;
    }
    return path;
};

utils.arraysIdentical = function (a, b) {
    let i = a.length;
    if (i !== b.length) {
        return false;
    }
    while (i--) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
};
