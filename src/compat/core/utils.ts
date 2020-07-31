import {
    add,
    allChildren,
    appendOrSelect,
    arraysEqual,
    arraysIdentical,
    clamp,
    constant,
    getAncestors,
    isFloat,
    isInteger,
    isNegligible,
    isNumber,
    nameToId,
    printSingleValue,
    safeNumber,
    subtract,
    toHierarchy,
    uniqueId
} from '../../core/utils';

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
export const pluck = function (n, f?) {
    if (!f) {
        return function (d) { return d[n]; };
    }
    return function (d, i) { return f.call(d, d[n], i); };
};

/**
 * @namespace utils
 * @type {{}}
 */
export const utils = {
    add: add,
    allChildren: allChildren,
    appendOrSelect: appendOrSelect,
    arraysEqual: arraysEqual,
    arraysIdentical: arraysIdentical,
    clamp: clamp,
    constant: constant,
    getAncestors: getAncestors,
    isFloat: isFloat,
    isInteger: isInteger,
    isNegligible: isNegligible,
    isNumber: isNumber,
    nameToId: nameToId,
    printSingleValue: printSingleValue,
    safeNumber: safeNumber,
    subtract: subtract,
    toHierarchy: toHierarchy,
    uniqueId: uniqueId
};
