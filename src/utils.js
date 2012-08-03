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

dc.constants = function() {
};
dc.constants.STACK_CLASS = "stack";
dc.constants.DESELECTED_CLASS = "deselected";
dc.constants.SELECTED_CLASS = "selected";
dc.constants.GROUP_INDEX_NAME = "__group_index__";

dc.utils = {};
dc.utils.GroupStack = function() {
    var _dataPointMatrix = [];
    var _groups = [];
    var _defaultRetriever;

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
            retriever = _defaultRetriever;
        _groups.push([group, retriever]);
        return _groups.length - 1;
    };

    this.getGroupByIndex = function(index) {
        return _groups[index][0];
    };

    this.getRetrieverByIndex = function(index) {
        return _groups[index][1];
    };

    this.size = function() {
        return _groups.length;
    };

    this.clear = function() {
        _dataPointMatrix = [];
        _groups = [];
    };

    this.setDefaultRetriever = function(retriever) {
        _defaultRetriever = retriever;
    };
};

dc.utils.CulmulativeReduceTarget = function() {
    var _keyIndex = [];
    var _map = {};

    function sanitizeKey(key) {
        key = key + "";
        return key;
    }

    this.addValue = function(key, value) {
        key = sanitizeKey(key);
        if (_map[key] == null) {
            _keyIndex.push(key);
            _map[key] = value;
        } else {
            _map[key] += value;
        }
    };

    this.minusValue = function(key, value) {
        key = sanitizeKey(key);
        _map[key] -= value;
    };

    this.getValueByKey = function(key) {
        key = sanitizeKey(key);
        return _map[key];
    };

    this.getCumulativeValueByKey = function(key) {
        key = sanitizeKey(key);
        var keyIndex = _keyIndex.indexOf(key);
        if (keyIndex < 0) return 0;
        var cumulativeValue = this.getValueByKey(key);
        for (var i = 0; i < keyIndex; ++i) {
            var k = _keyIndex[i];
            cumulativeValue += this.getValueByKey(k);
        }
        return cumulativeValue;
    };

    this.clear = function() {
        _keyIndex = [];
        _map = {};
    };

    this.size = function() {
        return _keyIndex.length;
    };

    this.index = function() {
        return _keyIndex;
    };

    this.map = function() {
        return _map;
    };
};
