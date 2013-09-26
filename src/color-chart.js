/**
## <a name="color-chart" href="#color-chart">#</a> Color Chart [Abstract]
Color chart is an abstract chart functional class created to provide universal coloring support as a mix-in for any concrete
chart implementation.

**/

dc.colorChart = function(_chart) {
    var _colors = d3.scale.category20c();

    var _colorDomain = [0, _colors.range().length];

    var _colorCalculator = function(value) {
        var domain = _colorDomain;
        if (typeof _colorDomain === 'function')
            domain = _colorDomain.call(_chart);
        var minValue = domain[0];
        var maxValue = domain[1];

        if (isNaN(value)) value = 0;
        if (!dc.utils.isNumber(maxValue)) return _colors(value);

        var colorsLength = _chart.colors().range().length;
        var denominator = (maxValue - minValue) / colorsLength;
        var colorValue = Math.abs(Math.min(colorsLength - 1, Math.round((value - minValue) / denominator)));
        //var colorValue = Math.abs(Math.round((value - minValue) / denominator)) % colorsLength;
        return _chart.colors()(colorValue);
    };

    var _colorAccessor = function(d, i){return i;};

    /**
    #### .colors([colorScale or colorArray])
    Retrieve current color scale or set a new color scale. This function accepts both d3 color scale and arbitrary color
    array. By default d3.scale.category20c() is used.
    ```js
    // color scale
    chart.colors(d3.scale.category20b());
    // arbitrary color array
    chart.colors(["#a60000","#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"]);
    ```

    **/
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

        _colorDomain = [0, _colors.range().length];

        return _chart;
    };

    _chart.colorCalculator = function(_){
        if(!arguments.length) return _colorCalculator;
        _colorCalculator = _;
        return _chart;
    };

    _chart.getColor = function(d, i){
        return _colorCalculator(_colorAccessor(d, i));
    };

    /**
    #### .colorAccessor([colorAccessorFunction])
    Set or get color accessor function. This function will be used to map a data point on crossfilter group to a specific
    color value on the color scale. Default implementation of this function simply returns the next color on the scale using
    the index of a group.
    ```js
    // default index based color accessor
    .colorAccessor(function(d, i){return i;})
    // color accessor for a multi-value crossfilter reduction
    .colorAccessor(function(d){return d.value.absGain;})
    ```

    **/
    _chart.colorAccessor = function(_){
        if(!arguments.length) return _colorAccessor;
        _colorAccessor = _;
        return _chart;
    };

    /**
    #### .colorDomain([domain])
    Set or get the current domain for the color mapping function. This allows user to provide a custom domain for the mapping
    function used to map the return value of the colorAccessor function to the target color range calculated based on the
    color scale. You value can either be an array with the start and end of the range or a function returning an array. Functions
    are passed the chart in their `this` context.
    ```js
    // custom domain for month of year
    chart.colorDomain([0, 11])
    // custom domain for day of year
    chart.colorDomain([0, 364])
    // custom domain function that scales with the group value range
    chart.colorDomain(function() {
        [dc.utils.groupMin(this.group(), this.valueAccessor()),
         dc.utils.groupMax(this.group(), this.valueAccessor())];
    });
    ```

    **/
    _chart.colorDomain = function(_){
        if(!arguments.length) return _colorDomain;
        _colorDomain = _;
        return _chart;
    };

    return _chart;
};
