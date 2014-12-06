dc.dateFormat = d3.time.format('%m/%d/%Y');

dc.printers = {};

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

dc.pluck = function (n, f) {
    if (!f) {
        return function (d) { return d[n]; };
    }
    return function (d, i) { return f.call(d, d[n], i); };
};

dc.utils = {};

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

// FIXME: these assume than any string r is a percentage (whether or not it
// includes %). They also generate strange results if l is a string.
dc.utils.add = function (l, r) {
    if (typeof r === 'string') {
        r = r.replace('%', '');
    }

    if (l instanceof Date) {
        if (typeof r === 'string') {
            r = +r;
        }
        var d = new Date();
        d.setTime(l.getTime());
        d.setDate(l.getDate() + r);
        return d;
    } else if (typeof r === 'string') {
        var percentage = (+r / 100);
        return l > 0 ? l * (1 + percentage) : l * (1 - percentage);
    } else {
        return l + r;
    }
};

dc.utils.subtract = function (l, r) {
    if (typeof r === 'string') {
        r = r.replace('%', '');
    }

    if (l instanceof Date) {
        if (typeof r === 'string') {
            r = +r;
        }
        var d = new Date();
        d.setTime(l.getTime());
        d.setDate(l.getDate() - r);
        return d;
    } else if (typeof r === 'string') {
        var percentage = (+r / 100);
        return l < 0 ? l * (1 + percentage) : l * (1 - percentage);
    } else {
        return l - r;
    }
};

dc.utils.isNumber = function (n) {
    return n === +n;
};

dc.utils.isFloat = function (n) {
    return n === +n && n !== (n | 0);
};

dc.utils.isInteger = function (n) {
    return n === +n && n === (n | 0);
};

dc.utils.isNegligible = function (n) {
    return !dc.utils.isNumber(n) || (n < dc.constants.NEGLIGIBLE_NUMBER && n > -dc.constants.NEGLIGIBLE_NUMBER);
};

dc.utils.clamp = function (val, min, max) {
    return val < min ? min : (val > max ? max : val);
};

var _idCounter = 0;
dc.utils.uniqueId = function () {
    return ++_idCounter;
};

dc.utils.nameToId = function (name) {
    return name.toLowerCase().replace(/[\s]/g, '_').replace(/[\.']/g, '');
};

dc.utils.appendOrSelect = function (parent, selector, tag) {
    tag = tag || selector;
    var element = parent.select(selector);
    if (element.empty()) {
        element = parent.append(tag);
    }
    return element;
};

dc.utils.safeNumber = function (n) { return dc.utils.isNumber(+n) ? +n : 0;};
