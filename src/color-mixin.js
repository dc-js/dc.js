/**
## Color Mixin
The Color Mixin is an abstract chart functional class providing universal coloring support
as a mix-in for any concrete chart implementation.

**/

dc.colorMixin = function (_chart) {
    var _colors = d3.scale.category20c();
    var _defaultAccessor = true;

    var _colorAccessor = function (d) { return _chart.keyAccessor()(d); };

    /**
    #### .colors([colorScale])
    Retrieve current color scale or set a new color scale. This methods accepts any function that
    operates like a d3 scale. If not set the default is
    `d3.scale.category20c()`.
    ```js
    // alternate categorical scale
    chart.colors(d3.scale.category20b());

    // ordinal scale
    chart.colors(d3.scale.ordinal().range(['red','green','blue']));
    // convenience method, the same as above
    chart.ordinalColors(['red','green','blue']);

    // set a linear scale
    chart.linearColors(["#4575b4", "#ffffbf", "#a50026"]);
    ```
    **/
    _chart.colors = function (_) {
        if (!arguments.length) {
            return _colors;
        }
        if (_ instanceof Array) {
            _colors = d3.scale.quantize().range(_); // deprecated legacy support, note: this fails for ordinal domains
        } else {
            _colors = d3.functor(_);
        }
        return _chart;
    };

    /**
    #### .ordinalColors(r)
    Convenience method to set the color scale to d3.scale.ordinal with range `r`.

    **/
    _chart.ordinalColors = function (r) {
        return _chart.colors(d3.scale.ordinal().range(r));
    };

    /**
    #### .linearColors(r)
    Convenience method to set the color scale to an Hcl interpolated linear scale with range `r`.

    **/
    _chart.linearColors = function (r) {
        return _chart.colors(d3.scale.linear()
                             .range(r)
                             .interpolate(d3.interpolateHcl));
    };

    /**
    #### .colorAccessor([colorAccessorFunction])
    Set or the get color accessor function. This function will be used to map a data point in a
    crossfilter group to a color value on the color scale. The default function uses the key
    accessor.
    ```js
    // default index based color accessor
    .colorAccessor(function (d, i){return i;})
    // color accessor for a multi-value crossfilter reduction
    .colorAccessor(function (d){return d.value.absGain;})
    ```
    **/
    _chart.colorAccessor = function (_) {
        if (!arguments.length) {
            return _colorAccessor;
        }
        _colorAccessor = _;
        _defaultAccessor = false;
        return _chart;
    };

    // what is this?
    _chart.defaultColorAccessor = function () {
        return _defaultAccessor;
    };

    /**
    #### .colorDomain([domain])
    Set or get the current domain for the color mapping function. The domain must be supplied as an
    array.

    Note: previously this method accepted a callback function. Instead you may use a custom scale
    set by `.colors`.

    **/
    _chart.colorDomain = function (_) {
        if (!arguments.length) {
            return _colors.domain();
        }
        _colors.domain(_);
        return _chart;
    };

    /**
    #### .calculateColorDomain()
    Set the domain by determining the min and max values as retrieved by `.colorAccessor` over the
    chart's dataset.

    **/
    _chart.calculateColorDomain = function () {
        var newDomain = [d3.min(_chart.data(), _chart.colorAccessor()),
                         d3.max(_chart.data(), _chart.colorAccessor())];
        _colors.domain(newDomain);
        return _chart;
    };

    /**
    #### .getColor(d [, i])
    Get the color for the datum d and counter i. This is used internally by charts to retrieve a color.

    **/
    _chart.getColor = function (d, i) {
        return _colors(_colorAccessor.call(this, d, i));
    };

    /**
     #### .colorCalculator([value])
     Gets or sets chart.getColor.
     **/
    _chart.colorCalculator = function (_) {
        if (!arguments.length) {
            return _chart.getColor;
        }
        _chart.getColor = _;
        return _chart;
    };

    return _chart;
};
