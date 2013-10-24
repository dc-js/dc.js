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
    var _boxWidth = function (innerChartWidth, xUnits) {
        return innerChartWidth / (xUnits + 1);
    };

    // default padding to handle min/max whisker text
    _chart.yAxisPadding(12);

    function groupData() {
        return _chart.group().all().map(function (kv) {
            kv.map = function () { return _chart.valueAccessor()(kv); };
            return kv;
        });
    }

    /**
     #### .boxWidth(width || function(innerChartWidth, xUnits) { ... })
     Get or set the numerical width of the boxplot box. Provided width may also be a function.
     This function takes as parameters the chart width without the right and left margins
     as well as the number of x units.
     **/
    _chart.boxWidth = function(_) {
        if (!arguments.length) return _boxWidth;

        if (typeof _ !== "function")
            _boxWidth = function() { return _; };
        else
            _boxWidth = _;

        return _chart;
    };

    _chart.plotData = function () {
        var _calculatedBoxWidth = _boxWidth(_chart.effectiveWidth(), _chart.xUnitCount());

        _box.whiskers(_whiskers)
            .width(_calculatedBoxWidth)
            .height(_chart.effectiveHeight())
            .domain(_chart.y().domain());

        // TODO: figure out why the .data call end up causing numbers to be added to the domain
        var saveDomain = Array.prototype.slice.call(_chart.x().domain(), 0);
        var boxTransform = function (d, i) {
            return "translate(" + (_chart.x()(i) - _calculatedBoxWidth / 2) + ",0)";
        };

        _chart.chartBodyG().selectAll('g.box')
            .data(groupData())
          .enter().append("g")
            .attr("class", "box")
            .attr("transform", boxTransform)
            .call(_box);
        _chart.x().domain(saveDomain);
    };

    _chart.yAxisMin = function () {
        var min = d3.min(_chart.group().all(), function (e) {
            return d3.min(_chart.valueAccessor()(e));
        });
        return dc.utils.subtract(min, _chart.yAxisPadding());
    };

    _chart.yAxisMax = function () {
        var max = d3.max(_chart.group().all(), function (e) {
            return d3.max(_chart.valueAccessor()(e));
        });
        return dc.utils.add(max, _chart.yAxisPadding());
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
