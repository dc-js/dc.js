/**
 * The default date format for dc.js
 * @name dateFormat
 * @memberof dc
 * @type {Function}
 * @default d3.timeFormat('%m/%d/%Y')
 */
dc.dateFormat = d3.timeFormat('%m/%d/%Y');

/**
 * @namespace printers
 * @memberof dc
 * @type {{}}
 */
dc.printers = {};

/**
 * Converts a list of filters into a readable string.
 * @method filters
 * @memberof dc.printers
 * @param {Array<dc.filters>} filters
 * @returns {String}
 */
dc.printers.filters = function (filters) {
    var s = '';

    for (var i = 0; i < filters.length; ++i) {
        if (i > 0) {
            s += ', ';
        }
        s += dc.printers.filter(filters[i]);
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
dc.printers.filter = function (filter) {
    var s = '';

    if (typeof filter !== 'undefined' && filter !== null) {
        if (filter instanceof Array) {
            if (filter.length >= 2) {
                s = '[' + dc.utils.printSingleValue(filter[0]) + ' -> ' + dc.utils.printSingleValue(filter[1]) + ']';
            } else if (filter.length >= 1) {
                s = dc.utils.printSingleValue(filter[0]);
            }
        } else {
            s = dc.utils.printSingleValue(filter);
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
 * var xPluck = dc.pluck('x');
 * var objA = {x: 1};
 * xPluck(objA) // 1
 * @example
 * var xPosition = dc.pluck('x', function (x, i) {
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
dc.pluck = function (n, f) {
    if (!f) {
        return function (d) { return d[n]; };
    }
    return function (d, i) { return f.call(d, d[n], i); };
};

/**
 * @namespace utils
 * @memberof dc
 * @type {{}}
 */
dc.utils = {};

/**
 * Print a single value filter.
 * @method printSingleValue
 * @memberof dc.utils
 * @param {any} filter
 * @returns {String}
 */
dc.utils.printSingleValue = function (filter) {
    var s = '' + filter;

    if (filter instanceof Date) {
        s = dc.dateFormat(filter);
    } else if (typeof(filter) === 'string') {
        s = filter;
    } else if (dc.utils.isFloat(filter)) {
        s = dc.utils.printSingleValue.fformat(filter);
    } else if (dc.utils.isInteger(filter)) {
        s = Math.round(filter);
    }

    return s;
};
dc.utils.printSingleValue.fformat = d3.format('.2f');

// convert 'day' to 'timeDay' and similar
dc.utils.toTimeFunc = function (t) {
    return 'time' + t.charAt(0).toUpperCase() + t.slice(1);
};

/**
 * Arbitrary add one value to another.
 *
 * If the value l is of type Date, adds r units to it. t becomes the unit.
 * For example dc.utils.add(dt, 3, 'week') will add 3 (r = 3) weeks (t= 'week') to dt.
 *
 * If l is of type numeric, t is ignored. In this case if r is of type string,
 * it is assumed to be percentage (whether or not it includes %). For example
 * dc.utils.add(30, 10) will give 40 and dc.utils.add(30, '10') will give 33.
 *
 * They also generate strange results if l is a string.
 * @method add
 * @memberof dc.utils
 * @param {Date|Number} l the value to modify
 * @param {String|Number} r the amount by which to modify the value
 * @param {Function|String} [t=d3.timeDay] if `l` is a `Date`, then this should be a
 * [d3 time interval](https://github.com/d3/d3-time/blob/master/README.md#_interval).
 * For backward compatibility with dc.js 2.0, it can also be the name of an interval, i.e.
 * 'millis', 'second', 'minute', 'hour', 'day', 'week', 'month', or 'year'
 * @returns {Date|Number}
 */
dc.utils.add = function (l, r, t) {
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
        t = t || d3.timeDay;
        if (typeof t !== 'function') {
            t = d3[dc.utils.toTimeFunc(t)];
        }
        return t.offset(l, r);
    } else if (typeof r === 'string') {
        var percentage = (+r / 100);
        return l > 0 ? l * (1 + percentage) : l * (1 - percentage);
    } else {
        return l + r;
    }
};

/**
 * Arbitrary subtract one value from another.
 *
 * If the value l is of type Date, subtracts r units from it. t becomes the unit.
 * For example dc.utils.subtract(dt, 3, 'week') will subtract 3 (r = 3) weeks (t= 'week') from dt.
 *
 * If l is of type numeric, t is ignored. In this case if r is of type string,
 * it is assumed to be percentage (whether or not it includes %). For example
 * dc.utils.subtract(30, 10) will give 20 and dc.utils.subtract(30, '10') will give 27.
 *
 * They also generate strange results if l is a string.
 * @method subtract
 * @memberof dc.utils
 * @param {Date|Number} l the value to modify
 * @param {String|Number} r the amount by which to modify the value
 * @param {Function|String} [t=d3.timeDay] if `l` is a `Date`, then this should be a
 * [d3 time interval](https://github.com/d3/d3-time/blob/master/README.md#_interval).
 * For backward compatibility with dc.js 2.0, it can also be the name of an interval, i.e.
 * 'millis', 'second', 'minute', 'hour', 'day', 'week', 'month', or 'year'
 * @returns {Date|Number}
 */
dc.utils.subtract = function (l, r, t) {
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
        t = t || d3.timeDay;
        if (typeof t !== 'function') {
            t = d3[dc.utils.toTimeFunc(t)];
        }
        return t.offset(l, -r);
    } else if (typeof r === 'string') {
        var percentage = (+r / 100);
        return l < 0 ? l * (1 + percentage) : l * (1 - percentage);
    } else {
        return l - r;
    }
};

/**
 * Is the value a number?
 * @method isNumber
 * @memberof dc.utils
 * @param {any} n
 * @returns {Boolean}
 */
dc.utils.isNumber = function (n) {
    return n === +n;
};

/**
 * Is the value a float?
 * @method isFloat
 * @memberof dc.utils
 * @param {any} n
 * @returns {Boolean}
 */
dc.utils.isFloat = function (n) {
    return n === +n && n !== (n | 0);
};

/**
 * Is the value an integer?
 * @method isInteger
 * @memberof dc.utils
 * @param {any} n
 * @returns {Boolean}
 */
dc.utils.isInteger = function (n) {
    return n === +n && n === (n | 0);
};

/**
 * Is the value very close to zero?
 * @method isNegligible
 * @memberof dc.utils
 * @param {any} n
 * @returns {Boolean}
 */
dc.utils.isNegligible = function (n) {
    return !dc.utils.isNumber(n) || (n < dc.constants.NEGLIGIBLE_NUMBER && n > -dc.constants.NEGLIGIBLE_NUMBER);
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
dc.utils.clamp = function (val, min, max) {
    return val < min ? min : (val > max ? max : val);
};

/**
 * Given `x`, return a function that always returns `x`.
 *
 * {@link https://github.com/d3/d3/blob/master/CHANGES.md#internals `d3.functor` was removed in d3 version 4}.
 * This function helps to implement the replacement,
 * `typeof x === "function" ? x : dc.utils.constant(x)`
 * @method constant
 * @memberof dc.utils
 * @param {any} x
 * @returns {Function}
 */
dc.utils.constant = function (x) {
    return function () {
        return x;
    };
};

/**
 * Using a simple static counter, provide a unique integer id.
 * @method uniqueId
 * @memberof dc.utils
 * @returns {Number}
 */
var _idCounter = 0;
dc.utils.uniqueId = function () {
    return ++_idCounter;
};

/**
 * Convert a name to an ID.
 * @method nameToId
 * @memberof dc.utils
 * @param {String} name
 * @returns {String}
 */
dc.utils.nameToId = function (name) {
    return name.toLowerCase().replace(/[\s]/g, '_').replace(/[\.']/g, '');
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
dc.utils.appendOrSelect = function (parent, selector, tag) {
    tag = tag || selector;
    var element = parent.select(selector);
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
dc.utils.safeNumber = function (n) { return dc.utils.isNumber(+n) ? +n : 0;};

/**
 * Return true if both arrays are equal, if both array are null these are considered equal
 * @method arraysEqual
 * @memberof dc.utils
 * @param {Array|null} a1
 * @param {Array|null} a2
 * @returns {Boolean}
 */
dc.utils.arraysEqual = function (a1, a2) {
    if (!a1 || !a2) {
        return a1 === a2;
    }

    return a1.length === a2.length &&
        // If elements are not integers/strings, we hope that it will match because of toString
        // Test cases cover dates as well.
        a1.every(function (elem, i) {
            return elem === a2[i] || elem.toString() === a2[i].toString();
        });
};

// ******** Sunburst Chart ********
dc.utils.allChildren = function (node) {
    var paths = [];
    paths.push(node.path);
    console.log('currentNode', node);
    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            paths = paths.concat(dc.utils.allChildren(node.children[i]));
        }
    }
    return paths;
};

// builds a d3 Hierarchy from a collection
// TODO: turn this monster method something better.
dc.utils.toHierarchy = function (list, accessor) {
    var root = {'key': 'root', 'children': []};
    for (var i = 0; i < list.length; i++) {
        var data = list[i];
        var parts = data.key;
        var value = accessor(data);
        var currentNode = root;
        for (var j = 0; j < parts.length; j++) {
            var currentPath = parts.slice(0, j + 1);
            var children = currentNode.children;
            var nodeName = parts[j];
            var childNode;
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
    for (var k = 0; k < children.length; k++) {
        if (children[k].key === nodeName) {
            return children[k];
        }
    }
}

dc.utils.getAncestors = function (node) {
    var path = [];
    var current = node;
    while (current.parent) {
        path.unshift(current.name);
        current = current.parent;
    }
    return path;
};

dc.utils.arraysIdentical = function (a, b) {
    var i = a.length;
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
