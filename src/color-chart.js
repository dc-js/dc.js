dc.colorChart = function(_chart) {
    var _colors = d3.scale.category20c();

    var _colorAccessor = function(value, maxValue) {
        if (isNaN(value)) value = 0;
        var colorsLength = _chart.colors().range().length;
        var denominator = maxValue / colorsLength;
        var colorValue = Math.min(colorsLength - 1, Math.round(value / denominator));
        return _chart.colors()(colorValue);
    };

    _chart.colors = function(_) {
        if (!arguments.length) return _colors;

        if (_ instanceof Array) {
            _colors = d3.scale.ordinal().range(_);
            var domain = [];
            for(var i = 0; i < _.length; ++i){
                domain.push(i);
            }
            _colors.domain(domain);
        } else {
            _colors = _;
        }

        return _chart;
    };

    _chart.colorAccessor = function(_){
        if(!arguments.length) return _colorAccessor;
        _colorAccessor = _;
        return _chart;
    };

    return _chart;
};
