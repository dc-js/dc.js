dc.dateFormat = d3.time.format("%m/%d/%Y");

dc.printers = {};
dc.printers.filter = function(filter) {
    var s = "";

    if (filter) {
        if (filter instanceof Array) {
            if (filter.length >= 2)
                s = "[" + printSingleValue(filter[0]) + " -> " + printSingleValue(filter[1]) + "]";
            else if (filter.length >= 1)
                s = printSingleValue(filter[0]);
        } else {
            s = printSingleValue(filter)
        }
    }

    return s;
};

function printSingleValue(filter) {
    var s = "" + filter;

    if (filter instanceof Date)
        s = dc.dateFormat(filter);
    else if (typeof(filter) == "string")
        s = filter;
    else if (typeof(filter) == "number")
        s = Math.round(filter);

    return s;
}

dc.utils = {};
dc.utils.add = function(l, r) {
    if (l instanceof Date) {
        var d = new Date();
        d.setTime(l.getTime());
        d.setDate(l.getDate() + r);
        return d;
    } else {
        return l + r;
    }
};
dc.utils.subtract = function(l, r) {
    if (l instanceof Date) {
        var d = new Date();
        d.setTime(l.getTime());
        d.setDate(l.getDate() - r);
        return d;
    } else {
        return l - r;
    }
};
dc.utils.GroupStack = function() {
    var _dataPointMatrix = [];
    var _groups = [];
    var _defaultAccessor;

    function initializeDataPointRow(x) {
        if (!_dataPointMatrix[x])
            _dataPointMatrix[x] = [];
    }

    this.setDataPoint = function(x, y, data) {
        initializeDataPointRow(x);
        _dataPointMatrix[x][y] = data;
    };

    this.getDataPoint = function(x, y) {
        initializeDataPointRow(x);
        var dataPoint = _dataPointMatrix[x][y];
        if (dataPoint == undefined)
            dataPoint = 0;
        return dataPoint;
    };

    this.addGroup = function(group, retriever) {
        if (!retriever)
            retriever = _defaultAccessor;
        _groups.push([group, retriever]);
        return _groups.length - 1;
    };

    this.getGroupByIndex = function(index) {
        return _groups[index][0];
    };

    this.getAccessorByIndex = function(index) {
        return _groups[index][1];
    };

    this.size = function() {
        return _groups.length;
    };

    this.clear = function() {
        _dataPointMatrix = [];
        _groups = [];
    };

    this.setDefaultAccessor = function(retriever) {
        _defaultAccessor = retriever;
    };
};

dc.utils.groupMax = function(group, accessor) {
    return d3.max(group.all(), function(e) {
        return accessor(e);
    });
};

dc.utils.groupMin = function(group, accessor) {
    return d3.min(group.all(), function(e) {
        return accessor(e);
    });
};

dc.utils.nameToId = function(name){
    return name.toLowerCase().replace(/[\s]/g, "_").replace(/[\.']/g, "");
};
