/**
 * A scatter plot chart
 * @name scatterPlot
 * @memberof dc
 * @mixes dc.coordinateGridMixin
 * @example
 * // create a scatter plot under #chart-container1 element using the default global chart group
 * var chart1 = dc.scatterPlot('#chart-container1');
 * // create a scatter plot under #chart-container2 element using chart group A
 * var chart2 = dc.scatterPlot('#chart-container2', 'chartGroupA');
 * // create a sub-chart under a composite parent chart
 * var chart3 = dc.scatterPlot(compositeChart);
 * @param {String|node|d3.selection|dc.compositeChart} parent - Any valid
 * [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 * a dom block element such as a div; or a dom element or d3 selection.  If the bar chart is a sub-chart
 * in a [Composite Chart](#composite-chart) then pass in the parent composite chart instance.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {SeriesChart}
 */
dc.scatterPlot = function (parent, chartGroup) {
    var _chart = dc.coordinateGridMixin({});
    var _symbol = d3.svg.symbol();

    var _existenceAccessor = function (d) { return d.value; };

    var originalKeyAccessor = _chart.keyAccessor();
    _chart.keyAccessor(function (d) { return originalKeyAccessor(d)[0]; });
    _chart.valueAccessor(function (d) { return originalKeyAccessor(d)[1]; });
    _chart.colorAccessor(function () { return _chart._groupName; });

    var _locator = function (d) {
        return 'translate(' + _chart.x()(_chart.keyAccessor()(d)) + ',' +
                              _chart.y()(_chart.valueAccessor()(d)) + ')';
    };

    var _symbolSize = 3;
    var _highlightedSize = 5;
    var _hiddenSize = 0;

    _symbol.size(function (d) {
        if (!_existenceAccessor(d)) {
            return _hiddenSize;
        } else if (this.filtered) {
            return Math.pow(_highlightedSize, 2);
        } else {
            return Math.pow(_symbolSize, 2);
        }
    });

    dc.override(_chart, '_filter', function (filter) {
        if (!arguments.length) {
            return _chart.__filter();
        }

        return _chart.__filter(dc.filters.RangedTwoDimensionalFilter(filter));
    });

    _chart.plotData = function () {
        var symbols = _chart.chartBodyG().selectAll('path.symbol')
            .data(_chart.data());

        symbols
            .enter()
        .append('path')
            .attr('class', 'symbol')
            .attr('opacity', 0)
            .attr('fill', _chart.getColor)
            .attr('transform', _locator);

        dc.transition(symbols, _chart.transitionDuration())
            .attr('opacity', function (d) { return _existenceAccessor(d) ? 1 : 0; })
            .attr('fill', _chart.getColor)
            .attr('transform', _locator)
            .attr('d', _symbol);

        dc.transition(symbols.exit(), _chart.transitionDuration())
            .attr('opacity', 0).remove();
    };

    /**
     * Get or set the existence accessor.  If a point exists, it is drawn with symbolSize radius and
     * opacity 1; if it does not exist, it is drawn with hiddenSize radius and opacity 0. By default,
     * the existence accessor checks if the reduced value is truthy.
     * @name existenceAccessor
     * @memberof dc.scatterPlot
     * @instance
     * @param {Function} [accessor]
     * @returns {Chart}
     */
    _chart.existenceAccessor = function (accessor) {
        if (!arguments.length) {
            return _existenceAccessor;
        }
        _existenceAccessor = accessor;
        return this;
    };

    /**
     * Get or set the symbol type used for each point. By default the symbol is a circle. See the D3
     * [docs](https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-symbol_type) for acceptable types.
     * Type can be a constant or an accessor.
     * @name symbol
     * @memberof dc.scatterPlot
     * @instance
     * @param {Function} [type]
     * @returns {Chart}
     */
    _chart.symbol = function (type) {
        if (!arguments.length) {
            return _symbol.type();
        }
        _symbol.type(type);
        return _chart;
    };

    /**
     * Set or get radius for symbols.
     * @name symbolSize
     * @memberof dc.scatterPlot
     * @instance
     * @param {Number} [symbolSize=3]
     * @returns {Chart}
     */
    _chart.symbolSize = function (symbolSize) {
        if (!arguments.length) {
            return _symbolSize;
        }
        _symbolSize = symbolSize;
        return _chart;
    };

    /**
     * Set or get radius for highlighted symbols.
     * @name highlightedSize
     * @memberof dc.scatterPlot
     * @instance
     * @param {Number} [highlightedSize=5]
     * @returns {Chart}
     */
    _chart.highlightedSize = function (highlightedSize) {
        if (!arguments.length) {
            return _highlightedSize;
        }
        _highlightedSize = highlightedSize;
        return _chart;
    };

    /**
     * Set or get radius for symbols when the group is empty.
     * @name hiddenSize
     * @memberof dc.scatterPlot
     * @instance
     * @param {Number} [hiddenSize=0]
     * @returns {Chart}
     */
    _chart.hiddenSize = function (hiddenSize) {
        if (!arguments.length) {
            return _hiddenSize;
        }
        _hiddenSize = hiddenSize;
        return _chart;
    };

    _chart.legendables = function () {
        return [{chart: _chart, name: _chart._groupName, color: _chart.getColor()}];
    };

    _chart.legendHighlight = function (d) {
        resizeSymbolsWhere(function (symbol) {
            return symbol.attr('fill') === d.color;
        }, _highlightedSize);
        _chart.selectAll('.chart-body path.symbol').filter(function () {
            return d3.select(this).attr('fill') !== d.color;
        }).classed('fadeout', true);
    };

    _chart.legendReset = function (d) {
        resizeSymbolsWhere(function (symbol) {
            return symbol.attr('fill') === d.color;
        }, _symbolSize);
        _chart.selectAll('.chart-body path.symbol').filter(function () {
            return d3.select(this).attr('fill') !== d.color;
        }).classed('fadeout', false);
    };

    function resizeSymbolsWhere (condition, size) {
        var symbols = _chart.selectAll('.chart-body path.symbol').filter(function () {
            return condition(d3.select(this));
        });
        var oldSize = _symbol.size();
        _symbol.size(Math.pow(size, 2));
        dc.transition(symbols, _chart.transitionDuration()).attr('d', _symbol);
        _symbol.size(oldSize);
    }

    _chart.setHandlePaths = function () {
        // no handle paths for poly-brushes
    };

    _chart.extendBrush = function () {
        var extent = _chart.brush().extent();
        if (_chart.round()) {
            extent[0] = extent[0].map(_chart.round());
            extent[1] = extent[1].map(_chart.round());

            _chart.g().select('.brush')
                .call(_chart.brush().extent(extent));
        }
        return extent;
    };

    _chart.brushIsEmpty = function (extent) {
        return _chart.brush().empty() || !extent || extent[0][0] >= extent[1][0] || extent[0][1] >= extent[1][1];
    };

    function resizeFiltered (filter) {
        var symbols = _chart.selectAll('.chart-body path.symbol').each(function (d) {
            this.filtered = filter && filter.isFiltered(d.key);
        });

        dc.transition(symbols, _chart.transitionDuration()).attr('d', _symbol);
    }

    _chart._brushing = function () {
        var extent = _chart.extendBrush();

        _chart.redrawBrush(_chart.g());

        if (_chart.brushIsEmpty(extent)) {
            dc.events.trigger(function () {
                _chart.filter(null);
                _chart.redrawGroup();
            });

            resizeFiltered(false);

        } else {
            var ranged2DFilter = dc.filters.RangedTwoDimensionalFilter(extent);
            dc.events.trigger(function () {
                _chart.filter(null);
                _chart.filter(ranged2DFilter);
                _chart.redrawGroup();
            }, dc.constants.EVENT_DELAY);

            resizeFiltered(ranged2DFilter);
        }
    };

    _chart.setBrushY = function (gBrush) {
        gBrush.call(_chart.brush().y(_chart.y()));
    };

    return _chart.anchor(parent, chartGroup);
};
