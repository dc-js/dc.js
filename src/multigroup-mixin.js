/**
## Multiple Group Mixin
A mixin for adding basic multi aggregation support for charts.
**/
dc.multiGroupMixin = function (_chart) {

    var _groupGap = 5;

    _chart.groupGap = function (_) {
        if (!arguments.length) {
            return _groupGap;
        }
        _groupGap = _;
        return _chart;
    };

    _chart.data(function () {
        var layers = _chart.stack();
        var data = layers.length ? _chart.stackLayout()(layers) : [];

        // set y0 to 0 on all layers
        data.forEach(function(layer) {
            layer.values.forEach(function(value){
                value.y0 = 0;
            });
        });
        return data;
    });

    return _chart;
};
