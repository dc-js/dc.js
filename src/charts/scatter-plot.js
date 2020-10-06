import {symbol} from 'd3-shape';
import {select} from 'd3-selection';
import {brush} from 'd3-brush';
import {ascending} from 'd3-array'

import {CoordinateGridMixin} from '../base/coordinate-grid-mixin';
import {optionalTransition, transition} from '../core/core';
import {filters} from '../core/filters';
import {constants} from '../core/constants';
import {events} from '../core/events';

/**
 * A scatter plot chart
 *
 * Examples:
 * - {@link http://dc-js.github.io/dc.js/examples/scatter.html Scatter Chart}
 * - {@link http://dc-js.github.io/dc.js/examples/multi-scatter.html Multi-Scatter Chart}
 * @mixes CoordinateGridMixin
 */
export class ScatterPlot extends CoordinateGridMixin {
    /**
     * Create a Scatter Plot.
     * @example
     * // create a scatter plot under #chart-container1 element using the default global chart group
     * var chart1 = new ScatterPlot('#chart-container1');
     * // create a scatter plot under #chart-container2 element using chart group A
     * var chart2 = new ScatterPlot('#chart-container2', 'chartGroupA');
     * // create a sub-chart under a composite parent chart
     * var chart3 = new ScatterPlot(compositeChart);
     * @param {String|node|d3.selection} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor (parent, chartGroup) {
        super();

        this._symbol = symbol();

        this._existenceAccessor = d => d.value;

        const originalKeyAccessor = this.keyAccessor();
        this.keyAccessor(d => originalKeyAccessor(d)[0]);
        this.valueAccessor(d => originalKeyAccessor(d)[1]);
        this.colorAccessor(() => this._groupName);

        // this basically just counteracts the setting of its own key/value accessors
        // see https://github.com/dc-js/dc.js/issues/702
        this.title(d => `${this.keyAccessor()(d)},${this.valueAccessor()(d)}: ${this.existenceAccessor()(d)}`);

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
        this._canvas = null;
        this._context = null;
        this._useCanvas = false;


        // Use a 2 dimensional brush
        this.brush(brush());

        this._symbol.size((d, i) => this._elementSize(d, i));

        this.anchor(parent, chartGroup);
    }

    // Calculates element radius for canvas plot to be comparable to D3 area based symbol sizes
    _canvasElementSize (d, isFiltered) {
        if (!this._existenceAccessor(d)) {
            return this._emptySize / Math.sqrt(Math.PI);
        } else if (isFiltered) {
            return this._symbolSize / Math.sqrt(Math.PI);
        } else {
            return this._excludedSize / Math.sqrt(Math.PI);
        }
    }

    _elementSize (d, i) {
        if (!this._existenceAccessor(d)) {
            return Math.pow(this._emptySize, 2);
        } else if (this._filtered[i]) {
            return Math.pow(this._symbolSize, 2);
        } else {
            return Math.pow(this._excludedSize, 2);
        }
    }

    _locator (d) {
        return `translate(${this.x()(this.keyAccessor()(d))},${ 
            this.y()(this.valueAccessor()(d))})`;
    }

    filter (filter) {
        if (!arguments.length) {
            return super.filter();
        }

        return super.filter(filters.RangedTwoDimensionalFilter(filter));
    }

    /**
     * Method that replaces original resetSvg and appropriately inserts canvas
     * element along with svg element and sets their CSS properties appropriately
     * so they are overlapped on top of each other.
     * Remove the chart's SVGElements from the dom and recreate the container SVGElement.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/SVGElement SVGElement}
     * @returns {SVGElement}
     */
    resetSvg () {
        if (!this._useCanvas) {
            return super.resetSvg();
        } else {
            super.resetSvg(); // Perform original svgReset inherited from baseMixin
            this.select('canvas').remove(); // remove old canvas

            const svgSel = this.svg();
            const rootSel = this.root();

            // Set root node to relative positioning and svg to absolute
            rootSel.style('position', 'relative');
            svgSel.style('position', 'relative');

            // Check if SVG element already has any extra top/left CSS offsets
            const svgLeft = isNaN(parseInt(svgSel.style('left'), 10)) ? 0 : parseInt(svgSel.style('left'), 10);
            const svgTop = isNaN(parseInt(svgSel.style('top'), 10)) ? 0 : parseInt(svgSel.style('top'), 10);
            const width = this.effectiveWidth();
            const height = this.effectiveHeight();
            const margins = this.margins(); // {top: 10, right: 130, bottom: 42, left: 42}

            // Add the canvas element such that it perfectly overlaps the plot area of the scatter plot SVG
            const devicePixelRatio = window.devicePixelRatio || 1;
            this._canvas = this.root().append('canvas')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', (width) * devicePixelRatio)
                .attr('height', (height) * devicePixelRatio)
                .style('width', `${width}px`)
                .style('height', `${height}px`)
                .style('position', 'absolute')
                .style('top', `${margins.top + svgTop}px`)
                .style('left', `${margins.left + svgLeft}px`)
                .style('z-index', -1) // Place behind SVG
                .style('pointer-events', 'none'); // Disable pointer events on canvas so SVG can capture brushing

            // Define canvas context and set clipping path
            this._context = this._canvas.node().getContext('2d');
            this._context.scale(devicePixelRatio, devicePixelRatio);
            this._context.rect(0, 0, width, height);
            this._context.clip(); // Setup clipping path
            this._context.imageSmoothingQuality = 'high';

            return this.svg(); // Respect original return param for this.resetSvg;
        }
    }

