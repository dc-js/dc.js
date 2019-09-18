import * as d3 from 'd3';

import {CoordinateGridMixin} from '../base/coordinate-grid-mixin';
import {optionalTransition, override, transition} from '../core/core';
import {filters} from '../core/filters';
import {constants} from '../core/constants';
import {events} from '../core/events';

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
 * var chart1 = dc.scatterPlot('#chart-container1');
 * // create a scatter plot under #chart-container2 element using chart group A
 * var chart2 = dc.scatterPlot('#chart-container2', 'chartGroupA');
 * // create a sub-chart under a composite parent chart
 * var chart3 = dc.scatterPlot(compositeChart);
 * @param {String|node|d3.selection} parent - Any valid
 * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.scatterPlot}
 */
export class ScatterPlot extends CoordinateGridMixin {
    constructor (parent, chartGroup) {
        super();

        this._symbol = d3.symbol();

        this._existenceAccessor = d => d.value;

        const originalKeyAccessor = this.keyAccessor();
        this.keyAccessor(d => originalKeyAccessor(d)[0]);
        this.valueAccessor(d => originalKeyAccessor(d)[1]);
        this.colorAccessor(() => this._groupName);

        this.title(d => {
            // this basically just counteracts the setting of its own key/value accessors
            // see https://github.com/dc-js/dc.js/issues/702
            return this.keyAccessor()(d) + ',' + this.valueAccessor()(d) + ': ' +
                this.existenceAccessor()(d);
        });

        this._highlightedSize = 7;
        this._symbolSize = 5;
        this._excludedSize = 3;
        this._excludedColor = null;
        this._excludedOpacity = 1.0;
        this._emptySize = 0;
        this._emptyOpacity = 0;
        this._nonemptyOpacity = 1;
        this._emptyColor = null;
        this._filtered = [];

        // Use a 2 dimensional brush
        this.brush(d3.brush());

        this._symbol.size((d, i) => this._elementSize(d, i));

        // ES6: do we need this
        this.hiddenSize = this.emptySize;

        this.anchor(parent, chartGroup);
    }

    _elementSize (d, i) {
        const self = this;
        if (!self._existenceAccessor(d)) {
            return Math.pow(self._emptySize, 2);
        } else if (self._filtered[i]) {
            return Math.pow(self._symbolSize, 2);
        } else {
            return Math.pow(self._excludedSize, 2);
        }
    }

    _locator (d) {
        const self = this;
        return 'translate(' + self.x()(self.keyAccessor()(d)) + ',' +
            self.y()(self.valueAccessor()(d)) + ')';
    }

    filter (filter) {
        const self = this;
        if (!arguments.length) {
            return super.filter();
        }

        return super.filter(filters.RangedTwoDimensionalFilter(filter));
    }

    plotData () {
        const self = this;
        let symbols = self.chartBodyG().selectAll('path.symbol')
            .data(self.data());

        transition(symbols.exit(), self.transitionDuration(), self.transitionDelay())
            .attr('opacity', 0).remove();

        symbols = symbols
            .enter()
            .append('path')
            .attr('class', 'symbol')
            .attr('opacity', 0)
            .attr('fill', self.getColor)
            .attr('transform', d => self._locator(d))
            .merge(symbols);

        symbols.call(symbol => self._renderTitles(symbol, self.data()));

        symbols.each((d, i) => {
            self._filtered[i] = !self.filter() || self.filter().isFiltered([self.keyAccessor()(d), self.valueAccessor()(d)]);
        });

        transition(symbols, self.transitionDuration(), self.transitionDelay())
            .attr('opacity', (d, i) => {
                if (!self._existenceAccessor(d)) {
                    return self._emptyOpacity;
                } else if (self._filtered[i]) {
                    return self._nonemptyOpacity;
                } else {
                    return self.excludedOpacity();
                }
            })
            .attr('fill', (d, i) => {
                if (self._emptyColor && !self._existenceAccessor(d)) {
                    return self._emptyColor;
                } else if (self.excludedColor() && !self._filtered[i]) {
                    return self.excludedColor();
                } else {
                    return self.getColor(d);
                }
            })
            .attr('transform', d => self._locator(d))
            .attr('d', self._symbol);
    }

