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
                var foundChild = false;
                for (var k = 0; k < children.length; k++) {
                    if (children[k].key === nodeName) {
                        childNode = children[k];
                        foundChild = true;
                        break;
                    }
                }
            // If we don't already have a child node for this branch, create it.
                if (!foundChild) {
                    childNode = {'key': nodeName, 'children': [], 'path':currentPath};
                    children.push(childNode);
                }
                currentNode = childNode;
            } else {
                // Reached the end of the sequence; create a leaf node.
                childNode = {'key': nodeName, 'value': value, 'data': data, 'path':currentPath};
                children.push(childNode);
            }
        }
    }
    return root;
};

dc.utils.getAncestors = function (node) {
    var path = [];
    var current = node;
    while (current.parent) {
        path.unshift(current.name);
        current = current.parent;
    }
    return path;
};

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