    _resizeCanvas () {
        const width = this.effectiveWidth();
        const height = this.effectiveHeight();

        const devicePixelRatio = window.devicePixelRatio || 1;
        this._canvas
            .attr('width', (width) * devicePixelRatio)
            .attr('height', (height) * devicePixelRatio)
            .style('width', `${width}px`)
            .style('height', `${height}px`);
        this._context.scale(devicePixelRatio, devicePixelRatio);
    }


    /**
     * Set or get whether to use canvas backend for plotting scatterPlot. Note that the
     * canvas backend does not currently support
     * {@link ScatterPlot#customSymbol customSymbol} or
     * {@link ScatterPlot#symbol symbol} methods and is limited to always plotting
     * with filled circles. Symbols are drawn with
     * {@link ScatterPlot#symbolSize symbolSize} radius. By default, the SVG backend
     * is used when `useCanvas` is set to `false`.
     * @param {Boolean} [useCanvas=false]
     * @return {Boolean|d3.selection}
     */
    useCanvas (useCanvas) {
        if (!arguments.length) {
            return this._useCanvas;
        }
        this._useCanvas = useCanvas;
        return this;
    }

    /**
     * Set or get canvas element. You should usually only ever use the get method as
     * dc.js will handle canvas element generation.  Provides valid canvas only when
     * {@link ScatterPlot#useCanvas useCanvas} is set to `true`
     * @param {CanvasElement|d3.selection} [canvasElement]
     * @return {CanvasElement|d3.selection}
     */
    canvas (canvasElement) {
        if (!arguments.length) {
            return this._canvas;
        }
        this._canvas = canvasElement;
        return this;
    }

    /**
     * Get canvas 2D context. Provides valid context only when
     * {@link ScatterPlot#useCanvas useCanvas} is set to `true`
     * @return {CanvasContext}
     */
    context () {
        return this._context;
    }

    /*eslint complexity: [2,11] */
    // Plots data on canvas element. If argument provided, assumes legend is
    // currently being highlighted and modifies opacity/size of symbols accordingly
    // @param {Object} [legendHighlightDatum] - Datum provided to legendHighlight method
    _plotOnCanvas (legendHighlightDatum) {
        this._resizeCanvas();
        const context = this.context();
        context.clearRect(0, 0, (context.canvas.width + 2) * 1, (context.canvas.height + 2) * 1);
        const data = this.data();

        // Draw the data on canvas
        data.forEach((d, i) => {
            const isFiltered = !this.filter() || this.filter().isFiltered([d.key[0], d.key[1]]);
            // Calculate opacity for current data point
            let cOpacity = 1;
            if (!this._existenceAccessor(d)) {
                cOpacity = this._emptyOpacity;
            } else if (isFiltered) {
                cOpacity = this._nonemptyOpacity;
            } else {
                cOpacity = this.excludedOpacity();
            }
            // Calculate color for current data point
            let cColor = null;
            if (this._emptyColor && !this._existenceAccessor(d)) {
                cColor = this._emptyColor;
            } else if (this.excludedColor() && !isFiltered) {
                cColor = this.excludedColor();
            } else {
                cColor = this.getColor(d);
            }
            let cSize = this._canvasElementSize(d, isFiltered);

            // Adjust params for data points if legend is highlighted
            if (legendHighlightDatum) {
                const isHighlighted = (cColor === legendHighlightDatum.color);
                // Calculate opacity for current data point
                const fadeOutOpacity = 0.1; // TODO: Make this programmatically setable
                if (!isHighlighted) { // Fade out non-highlighted colors + highlighted colors outside filter
                    cOpacity = fadeOutOpacity;
                }
                if (isHighlighted) { // Set size for highlighted color data points
                    cSize = this._highlightedSize / Math.sqrt(Math.PI);
                }
            }

            // Draw point on canvas
            context.save();
            context.globalAlpha = cOpacity;
            context.beginPath();
            context.arc(this.x()(this.keyAccessor()(d)), this.y()(this.valueAccessor()(d)), cSize, 0, 2 * Math.PI, true);
            context.fillStyle = cColor;
            context.fill();
            // context.lineWidth = 0.5; // Commented out code to add stroke around scatter points if desired
            // context.strokeStyle = '#333';
            // context.stroke();
            context.restore();
        });
    }

