/**
 * The Color Mixin is an abstract chart functional class providing universal coloring support
 * as a mix-in for any concrete chart implementation.
 * @name colorMixin
 * @memberof dc
 * @mixin
 * @param {Chart} _chart
 * @returns {Chart}
 */
dc.colorMixin = function (_chart) {
    var _colors = d3.scale.category20c();
    var _defaultAccessor = true;

    var _colorAccessor = function (d) { return _chart.keyAccessor()(d); };

    /**
     * Retrieve current color scale or set a new color scale. This methods accepts any function that
     * operates like a d3 scale.
     * @name colors
     * @memberof dc.colorMixin
     * @instance
     * @example
     * // alternate categorical scale
     * chart.colors(d3.scale.category20b());
     *
     * // ordinal scale
     * chart.colors(d3.scale.ordinal().range(['red','green','blue']));
     * // convenience method, the same as above
     * chart.ordinalColors(['red','green','blue']);
     *
     * // set a linear scale
     * chart.linearColors(["#4575b4", "#ffffbf", "#a50026"]);
     * @param {D3Scale} [colorScale=d3.scale.category20c()]
     * @returns {Chart}
     */
    _chart.colors = function (colorScale) {
        if (!arguments.length) {
            return _colors;
        }
        if (colorScale instanceof Array) {
            _colors = d3.scale.quantize().range(colorScale); // deprecated legacy support, note: this fails for ordinal domains
        } else {
            _colors = d3.functor(colorScale);
        }
        return _chart;
    };

    /**
     * Convenience method to set the color scale to d3.scale.ordinal with range `r`.
     * @name ordinalColors
     * @memberof dc.colorMixin
     * @instance
     * @param {Array<String>} r
     * @returns {Chart}
     */
    _chart.ordinalColors = function (r) {
        return _chart.colors(d3.scale.ordinal().range(r));
    };

    /**
     * Convenience method to set the color scale to an Hcl interpolated linear scale with range `r`.
     * @name linearColors
     * @memberof dc.colorMixin
     * @instance
     * @param {Array<Number>} r
     * @returns {Chart}
     */
    _chart.linearColors = function (r) {
        return _chart.colors(d3.scale.linear()
                             .range(r)
                             .interpolate(d3.interpolateHcl));
    };

    /**
     * Set or the get color accessor function. This function will be used to map a data point in a
     * crossfilter group to a color value on the color scale. The default function uses the key
     * accessor.
     * @name linearColors
     * @memberof dc.colorMixin
     * @instance
     * @example
     * // default index based color accessor
     * .colorAccessor(function (d, i){return i;})
     * // color accessor for a multi-value crossfilter reduction
     * .colorAccessor(function (d){return d.value.absGain;})
     * @param {Function} [colorAccessorFunction]
     * @returns {Function}
     */
    _chart.colorAccessor = function (colorAccessorFunction) {
        if (!arguments.length) {
            return _colorAccessor;
        }
        _colorAccessor = colorAccessorFunction;
        _defaultAccessor = false;
        return _chart;
    };

    // what is this?
    _chart.defaultColorAccessor = function () {
        return _defaultAccessor;
    };

    /**
     * Set or get the current domain for the color mapping function. The domain must be supplied as an
     * array.
     *
     * Note: previously this method accepted a callback function. Instead you may use a custom scale
     * set by `.colors`.
     * @name colorDomain
     * @memberof dc.colorMixin
     * @instance
     * @param {Array<String>} [domain]
     * @returns {Function}
     */
    _chart.colorDomain = function (domain) {
        if (!arguments.length) {
            return _colors.domain();
        }
        _colors.domain(domain);
        return _chart;
    };

    /**
     * Set the domain by determining the min and max values as retrieved by `.colorAccessor` over the
     * chart's dataset.
     * @name calculateColorDomain
     * @memberof dc.colorMixin
     * @instance
     * @returns {Chart}
     */
    _chart.calculateColorDomain = function () {
        var newDomain = [d3.min(_chart.data(), _chart.colorAccessor()),
                         d3.max(_chart.data(), _chart.colorAccessor())];
        _colors.domain(newDomain);
        return _chart;
    };

    /**
     * Get the color for the datum d and counter i. This is used internally by charts to retrieve a color.
     * @name getColor
     * @memberof dc.colorMixin
     * @instance
     * @param {*} d
     * @param {Number} [i]
     * @returns {String}
     */
    _chart.getColor = function (d, i) {
        return _colors(_colorAccessor.call(this, d, i));
    };

    /**
     * Get the color for the datum d and counter i. This is used internally by charts to retrieve a color.
     * @name colorCalculator
     * @memberof dc.colorMixin
     * @instance
     * @param {*} [colorCalculator]
     * @returns {*}
     */
    _chart.colorCalculator = function (colorCalculator) {
        if (!arguments.length) {
            return _chart.getColor;
        }
        _chart.getColor = colorCalculator;
        return _chart;
    };

    return _chart;
};
