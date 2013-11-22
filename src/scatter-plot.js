dc.scatterPlot = function (parent, chartGroup) {
    var _chart = dc.coordinateGridMixin({});

    var originalKeyAccessor = _chart.keyAccessor();
    _chart.keyAccessor(function (d) { return originalKeyAccessor(d)[0]; });
    _chart.valueAccessor(function (d) { return originalKeyAccessor(d)[1]; });
    _chart.colorAccessor(function () { return 0; });

    var _locator = function (d) {
        return "translate(" + _chart.x()(_chart.keyAccessor()(d)) + "," + _chart.y()(_chart.valueAccessor()(d)) + ")";
    };

    var _symbolSize = 3;
    var _highlightedSize = 4;

    dc.override(_chart, "_filter", function(filter) {
        if (filter !== undefined) {
            return _chart.__filter(dc.filters.RangedTwoDimensionalFilter(filter));
        } else {
            return _chart.__filter();
        }
    });

    _chart.plotData = function () {
        var symbols = _chart.chartBodyG().selectAll("circle.symbol")
            .data(_chart.data());

        symbols
            .enter()
        .append("circle")
            .attr("class", "symbol")
            .attr("fill", _chart.getColor())
            .attr("transform", _locator);

        dc.transition(symbols, _chart.transitionDuration())
            .attr("transform", _locator)
            .attr("r", function (d) {
                return d.filtered ? _highlightedSize : _symbolSize;
            });

        dc.transition(symbols.filter(function(d){return _chart.valueAccessor()(d) === 0;}), _chart.transitionDuration())
                    .attr("r", 0).remove(); // remove empty groups

        dc.transition(symbols.exit(), _chart.transitionDuration())
            .attr("r", 0).remove();
    };

    /**
    #### .symbolSize([radius])
    Set or get radius for symbols, default: 3.

    **/
    _chart.symbolSize = function(s){
        if(!arguments.length) return _symbolSize;
        _symbolSize = s;
        return _chart;
    };

    /**
    #### .highlightedSize([radius])
    Set or get radius for highlighted symbols, default: 4.

    **/
    _chart.highlightedSize = function(s){
        if(!arguments.length) return _highlightedSize;
        _highlightedSize = s;
        return _chart;
    };

    _chart.legendables = function () {
        return [{chart: _chart, name: _chart._groupName, color: _chart.getColor()}];
    };

    _chart.legendHighlight = function (d) {
        resizeSymbolsWhere(function (symbol) {
            return symbol.attr('fill') == d.color;
        }, _highlightedSize);
        _chart.selectAll('.chart-body').selectAll('circle.symbol').filter(function () {
            return d3.select(this).attr('fill') != d.color;
        }).classed('fadeout', true);
    };

    _chart.legendReset = function (d) {
        resizeSymbolsWhere(function (symbol) {
            return symbol.attr('fill') == d.color;
        }, _symbolSize);
        _chart.selectAll('.chart-body').selectAll('circle.symbol').filter(function () {
            return d3.select(this).attr('fill') != d.color;
        }).classed('fadeout', false);
    };

    _chart.setHandlePaths = function () {
        // no handle paths for poly-brushes
    };

    _chart.extendBrush = function () {
        var extent = _chart.brush().extent();
        if (_chart.round()) {
            extent[0] = extent[0].map(_chart.round());
            extent[1] = extent[1].map(_chart.round());

            _chart.g().select(".brush")
                .call(_chart.brush().extent(extent));
        }
        return extent;
    };

    _chart.brushIsEmpty = function (extent) {
        return _chart.brush().empty() || !extent || extent[0][0] >= extent[1][0] || extent[0][1] >= extent[1][1];
    };

    function resizeSymbolsWhere(condition, size, filteredValue) {
        var symbols = _chart.selectAll('.chart-body').selectAll('circle.symbol').filter(function (d) {
            var shouldResize = condition(d3.select(this));
            if (filteredValue !== undefined && shouldResize) {  d.filtered = filteredValue;  }
            return shouldResize;
        });
        dc.transition(symbols, _chart.transitionDuration()).attr("r", size);
    }

    _chart._brushing = function () {
        var extent = _chart.extendBrush();

        _chart.redrawBrush(_chart.g());

        if (_chart.brushIsEmpty(extent)) {
            dc.events.trigger(function () {
                _chart.filter(null);
                dc.redrawAll(_chart.chartGroup());
            });

            resizeSymbolsWhere(function () { return true; }, _symbolSize, false);

        } else {
            var ranged2DFilter = dc.filters.RangedTwoDimensionalFilter(extent);
            dc.events.trigger(function () {
                _chart.filter(null);
                _chart.filter(ranged2DFilter);
                dc.redrawAll(_chart.chartGroup());
            }, dc.constants.EVENT_DELAY);

            resizeSymbolsWhere(function (symbol) {
                return ranged2DFilter.isFiltered(symbol.datum().key);
            }, _highlightedSize, true);

            resizeSymbolsWhere(function (symbol) {
                return !ranged2DFilter.isFiltered(symbol.datum().key);
            }, _symbolSize, false);
        }
    };

    _chart.setBrushY = function (gBrush) {
        gBrush.call(_chart.brush().y(_chart.y()));
    };

    return _chart.anchor(parent, chartGroup);
};
