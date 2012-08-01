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

    this.addValue = function(key, value) {
        _keyIndex.push(key);
        _map[key] = value;
    };

    this.getValueByKey = function(key) {
        return _map[key];
    };

    this.getPreviousValueByKey = function(key){
        var keyIndex = _keyIndex.indexOf(key);
        var previousKey = _keyIndex[keyIndex - 1];
        return this.getValueByKey(previousKey);
    };

    this.clear = function(){
        _keyIndex = [];
        _map = {};
    };
};