    _plotOnSVG () {

        const data = this.data();

        if (this._keyboardAccessible) {
            // sort based on the x value (key)
            data.sort((a, b) => ascending(this.keyAccessor()(a), this.keyAccessor()(b)));
        }

        let symbols = this.chartBodyG().selectAll('path.symbol')
            .data(data);

        transition(symbols.exit(), this.transitionDuration(), this.transitionDelay())
            .attr('opacity', 0).remove();

        symbols = symbols
            .enter()
            .append('path')
            .attr('class', 'symbol')
            .classed('dc-tabbable', this._keyboardAccessible)
            .attr('opacity', 0)
            .attr('fill', this.getColor)
            .attr('transform', d => this._locator(d))
            .merge(symbols);

        // no click handler - just tabindex for reading out of tooltips
        if (this._keyboardAccessible) {
            this._makeKeyboardAccessible();
            symbols.order();
        }

        symbols.call(s => this._renderTitles(s, data));

        symbols.each((d, i) => {
            this._filtered[i] = !this.filter() || this.filter().isFiltered([this.keyAccessor()(d), this.valueAccessor()(d)]);
        });

        transition(symbols, this.transitionDuration(), this.transitionDelay())
            .attr('opacity', (d, i) => {
                if (!this._existenceAccessor(d)) {
                    return this._emptyOpacity;
                } else if (this._filtered[i]) {
                    return this._nonemptyOpacity;
                } else {
                    return this.excludedOpacity();
                }
            })
            .attr('fill', (d, i) => {
                if (this._emptyColor && !this._existenceAccessor(d)) {
                    return this._emptyColor;
                } else if (this.excludedColor() && !this._filtered[i]) {
                    return this.excludedColor();
                } else {
                    return this.getColor(d);
                }
            })
            .attr('transform', d => this._locator(d))
            .attr('d', this._symbol);
    }

    plotData () {
        if (this._useCanvas) {
            this._plotOnCanvas();
        } else {
            this._plotOnSVG();
        }
    }

    _renderTitles (_symbol, _d) {
        if (this.renderTitle()) {
            _symbol.selectAll('title').remove();
            _symbol.append('title').text(d => this.title()(d));
        }
    }

    /**
     * Get or set the existence accessor.  If a point exists, it is drawn with
     * {@link ScatterPlot#symbolSize symbolSize} radius and
     * opacity 1; if it does not exist, it is drawn with
     * {@link ScatterPlot#emptySize emptySize} radius and opacity 0. By default,
     * the existence accessor checks if the reduced value is truthy.
     * @see {@link ScatterPlot#symbolSize symbolSize}
     * @see {@link ScatterPlot#emptySize emptySize}
     * @example
     * // default accessor
     * chart.existenceAccessor(function (d) { return d.value; });
     * @param {Function} [accessor]
     * @returns {Function|ScatterPlot}
     */
    existenceAccessor (accessor) {
        if (!arguments.length) {
            return this._existenceAccessor;
        }
        this._existenceAccessor = accessor;
        return this;
    }

