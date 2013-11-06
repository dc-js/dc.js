/**
 ## <a name="boxplot" href="#boxplot">#</a> Box Plot [Concrete] < [CoordinateGrid Chart](#coordinate-grid-chart)
 A box plot is a chart that depicts numerical data via their quartile ranges.

 #### dc.boxPlot(parent[, chartGroup])
 Create a box plot instance and attach it to the given parent element.

 Parameters:
 * parent : string - any valid d3 single selector representing typically a dom block element such as a div.
 * chartGroup : string (optional) - name of the chart group this chart instance should be placed in. Once a chart is placed
 in a certain chart group then any interaction with such instance will only trigger events and redraw within the same
 chart group.

 Return:
 A newly created box plot instance

 ```js
 // create a box plot under #chart-container1 element using the default global chart group
 var boxPlot1 = dc.boxPlot("#chart-container1");
 // create a box plot under #chart-container2 element using chart group A
 var boxPlot2 = dc.boxPlot("#chart-container2", "chartGroupA");
 ```

 **/
dc.boxPlot = function (parent, chartGroup) {
    var _chart = dc.coordinateGridChart({});

    var _whisker_iqr_factor = 1.5;
    var _whiskers_iqr = default_whiskers_iqr;
    var _whiskers = _whiskers_iqr(_whisker_iqr_factor);

    var _box = d3.box();
    var _tickFormat = null;
    var _duration = 0;

    var _boxWidth = function (innerChartWidth, xUnits) {
        if (_chart.isOrdinal())
            return _chart.x().rangeBand();
        else
            return innerChartWidth / (1 + _chart.boxPadding()) / xUnits;
    };

    // default padding to handle min/max whisker text
    _chart.yAxisPadding(12);

    // default to ordinal
    _chart.x(d3.scale.ordinal());
    _chart.xUnits(dc.units.ordinal);

    // valueAccessor should return an array of values that can be coerced into numbers
    //  or if data is overloaded for a static array of arrays, it should be `Number`
    _chart.data(function(group) {
        return group.all().map(function (d) {
            d.map = function(accessor) { return accessor.call(d,d); };
            return d;
        });
    });

    /**
    ### .boxPadding([padding])
    Get or set the spacing between boxes as a fraction of bar size. Valid values are within 0-1.
    See the [d3 docs](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeBands)
    for a visual description of how the padding is applied.

    Default: 0.8
    **/
    _chart.boxPadding = _chart._rangeBandPadding;
    _chart.boxPadding(0.8);

    /**
    ### .outerPadding([padding])
    Get or set the outer padding on an ordinal box chart. This setting has no effect on non-ordinal charts
    or on charts with a custom `.boxWidth`. Padding equivlent in width to `padding * barWidth` will be
    added on each side of the chart.

    Default: 0.5
    **/
    _chart.outerPadding = _chart._outerRangeBandPadding;
    _chart.outerPadding(0.5);

    /**
     #### .boxWidth(width || function(innerChartWidth, xUnits) { ... })
     Get or set the numerical width of the boxplot box. Provided width may also be a function.
     This function takes as parameters the chart width without the right and left margins
     as well as the number of x units.
     **/
    _chart.boxWidth = function(_) {
        if (!arguments.length) return _boxWidth;
        _boxWidth = d3.functor(_);
        return _chart;
    };

    _chart.plotData = function () {
        var _calculatedBoxWidth = _boxWidth(_chart.effectiveWidth(), _chart.xUnitCount());

        _box.whiskers(_whiskers)
            .width(_calculatedBoxWidth)
            .height(_chart.effectiveHeight())
            .value(_chart.valueAccessor())
            .domain(_chart.y().domain())
            .tickFormat(_tickFormat)
            .duration(_duration);

        var boxTransform = function (d, i) {
            var xOffset = _chart.x()(_chart.keyAccessor()(d,i));
            return "translate(" + xOffset + ",0)";
        };

        _chart.chartBodyG().selectAll('g.box')
            .data(_chart.data())
          .enter().append("g")
            .attr("class", "box")
            .attr("transform", boxTransform)
            .call(_box);
    };

    _chart.yAxisMin = function () {
        var min = d3.min(_chart.data(), function (e) {
            return d3.min(_chart.valueAccessor()(e));
        });
        return dc.utils.subtract(min, _chart.yAxisPadding());
    };

    _chart.yAxisMax = function () {
        var max = d3.max(_chart.data(), function (e) {
            return d3.max(_chart.valueAccessor()(e));
        });
        return dc.utils.add(max, _chart.yAxisPadding());
    };

    /**
     #### .tickFormat()
     Set the numerical format of the boxplot median and quartile labels. Defaults to integer.
     ```js
     // format ticks to 2 decimal places
     chart.tickFormat(d3.format(".2f"));
     ```
     **/
    _chart.tickFormat = function(x) {
      if (!arguments.length) return _tickFormat;
      _tickFormat = x;
      return _chart;
    };
    _chart.duration = function(x) {
      if (!arguments.length) return _duration;
      _duration = x;
      return _chart;
    };

    // Returns a function to compute the interquartile range.
    function default_whiskers_iqr(k) {
        return function (d) {
            var q1 = d.quartiles[0],
                q3 = d.quartiles[2],
                iqr = (q3 - q1) * k,
                i = -1,
                j = d.length;
            while (d[++i] < q1 - iqr);
            while (d[--j] > q3 + iqr);
            return [i, j];
        };
    }

    return _chart.anchor(parent, chartGroup);
};
