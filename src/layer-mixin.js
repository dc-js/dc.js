dc.layerMixin = function (_chart) {
    var _layerAccessor,
        _layerFunctor,
        _layerFn;

    _chart.colorAccessor(function (d) {
        return d.layer || null;
    });

    _chart.layerAccessor = function (_) {
        if (!arguments.length) {
            return _layerAccessor;
        }
        _layerAccessor = _;
        return _chart;
    };

    _chart.layerFunctor = function (_) {
        if (!arguments.length) {
            return _layerFunctor;
        }
        _layerFunctor = _;
        _chart.expireCache();
        return _chart;
    };

    _chart.layerFn = function (_) {
        if (!arguments.length) {
            return _layerFn;
        }
        _layerFn = _;
        return _chart;
    };

    _chart._preprocessData = function () {
        _chart.layerFn(_chart.layerFunctor()(_chart, _chart.data()));
    };

    _chart.xAxisMax = function () {
        return dc.utils.add(_chart.layerFn().xAxisMax(), _chart.xAxisPadding());
    };

    _chart.xAxisMin = function () {
        return dc.utils.subtract(_chart.layerFn().xAxisMin(), _chart.xAxisPadding());
    };

    _chart.yAxisMax = function () {
        return dc.utils.add(_chart.layerFn().yAxisMax(), _chart.yAxisPadding());
    };

    _chart.yAxisMin = function () {
        return dc.utils.subtract(_chart.layerFn().yAxisMin(), _chart.yAxisPadding());
    };

    _chart._ordinalXDomain = function () {
        return _chart.layerFn().input().map(dc.pluck('key'));
    };
    return _chart;
};

dc.layerMixin.dataFn = {
    standard: function (chart, data) {
        return d3.nest()
            .key(chart.keyAccessor())
            .rollup(function (datums) {
                return d3.sum(datums, chart.valueAccessor());
            }).entries(data);
    },
    key: function (chart, data) {
        return d3.nest()
            .key(chart.keyAccessor())
            .key(chart.layerAccessor() || function () { return 'all'; })
            .sortKeys(d3.ascending)
            .rollup(function (datums) {
                return d3.sum(datums, chart.valueAccessor());
            }).entries(data);
    },
    layer: function (chart, data) {
        return d3.nest()
            .key(chart.layerAccessor() || function () { return 'all'; })
            .key(chart.keyAccessor())
            .sortKeys(d3.ascending)
            .rollup(function (datums) {
                return d3.sum(datums, chart.valueAccessor());
            }).entries(data);
    }
};

dc.layerMixin.layerFunctor = function (layerFn) {
    return function (chart, input) {
        var output = layerFn(chart, input);
        return {
            input: function () {
                return input;
            },
            data: function () {
                return output.data;
            },
            xAxisMax: function () {
                return output.xAxisMax;
            },
            xAxisMin: function () {
                return output.xAxisMin;
            },
            yAxisMax: function () {
                return output.yAxisMax;
            },
            yAxisMin: function () {
                return output.yAxisMin;
            },
            render: function (chart, g) {
                return output.render(chart, g);
            }
        };
    };
};