    /**
     * Get or set the symbol type used for each point. By default the symbol is a circle (d3.symbolCircle).
     * Type can be a constant or an accessor.
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_type symbol.type}
     * @example
     * // Circle type
     * chart.symbol(d3.symbolCircle);
     * // Square type
     * chart.symbol(d3.symbolSquare);
     * @param {Function} [type=d3.symbolCircle]
     * @returns {Function|ScatterPlot}
     */
    symbol (type) {
        if (!arguments.length) {
            return this._symbol.type();
        }
        this._symbol.type(type);
        return this;
    }

    /**
     * Get or set the symbol generator. By default `ScatterPlot` will use
     * {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol d3.symbol()}
     * to generate symbols. `ScatterPlot` will set the
     * {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size symbol size accessor}
     * on the symbol generator.
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol d3.symbol}
     * @see {@link https://stackoverflow.com/questions/25332120/create-additional-d3-js-symbols Create additional D3.js symbols}
     * @param {String|Function} [customSymbol=d3.symbol()]
     * @returns {String|Function|ScatterPlot}
     */
    customSymbol (customSymbol) {
        if (!arguments.length) {
            return this._symbol;
        }
        this._symbol = customSymbol;
        this._symbol.size((d, i) => this._elementSize(d, i));
        return this;
    }

    /**
     * Set or get radius for symbols.
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size d3.symbol.size}
     * @param {Number} [symbolSize=3]
     * @returns {Number|ScatterPlot}
     */
    symbolSize (symbolSize) {
        if (!arguments.length) {
            return this._symbolSize;
        }
        this._symbolSize = symbolSize;
        return this;
    }

    /**
     * Set or get radius for highlighted symbols.
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size d3.symbol.size}
     * @param {Number} [highlightedSize=5]
     * @returns {Number|ScatterPlot}
     */
    highlightedSize (highlightedSize) {
        if (!arguments.length) {
            return this._highlightedSize;
        }
        this._highlightedSize = highlightedSize;
        return this;
    }

    /**
     * Set or get size for symbols excluded from this chart's filter. If null, no
     * special size is applied for symbols based on their filter status.
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size d3.symbol.size}
     * @param {Number} [excludedSize=null]
     * @returns {Number|ScatterPlot}
     */
    excludedSize (excludedSize) {
        if (!arguments.length) {
            return this._excludedSize;
        }
        this._excludedSize = excludedSize;
        return this;
    }

    /**
     * Set or get color for symbols excluded from this chart's filter. If null, no
     * special color is applied for symbols based on their filter status.
     * @param {Number} [excludedColor=null]
     * @returns {Number|ScatterPlot}
     */
    excludedColor (excludedColor) {
        if (!arguments.length) {
            return this._excludedColor;
        }
        this._excludedColor = excludedColor;
        return this;
    }

    /**
     * Set or get opacity for symbols excluded from this chart's filter.
     * @param {Number} [excludedOpacity=1.0]
     * @returns {Number|ScatterPlot}
     */
    excludedOpacity (excludedOpacity) {
        if (!arguments.length) {
            return this._excludedOpacity;
        }
        this._excludedOpacity = excludedOpacity;
        return this;
    }

    /**
     * Set or get radius for symbols when the group is empty.
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size d3.symbol.size}
     * @param {Number} [emptySize=0]
     * @returns {Number|ScatterPlot}
     */
    emptySize (emptySize) {
        if (!arguments.length) {
            return this._emptySize;
        }
        this._emptySize = emptySize;
        return this;
    }

    hiddenSize (emptySize) {
        if (!arguments.length) {
            return this.emptySize();
        }
        return this.emptySize(emptySize);
    }

    /**
     * Set or get color for symbols when the group is empty. If null, just use the
     * {@link ColorMixin#colors colorMixin.colors} color scale zero value.
     * @param {String} [emptyColor=null]
     * @return {String}
     * @return {ScatterPlot}/
     */
    emptyColor (emptyColor) {
        if (!arguments.length) {
            return this._emptyColor;
        }
        this._emptyColor = emptyColor;
        return this;
    }

    /**
     * Set or get opacity for symbols when the group is empty.
     * @param {Number} [emptyOpacity=0]
     * @return {Number}
     * @return {ScatterPlot}
     */
    emptyOpacity (emptyOpacity) {
        if (!arguments.length) {
            return this._emptyOpacity;
        }
        this._emptyOpacity = emptyOpacity;
        return this;
    }