    _renderTitles (symbol, d) {
        const self = this;
        if (self.renderTitle()) {
            symbol.selectAll('title').remove();
            symbol.append('title').text(d => self.title()(d));
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
    existenceAccessor (accessor) {
        const self = this;
        if (!arguments.length) {
            return self._existenceAccessor;
        }
        self._existenceAccessor = accessor;
        return self;
    }

    /**
     * Get or set the symbol type used for each point. By default the symbol is a circle (d3.symbolCircle).
     * Type can be a constant or an accessor.
     * @method symbol
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_type symbol.type}
     * @example
     * // Circle type
     * chart.symbol(d3.symbolCircle);
     * // Square type
     * chart.symbol(d3.symbolSquare);
     * @param {Function} [type=d3.symbolCircle]
     * @returns {Function|dc.scatterPlot}
     */
    symbol (type) {
        const self = this;
        if (!arguments.length) {
            return self._symbol.type();
        }
        self._symbol.type(type);
        return self;
    }

    /**
     * Get or set the symbol generator. By default `dc.scatterPlot` will use
     * {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol d3.symbol()}
     * to generate symbols. `dc.scatterPlot` will set the
     * {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size symbol size accessor}
     * on the symbol generator.
     * @method customSymbol
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol d3.symbol}
     * @see {@link https://stackoverflow.com/questions/25332120/create-additional-d3-js-symbols Create additional D3.js symbols}
     * @param {String|Function} [customSymbol=d3.symbol()]
     * @returns {String|Function|dc.scatterPlot}
     */
    customSymbol (customSymbol) {
        const self = this;
        if (!arguments.length) {
            return self._symbol;
        }
        self._symbol = customSymbol;
        self._symbol.size((d, i) => self._elementSize(d, i));
        return self;
    }

    /**
     * Set or get radius for symbols.
     * @method symbolSize
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size d3.symbol.size}
     * @param {Number} [symbolSize=3]
     * @returns {Number|dc.scatterPlot}
     */
    symbolSize (symbolSize) {
        const self = this;
        if (!arguments.length) {
            return self._symbolSize;
        }
        self._symbolSize = symbolSize;
        return self;
    }

    /**
     * Set or get radius for highlighted symbols.
     * @method highlightedSize
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size d3.symbol.size}
     * @param {Number} [highlightedSize=5]
     * @returns {Number|dc.scatterPlot}
     */
    highlightedSize (highlightedSize) {
        const self = this;
        if (!arguments.length) {
            return self._highlightedSize;
        }
        self._highlightedSize = highlightedSize;
        return self;
    }

    /**
     * Set or get size for symbols excluded from this chart's filter. If null, no
     * special size is applied for symbols based on their filter status.
     * @method excludedSize
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size d3.symbol.size}
     * @param {Number} [excludedSize=null]
     * @returns {Number|dc.scatterPlot}
     */
    excludedSize (excludedSize) {
        const self = this;
        if (!arguments.length) {
            return self._excludedSize;
        }
        self._excludedSize = excludedSize;
        return self;
    }

    /**
     * Set or get color for symbols excluded from this chart's filter. If null, no
     * special color is applied for symbols based on their filter status.
     * @method excludedColor
     * @memberof dc.scatterPlot
     * @instance
     * @param {Number} [excludedColor=null]
     * @returns {Number|dc.scatterPlot}
     */
    excludedColor (excludedColor) {
        const self = this;
        if (!arguments.length) {
            return self._excludedColor;
        }
        self._excludedColor = excludedColor;
        return self;
    }

    /**
     * Set or get opacity for symbols excluded from this chart's filter.
     * @method excludedOpacity
     * @memberof dc.scatterPlot
     * @instance
     * @param {Number} [excludedOpacity=1.0]
     * @returns {Number|dc.scatterPlot}
     */
    excludedOpacity (excludedOpacity) {
        const self = this;
        if (!arguments.length) {
            return self._excludedOpacity;
        }
        self._excludedOpacity = excludedOpacity;
        return self;
    }

    /**
     * Set or get radius for symbols when the group is empty.
     * @method emptySize
     * @memberof dc.scatterPlot
     * @instance
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size d3.symbol.size}
     * @param {Number} [emptySize=0]
     * @returns {Number|dc.scatterPlot}
     */
    emptySize (emptySize) {
        const self = this;
        if (!arguments.length) {
            return self._emptySize;
        }
        self._emptySize = emptySize;
        return self;
    }

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
    emptyColor (emptyColor) {
        const self = this;
        if (!arguments.length) {
            return self._emptyColor;
        }
        self._emptyColor = emptyColor;
        return self;
    }

    /**
     * Set or get opacity for symbols when the group is empty.
     * @name emptyOpacity
     * @memberof dc.scatterPlot
     * @instance
     * @param {Number} [emptyOpacity=0]
     * @return {Number}
     * @return {dc.scatterPlot}
     */
    emptyOpacity (emptyOpacity) {
        const self = this;
        if (!arguments.length) {
            return self._emptyOpacity;
        }
        self._emptyOpacity = emptyOpacity;
        return self;
    }

    /**
     * Set or get opacity for symbols when the group is not empty.
     * @name nonemptyOpacity
     * @memberof dc.scatterPlot
     * @instance
     * @param {Number} [nonemptyOpacity=1]
     * @return {Number}
     * @return {dc.scatterPlot}
     */
    nonemptyOpacity (nonemptyOpacity) {
        const self = this;
        if (!arguments.length) {
            return self._emptyOpacity;
        }
        self._nonemptyOpacity = nonemptyOpacity;
        return self;
    }

    legendables () {
        return [{chart: this, name: this._groupName, color: this.getColor()}];
    }

    legendHighlight (d) {
        const self = this;
        self._resizeSymbolsWhere(symbol => symbol.attr('fill') === d.color, self._highlightedSize);
        self.chartBodyG().selectAll('.chart-body path.symbol').filter(function () {
            return d3.select(this).attr('fill') !== d.color;
        }).classed('fadeout', true);
    }

    legendReset (d) {
        const self = this;
        self._resizeSymbolsWhere(symbol => symbol.attr('fill') === d.color, self._symbolSize);
        self.chartBodyG().selectAll('.chart-body path.symbol').filter(function () {
            return d3.select(this).attr('fill') !== d.color;
        }).classed('fadeout', false);
    }

    _resizeSymbolsWhere (condition, size) {
        const self = this;
        const symbols = self.chartBodyG().selectAll('.chart-body path.symbol').filter(function () {
            return condition(d3.select(this));
        });
        const oldSize = self._symbol.size();
        self._symbol.size(Math.pow(size, 2));
        transition(symbols, self.transitionDuration(), self.transitionDelay()).attr('d', self._symbol);
        self._symbol.size(oldSize);
    }
    createBrushHandlePaths () {
        // no handle paths for poly-brushes
    };

    extendBrush (brushSelection) {
        const self = this;
        if (self.round()) {
            brushSelection[0] = brushSelection[0].map(self.round());
            brushSelection[1] = brushSelection[1].map(self.round());
        }
        return brushSelection;
    };

    brushIsEmpty (brushSelection) {
        return !brushSelection || brushSelection[0][0] >= brushSelection[1][0] || brushSelection[0][1] >= brushSelection[1][1];
    };

    _brushing () {
        const self = this;
        // Avoids infinite recursion (mutual recursion between range and focus operations)
        // Source Event will be null when brush.move is called programmatically (see below as well).
        if (!d3.event.sourceEvent) {
            return;
        }

        // Ignore event if recursive event - i.e. not directly generated by user action (like mouse/touch etc.)
        // In this case we are more worried about this handler causing brush move programmatically which will
        // cause this handler to be invoked again with a new d3.event (and current event set as sourceEvent)
        // This check avoids recursive calls
        if (d3.event.sourceEvent.type && ['start', 'brush', 'end'].indexOf(d3.event.sourceEvent.type) !== -1) {
            return;
        }

        let brushSelection = d3.event.selection;

        // Testing with pixels is more reliable
        let brushIsEmpty = self.brushIsEmpty(brushSelection);

        if (brushSelection) {
            brushSelection = brushSelection.map(point => point.map((coord, i) => {
                const scale = i === 0 ? self.x() : self.y();
                return scale.invert(coord);
            }));

            brushSelection = self.extendBrush(brushSelection);

            // The rounding process might have made brushSelection empty, so we need to recheck
            brushIsEmpty = brushIsEmpty && self.brushIsEmpty(brushSelection);
        }

        self.redrawBrush(brushSelection, false);

        const ranged2DFilter = brushIsEmpty ? null : filters.RangedTwoDimensionalFilter(brushSelection);

        events.trigger(() => {
            self.replaceFilter(ranged2DFilter);
            self.redrawGroup();
        }, constants.EVENT_DELAY);
    };

    redrawBrush (brushSelection, doTransition) {
        const self = this;
        // override default x axis brush from parent chart
        self._brush = self.brush();
        self._gBrush = self.gBrush();

        if (self.brushOn() && self._gBrush) {
            if (self.resizing()) {
                self.setBrushExtents(doTransition);
            }

            if (!brushSelection) {
                self._gBrush
                    .call(self._brush.move, brushSelection);

            } else {
                brushSelection = brushSelection.map(point => point.map((coord, i) => {
                    const scale = i === 0 ? self.x() : self.y();
                    return scale(coord);
                }));

                const gBrush =
                    optionalTransition(doTransition, self.transitionDuration(), self.transitionDelay())(self._gBrush);

                gBrush
                    .call(self._brush.move, brushSelection);

            }
        }

        self.fadeDeselectedArea(brushSelection);
    };

    setBrushY (gBrush) {
        const self = this;
        gBrush.call(self.brush().y(self.y()));
    };
}

export const scatterPlot = (parent, chartGroup) => new ScatterPlot(parent, chartGroup);
