dc.colorChart = function(_chart) {
    var _colors = d3.scale.category20c();

    var _colorCalculator = function(value, maxValue) {
        if (isNaN(value)) value = 0;
        if(maxValue == null) return _colors(value);

        var colorsLength = _chart.colors().range().length;
        var denominator = maxValue / colorsLength;
        var colorValue = Math.min(colorsLength - 1, Math.round(value / denominator));
        return _chart.colors()(colorValue);
    };

    var _colorAccessor = function(d){return d.value;};

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

    _chart.colorCalculator = function(_){
        if(!arguments.length) return _colorCalculator;
        _colorCalculator = _;
        return _chart;
    };

    _chart.getColor = function(d, max){
        return _colorCalculator(_colorAccessor(d), max);
    };

    _chart.colorAccessor = function(_){
        if(!arguments.length) return _colorAccessor;
        _colorAccessor = _;
        return _chart;
    };

    return _chart;
};