    /**
     * Set or get opacity for symbols when the group is not empty.
     * @param {Number} [nonemptyOpacity=1]
     * @return {Number}
     * @return {ScatterPlot}
     */
    nonemptyOpacity (nonemptyOpacity) {
        if (!arguments.length) {
            return this._emptyOpacity;
        }
        this._nonemptyOpacity = nonemptyOpacity;
        return this;
    }

    legendables () {
        return [{chart: this, name: this._groupName, color: this.getColor()}];
    }

    legendHighlight (d) {
        if (this._useCanvas) {
            this._plotOnCanvas(d); // Supply legend datum to plotOnCanvas
        } else {
            this._resizeSymbolsWhere(s => s.attr('fill') === d.color, this._highlightedSize);
            this.chartBodyG().selectAll('.chart-body path.symbol').filter(function () {
                return select(this).attr('fill') !== d.color;
            }).classed('fadeout', true);
        }
    }

    legendReset (d) {
        if (this._useCanvas) {
            this._plotOnCanvas(d); // Supply legend datum to plotOnCanvas
        } else {
            this._resizeSymbolsWhere(s => s.attr('fill') === d.color, this._symbolSize);
            this.chartBodyG().selectAll('.chart-body path.symbol').filter(function () {
                return select(this).attr('fill') !== d.color;
            }).classed('fadeout', false);
        }
    }

    _resizeSymbolsWhere (condition, size) {
        const symbols = this.chartBodyG().selectAll('.chart-body path.symbol').filter(function () {
            return condition(select(this));
        });
        const oldSize = this._symbol.size();
        this._symbol.size(Math.pow(size, 2));
        transition(symbols, this.transitionDuration(), this.transitionDelay()).attr('d', this._symbol);
        this._symbol.size(oldSize);
    }
    createBrushHandlePaths () {
        // no handle paths for poly-brushes
    }

    extendBrush (brushSelection) {
        if (this.round()) {
            brushSelection[0] = brushSelection[0].map(this.round());
            brushSelection[1] = brushSelection[1].map(this.round());
        }
        return brushSelection;
    }

    brushIsEmpty (brushSelection) {
        return !brushSelection || brushSelection[0][0] >= brushSelection[1][0] || brushSelection[0][1] >= brushSelection[1][1];
    }

    _brushing (evt) {
        if (this._ignoreBrushEvents) {
            return;
        }

        let brushSelection = evt.selection;

        // Testing with pixels is more reliable
        let brushIsEmpty = this.brushIsEmpty(brushSelection);

        if (brushSelection) {
            brushSelection = brushSelection.map(point => point.map((coord, i) => {
                const scale = i === 0 ? this.x() : this.y();
                return scale.invert(coord);
            }));

            brushSelection = this.extendBrush(brushSelection);

            // The rounding process might have made brushSelection empty, so we need to recheck
            brushIsEmpty = brushIsEmpty && this.brushIsEmpty(brushSelection);
        }

        this.redrawBrush(brushSelection, false);

        const ranged2DFilter = brushIsEmpty ? null : filters.RangedTwoDimensionalFilter(brushSelection);

        events.trigger(() => {
            this.replaceFilter(ranged2DFilter);
            this.redrawGroup();
        }, constants.EVENT_DELAY);
    }

    redrawBrush (brushSelection, doTransition) {
        // override default x axis brush from parent chart
        this._gBrush = this.gBrush();

        if (this.brushOn() && this._gBrush) {
            if (this.resizing()) {
                this.setBrushExtents(doTransition);
            }

            if (!brushSelection) {
                this._withoutBrushEvents(() => {
                    this._gBrush
                        .call(this.brush().move, brushSelection);
                });
            } else {
                brushSelection = brushSelection.map(point => point.map((coord, i) => {
                    const scale = i === 0 ? this.x() : this.y();
                    return scale(coord);
                }));

                const gBrush =
                    optionalTransition(doTransition, this.transitionDuration(), this.transitionDelay())(this._gBrush);

                this._withoutBrushEvents(() => {
                    gBrush
                        .call(this.brush().move, brushSelection);
                });
            }
        }

        this.fadeDeselectedArea(brushSelection);
    }
}

export const scatterPlot = (parent, chartGroup) => new ScatterPlot(parent, chartGroup);
