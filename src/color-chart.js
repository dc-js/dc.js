/**
## <a name="color-chart" href="#color-chart">#</a> Color Chart [Abstract]
Color chart is an abstract chart functional class created to provide universal coloring support as a mix-in for any concrete
chart implementation.

**/

dc.colorChart = function(_chart) {
    var _colors = d3.scale.category20c();

    var _colorAccessor = function(d) { return _chart.keyAccessor()(d); };

    var _colorCalculator = function(value) {
        return _colors(value,_chart);
    };

    /**
    #### .colors([colorScale])
    Retrieve current color scale or set a new color scale. This methods accepts any
    function the operate like a d3 scale. If not set the default is
    `d3.scale.category20c()`.
    ```js
    // alternate categorical scale
    chart.colors(d3.scale.category20b());

    // ordinal scale
    chart.colors(d3.scale.ordinal().range(['red','green','blue']);
    // convience method, the same as above
    chart.ordinalColors(['red','green','blue']);

    // set a linear scale
    chart.linearColors(["#4575b4", "#ffffbf", "#a50026"]);
    ```
    **/
    _chart.colors = function(_) {
        if (!arguments.length) return _colors;
        if (_ instanceof Array) _colors = d3.scale.quantize().range(_); // depricated legacy support, note: this fails for ordinal domains
        else _colors = _;
        return _chart;
    };

    /**
    #### .ordinalColors(r)
    Convenience method to set the color scale to d3.scale.ordinal with range `r`.

    **/
    _chart.ordinalColors = function(r) {
        return _chart.colors(d3.scale.ordinal().range(r));
    };

    /**
    #### .linearColors(r)
    Convenience method to set the color scale to an Hcl interpolated linear scale with range `r`.

    **/
    _chart.linearColors = function(r) {
        return _chart.colors(d3.scale.linear()
                             .range(r)
                             .interpolate(d3.interpolateHcl));
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
    Set or get the current domain for the color mapping function. The domain must be supplied as an array.

    Note: previously this method accepted a callback function. Instead you may use a custom scale set by `.colors`.

    **/
    _chart.colorDomain = function(_){
        if(!arguments.length) return _colors.domain();
        _colors.domain(_);
        return _chart;
    };

    /**
    #### .calculateColorDomain()
    Set the domain by determining the min and max values as retrived by `.colorAccessor` over the chart's dataset.

    **/
    _chart.calculateColorDomain = function () {
        var newDomain = [d3.min(_chart.data(), _chart.colorAccessor()),
                         d3.max(_chart.data(), _chart.colorAccessor())];
        _colors.domain(newDomain);
    };

    /**
    #### .getColor(d [, i])
    Get the color for the datum d and counter i. This is used internaly by charts to retrieve a color.

    **/
    _chart.getColor = function(d, i){
        return _colorCalculator(_colorAccessor(d, i));
    };

    _chart.colorCalculator = function(_){
        if(!arguments.length) return _colorCalculator;
        _colorCalculator = _;
        return _chart;
    };

    return _chart;
};
