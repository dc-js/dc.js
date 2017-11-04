import * as d3 from 'd3';
import coordinateGridMixin from './coordinate-grid-mixin';
import {constants, override, transition} from './core';
import {RangedTwoDimensionalFilter} from './filters';
import trigger from './events';

/**
 * A scatter plot chart
 *
 * Examples:
 * - {@link http://dc-js.github.io/dc.js/examples/scatter.html Scatter Chart}
 * - {@link http://dc-js.github.io/dc.js/examples/multi-scatter.html Multi-Scatter Chart}
 * @class scatterPlot
 * @memberof dc
 * @mixes dc.coordinateGridMixin
 * @example
 * // create a scatter plot under #chart-container1 element using the default global chart group
 * let chart1 = dc.scatterPlot('#chart-container1');
 * // create a scatter plot under #chart-container2 element using chart group A
 * let chart2 = dc.scatterPlot('#chart-container2', 'chartGroupA');
 * // create a sub-chart under a composite parent chart
 * let chart3 = dc.scatterPlot(compositeChart);
 * @param {String|node|d3.selection} parent - Any valid
 * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Selections.md#selecting-elements d3 single selector} specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.scatterPlot}
 */
export default function scatterPlot (parent, chartGroup) {
    const _chart = coordinateGridMixin({});
    let _symbol = d3.svg.symbol();

    let _existenceAccessor = function (d) { return d.value; };

    const originalKeyAccessor = _chart.keyAccessor();
    _chart.keyAccessor(d => originalKeyAccessor(d)[0]);
    _chart.valueAccessor(d => originalKeyAccessor(d)[1]);
    _chart.colorAccessor(() => _chart._groupName);

    _chart.title(d =>
        // this basically just counteracts the setting of its own key/value accessors
        // see https://github.com/dc-js/dc.js/issues/702
        `${_chart.keyAccessor()(d)},${_chart.valueAccessor()(d)}: ${_chart.existenceAccessor()(d)}`);

    const _locator = d => `translate(${_chart.x()(_chart.keyAccessor()(d))}, ${_chart.y()(_chart.valueAccessor()(d))})`;

    let _highlightedSize = 7;
    let _symbolSize = 5;
    let _excludedSize = 3;
    let _excludedColor = null;
    let _excludedOpacity = 1.0;
    let _emptySize = 0;
    let _emptyOpacity = 0;
    let _nonemptyOpacity = 1;
    let _emptyColor = null;
    const _filtered = [];

    function elementSize (d, i) {
        if (!_existenceAccessor(d)) {
            return _emptySize ** 2;
        } else if (_filtered[i]) {
            return _symbolSize ** 2;
        }
        return _excludedSize ** 2;
    }
    _symbol.size(elementSize);

    override(_chart, '_filter', function (filter) {
        if (!arguments.length) {
            return _chart.__filter();
        }

        return _chart.__filter(RangedTwoDimensionalFilter(filter));
    });

    _chart.plotData = function () {
        const symbols = _chart.chartBodyG().selectAll('path.symbol')
            .data(_chart.data());

        symbols
            .enter()
            .append('path')
            .attr('class', 'symbol')
            .attr('opacity', 0)
            .attr('fill', _chart.getColor)
            .attr('transform', _locator);

        symbols.call(renderTitles, _chart.data());

        symbols.each((d, i) => {
            _filtered[i] = !_chart.filter() || _chart.filter().isFiltered([d.key[0], d.key[1]]);
        });

        transition(symbols, _chart.transitionDuration(), _chart.transitionDelay())
            .attr('opacity', (d, i) => {
                if (!_existenceAccessor(d)) {
                    return _emptyOpacity;
                } else if (_filtered[i]) {
                    return _nonemptyOpacity;
                }
                return _chart.excludedOpacity();
            })
            .attr('fill', (d, i) => {
                if (_emptyColor && !_existenceAccessor(d)) {
                    return _emptyColor;
                } else if (_chart.excludedColor() && !_filtered[i]) {
                    return _chart.excludedColor();
                }
                return _chart.getColor(d);
            })
            .attr('transform', _locator)
            .attr('d', _symbol);

        transition(symbols.exit(), _chart.transitionDuration(), _chart.transitionDelay())
            .attr('opacity', 0).remove();
    };

    function renderTitles (symbol) {
        if (_chart.renderTitle()) {
            symbol.selectAll('title').remove();
            symbol.append('title').text(_chart.title());
        }
    }

    /**
     * Get or set the existence accessor.  If a point exists, it is drawn with
     * {@link dc.scatterPlot#symbolSize symbolSize} radius and
     * opacity 1; if it does not exist, it is drawn with
     * {@link dc.scatterPlot#emptySize emptySize} radius and opacity 0. By default,
     * the existence accessor checks if the reduced value is truthy.
     * @method existenceAccessor
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link dc.scatterPlot#symbolSize symbolSize}
     * @see {@link dc.scatterPlot#emptySize emptySize}
     * @example
     * // default accessor
     * chart.existenceAccessor(function (d) { return d.value; });
     * @param {Function} [accessor]
     * @returns {Function|dc.scatterPlot}
     */
    _chart.existenceAccessor = function (accessor) {
        if (!arguments.length) {
            return _existenceAccessor;
        }
        _existenceAccessor = accessor;
        return this;
    };

    /**
     * Get or set the symbol type used for each point. By default the symbol is a circle.
     * Type can be a constant or an accessor.
     * @method symbol
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#symbol_type d3.svg.symbol.type}
     * @example
     * // Circle type
     * chart.symbol('circle');
     * // Square type
     * chart.symbol('square');
     * @param {String|Function} [type='circle']
     * @returns {String|Function|dc.scatterPlot}
     */
    _chart.symbol = function (type) {
        if (!arguments.length) {
            return _symbol.type();
        }
        _symbol.type(type);
        return _chart;
    };

    /**
     * Get or set the symbol generator. By default `dc.scatterPlot` will use
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#symbol d3.svg.symbol()}
     * to generate symbols. `dc.scatterPlot` will set the
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#symbol_size size accessor}
     * on the symbol generator.
     * @method customSymbol
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#symbol d3.svg.symbol}
     * @see {@link https://stackoverflow.com/questions/25332120/create-additional-d3-js-symbols Create additional D3.js symbols}
     * @param {String|Function} [customSymbol=d3.svg.symbol()]
     * @returns {String|Function|dc.scatterPlot}
     */
    _chart.customSymbol = function (customSymbol) {
        if (!arguments.length) {
            return _symbol;
        }
        _symbol = customSymbol;
        _symbol.size(elementSize);
        return _chart;
    };

    /**
     * Set or get radius for symbols.
     * @method symbolSize
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#symbol_size d3.svg.symbol.size}
     * @param {Number} [symbolSize=3]
     * @returns {Number|dc.scatterPlot}
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
     * @method highlightedSize
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#symbol_size d3.svg.symbol.size}
     * @param {Number} [highlightedSize=5]
     * @returns {Number|dc.scatterPlot}
     */
    _chart.highlightedSize = function (highlightedSize) {
        if (!arguments.length) {
            return _highlightedSize;
        }
        _highlightedSize = highlightedSize;
        return _chart;
    };

    /**
     * Set or get size for symbols excluded from this chart's filter. If null, no
     * special size is applied for symbols based on their filter status.
     * @method excludedSize
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#symbol_size d3.svg.symbol.size}
     * @param {Number} [excludedSize=null]
     * @returns {Number|dc.scatterPlot}
     */
    _chart.excludedSize = function (excludedSize) {
        if (!arguments.length) {
            return _excludedSize;
        }
        _excludedSize = excludedSize;
        return _chart;
    };

    /**
     * Set or get color for symbols excluded from this chart's filter. If null, no
     * special color is applied for symbols based on their filter status.
     * @method excludedColor
     * @memberof dc.scatterPlot
     * @instance
     * @param {Number} [excludedColor=null]
     * @returns {Number|dc.scatterPlot}
     */
    _chart.excludedColor = function (excludedColor) {
        if (!arguments.length) {
            return _excludedColor;
        }
        _excludedColor = excludedColor;
        return _chart;
    };

    /**
     * Set or get opacity for symbols excluded from this chart's filter.
     * @method excludedOpacity
     * @memberof dc.scatterPlot
     * @instance
     * @param {Number} [excludedOpacity=1.0]
     * @returns {Number|dc.scatterPlot}
     */
    _chart.excludedOpacity = function (excludedOpacity) {
        if (!arguments.length) {
            return _excludedOpacity;
        }
        _excludedOpacity = excludedOpacity;
        return _chart;
    };

    /**
     * Set or get radius for symbols when the group is empty.
     * @method emptySize
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#symbol_size d3.svg.symbol.size}
     * @param {Number} [emptySize=0]
     * @returns {Number|dc.scatterPlot}
     */
    _chart.emptySize = function (emptySize) {
        if (!arguments.length) {
            return _emptySize;
        }
        _emptySize = emptySize;
        return _chart;
    };
    _chart.hiddenSize = _chart.emptySize;

    /**
     * Set or get color for symbols when the group is empty. If null, just use the
     * {@link dc.colorMixin#colors colorMixin.colors} color scale zero value.
     * @name emptyColor
     * @memberof dc.scatterPlot
     * @instance
     * @param {String} [emptyColor=null]
     * @return {String}
     * @return {dc.scatterPlot}/
     */
    _chart.emptyColor = function (emptyColor) {
        if (!arguments.length) {
            return _emptyColor;
        }
        _emptyColor = emptyColor;
        return _chart;
    };

    /**
     * Set or get opacity for symbols when the group is empty.
     * @name emptyOpacity
     * @memberof dc.scatterPlot
     * @instance
     * @param {Number} [emptyOpacity=0]
     * @return {Number}
     * @return {dc.scatterPlot}
     */
    _chart.emptyOpacity = function (emptyOpacity) {
        if (!arguments.length) {
            return _emptyOpacity;
        }
        _emptyOpacity = emptyOpacity;
        return _chart;
    };

    /**
     * Set or get opacity for symbols when the group is not empty.
     * @name nonemptyOpacity
     * @memberof dc.scatterPlot
     * @instance
     * @param {Number} [nonemptyOpacity=1]
     * @return {Number}
     * @return {dc.scatterPlot}
     */
    _chart.nonemptyOpacity = function (nonemptyOpacity) {
        if (!arguments.length) {
            return _emptyOpacity;
        }
        _nonemptyOpacity = nonemptyOpacity;
        return _chart;
    };

    _chart.legendables = function () {
        return [{chart: _chart, name: _chart._groupName, color: _chart.getColor()}];
    };

    _chart.legendHighlight = function (d) {
        resizeSymbolsWhere(symbol => symbol.attr('fill') === d.color, _highlightedSize);
        _chart.chartBodyG().selectAll('.chart-body path.symbol').filter(function () {
            return d3.select(this).attr('fill') !== d.color;
        }).classed('fadeout', true);
    };

    _chart.legendReset = function (d) {
        resizeSymbolsWhere(symbol => symbol.attr('fill') === d.color, _symbolSize);
        _chart.chartBodyG().selectAll('.chart-body path.symbol').filter(function () {
            return d3.select(this).attr('fill') !== d.color;
        }).classed('fadeout', false);
    };

    function resizeSymbolsWhere (condition, size) {
        const symbols = _chart.chartBodyG().selectAll('.chart-body path.symbol').filter(function () {
            return condition(d3.select(this));
        });
        const oldSize = _symbol.size();
        _symbol.size(size ** 2);
        transition(symbols, _chart.transitionDuration(), _chart.transitionDelay()).attr('d', _symbol);
        _symbol.size(oldSize);
    }

    _chart.setHandlePaths = function () {
        // no handle paths for poly-brushes
    };

    _chart.extendBrush = function () {
        const extent = _chart.brush().extent();
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

    _chart._brushing = function () {
        const extent = _chart.extendBrush();

        _chart.redrawBrush(_chart.g());

        if (_chart.brushIsEmpty(extent)) {
            trigger(() => {
                _chart.filter(null);
                _chart.redrawGroup();
            });
        } else {
            const ranged2DFilter = RangedTwoDimensionalFilter(extent);
            trigger(() => {
                _chart.filter(null);
                _chart.filter(ranged2DFilter);
                _chart.redrawGroup();
            }, constants.EVENT_DELAY);
        }
    };

    _chart.setBrushY = function (gBrush) {
        gBrush.call(_chart.brush().y(_chart.y()));
    };

    return _chart.anchor(parent, chartGroup);
}
