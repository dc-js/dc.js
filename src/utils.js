dc.dateFormat = d3.time.format("%m/%d/%Y");

dc.printers = {};

dc.printers.filters = function (filters) {
    var s = "";

    for (var i = 0; i < filters.length; ++i) {
        if (i > 0) s += ", ";
        s += dc.printers.filter(filters[i]);
    }

    return s;
};

dc.printers.filter = function (filter) {
    var s = "";

    if (filter) {
        if (filter instanceof Array) {
            if (filter.length >= 2)
                s = "[" + dc.utils.printSingleValue(filter[0]) + " -> " + dc.utils.printSingleValue(filter[1]) + "]";
            else if (filter.length >= 1)
                s = dc.utils.printSingleValue(filter[0]);
        } else {
            s = dc.utils.printSingleValue(filter);
        }
    }

    return s;
};

dc.pluck = function(n,f) {
    return function(d,i) {
        return f ? f.call(this,d[n],i) : d[n];
    };
};

dc.utils = {};

dc.utils.printSingleValue = function (filter) {
    var s = "" + filter;

    if (filter instanceof Date)
        s = dc.dateFormat(filter);
    else if (typeof(filter) == "string")
        s = filter;
    else if (dc.utils.isFloat(filter))
        s = dc.utils.printSingleValue.fformat(filter);
    else if (dc.utils.isInteger(filter))
        s = Math.round(filter);

    return s;
};
dc.utils.printSingleValue.fformat = d3.format(".2f");

dc.utils.add = function (l, r) {
    if (typeof r === "string")
        r = r.replace("%", "");

    if (l instanceof Date) {
        if (typeof r === "string") r = +r;
        var d = new Date();
        d.setTime(l.getTime());
        d.setDate(l.getDate() + r);
        return d;
    } else if (typeof r === "string") {
        var percentage = (+r / 100);
        return l > 0 ? l * (1 + percentage) : l * (1 - percentage);
    } else {
        return l + r;
    }
};

dc.utils.subtract = function (l, r) {
    if (typeof r === "string")
        r = r.replace("%", "");

    if (l instanceof Date) {
        if (typeof r === "string") r = +r;
        var d = new Date();
        d.setTime(l.getTime());
        d.setDate(l.getDate() - r);
        return d;
    } else if (typeof r === "string") {
        var percentage = (+r / 100);
        return l < 0 ? l * (1 + percentage) : l * (1 - percentage);
    } else {
        return l - r;
    }
};

dc.utils.GroupStack = function () {
    var _dataLayers = [[ ]];
    var _groups = [];
    var _defaultAccessor;
    var _hideChartGroup;

    function initializeDataLayer(i) {
        if (!_dataLayers[i])
            _dataLayers[i] = [];
    }

    this.setDataPoint = function (layerIndex, pointIndex, data) {
        initializeDataLayer(layerIndex);
        _dataLayers[layerIndex][pointIndex] = data;
    };

    this.getDataPoint = function (x, y) {
        initializeDataLayer(x);
        var dataPoint = _dataLayers[x][y];
        if (dataPoint === undefined)
            dataPoint = 0;
        return dataPoint;
    };

    this.addGroup = function (group, accessor) {
        if (!accessor)
            accessor = _defaultAccessor;
        _groups.push([group, accessor]);
        return _groups.length - 1;
    };

    this.addNamedGroup = function (group, name, accessor) {
        var groupIndex = this.addGroup(group, accessor);
        _groups[groupIndex].name = name;
        return name;
    };

    this.getGroupByIndex = function (index) {
        return _groups[index][0];
    };

    this.getAccessorByIndex = function (index) {
        return _groups[index][1];
    };

    this.size = function () {
        return _groups.length;
    };

    this.clear = function () {
        _dataLayers = [];
        _groups = [];
    };

    this.setDefaultAccessor = function (retriever) {
        _defaultAccessor = retriever;
    };

    this.getDataLayers = function () {
        return _dataLayers;
    };

    this.clearDataLayers = function() {
        _dataLayers = [[ ]];
    };

    this.showGroups = function(name, showChartGroup) {
        if (showChartGroup) _hideChartGroup = false;
        this.toggleGroups(name, false);
    };

    this.hideGroups = function(name, hideChartGroup) {
        if (hideChartGroup) _hideChartGroup = true;
        this.toggleGroups(name, true);
    };

    this.toggleGroups = function(name, value) {
        for (var i = 0; i < _groups.length; ++i) {
            if (_groups[i].name === name)
                _groups[i].hidden = value;
        }
    };

    this.toLayers = function () {
        var layers = [];

        for (var i = 0; i < _dataLayers.length; ++i) {
            if (i === 0 && _hideChartGroup)
                continue;
            if (i > 0 && _groups[i-1].hidden)
                continue;

            var layer = {index: i, points: []};
            var dataPoints = _dataLayers[i];

            for (var j = 0; j < dataPoints.length; ++j)
                layer.points.push(dataPoints[j]);

            layers.push(layer);
        }

        return layers;
    };
};

dc.utils.isNumber = function(n) {
    return n===+n;
};

dc.utils.isFloat = function (n) {
    return n===+n && n!==(n|0);
};

dc.utils.isInteger = function (n) {
    return n===+n && n===(n|0);
};

dc.utils.isNegligible = function (max) {
    return max === undefined || (max < dc.constants.NEGLIGIBLE_NUMBER && max > -dc.constants.NEGLIGIBLE_NUMBER);
};

var _idCounter = 0;
dc.utils.uniqueId = function () {
  return ++_idCounter;
}

dc.utils.groupMax = function (group, accessor) {
    var max = d3.max(group.all(), accessor);
    if (dc.utils.isNegligible(max)) max = 0;
    return max;
};

dc.utils.groupMin = function (group, accessor) {
    var min = d3.min(group.all(), accessor);
    if (dc.utils.isNegligible(min)) min = 0;
    return min;
};

dc.utils.nameToId = function (name) {
    return name.toLowerCase().replace(/[\s]/g, "_").replace(/[\.']/g, "");
};

dc.utils.appendOrSelect = function (parent, name) {
    var element = parent.select(name);
    if (element.empty()) element = parent.append(name);
    return element;
};

dc.utils.createLegendable = function (chart, group, accessor, color) {
    var legendable = {name: chart._getGroupName(group, accessor), data: group};
    if (color) legendable.color = color;
    return legendable;
};

dc.utils.safeNumber = function(n){return dc.utils.isNumber(+n)?+n:0;};
