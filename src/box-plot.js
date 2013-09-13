dc.boxPlot = function (parent, chartGroup) {
    var _chart = dc.coordinateGridChart({});

    var _whisker_iqr_factor = 1.5;
    var _whiskers_iqr = default_whiskers_iqr;
    var _whiskers = _whiskers_iqr(_whisker_iqr_factor);

    var _box = d3.box();
    var _boxWidth;

    // defaut padding to handle min/max whisker text
    _chart.yAxisPadding(12);

    function groupData() {
        return _chart.group().all().map(function (kv) {
            kv.map = function () { return _chart.valueAccessor()(kv); };
            return kv;
        });
    }

    _chart.plotData = function () {
        // TODO: expose to customize
        _boxWidth = 0.2 * _chart.effectiveWidth() / (_chart.xUnitCount() + 1);

        _box.whiskers(_whiskers)
            .width(_boxWidth)
            .height(_chart.effectiveHeight())
            .domain(_chart.y().domain());

        // TODO: figure out why the .data call end up cause numbers to be added to the domain
        var saveDomain = Array.prototype.slice.call(_chart.x().domain(), 0);
        _chart.chartBodyG().selectAll('g.box')
            .data(groupData())
          .enter().append("g")
            .attr("class", "box")
            .attr("transform", function (d, i) { return "translate(" + (_chart.x()(i) - _boxWidth / 2) + ",0)"; }) //-"+_chart.margins().bottom+")"; })
            .call(_box);
        _chart.x().domain(saveDomain);
    };

    _chart.yAxisMin = function () {
        var min = d3.min(_chart.group().all(), function (e) {
            return d3.min(_chart.valueAccessor()(e));
        });
        min = dc.utils.subtract(min, _chart.yAxisPadding());
        return min;
    };

    _chart.yAxisMax = function () {
        var max = d3.max(_chart.group().all(), function (e) {
            return d3.max(_chart.valueAccessor()(e));
        });
        max = dc.utils.add(max, _chart.yAxisPadding());
        return max;
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
