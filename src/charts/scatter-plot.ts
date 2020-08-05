import {symbol, Symbol, SymbolType} from 'd3-shape';
import {event, select, Selection} from 'd3-selection';
import {brush} from 'd3-brush';

import {CoordinateGridMixin} from '../base/coordinate-grid-mixin';
import {optionalTransition, transition} from '../core/core';
import {filters} from '../core/filters';
import {constants} from '../core/constants';
import {events} from '../core/events';
import {BaseAccessor, ChartGroupType, ChartParentType, LegendItem} from '../core/types';

export type SymbolTypeGenerator = (d: any, ...args: any[]) => SymbolType;

/**
 * A scatter plot chart
 *
 * Examples:
 * - {@link http://dc-js.github.io/dc.js/examples/scatter.html Scatter Chart}
 * - {@link http://dc-js.github.io/dc.js/examples/multi-scatter.html Multi-Scatter Chart}
 * @mixes CoordinateGridMixin
 */
export class ScatterPlot extends CoordinateGridMixin {
    private _symbol: Symbol<any, any>;
    private _existenceAccessor: BaseAccessor<any>; // It is used as truthy/falsy, which can't be expressed in Typescript
    private _highlightedSize: number;
    private _symbolSize: number;
    private _excludedSize: number;
    private _excludedColor: string;
    private _excludedOpacity: number;
    private _emptySize: number;
    private _emptyOpacity: number;
    private _nonemptyOpacity: number;
    private _emptyColor: string;
    private _filtered;
    private _canvas: Selection<HTMLCanvasElement, any, any, any>;
    private _context: CanvasRenderingContext2D;
    private _useCanvas: boolean;

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
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
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
    private _canvasElementSize (d, isFiltered): number {
        if (!this._existenceAccessor(d)) {
            return this._emptySize / Math.sqrt(Math.PI);
        } else if (isFiltered) {
            return this._symbolSize / Math.sqrt(Math.PI);
        } else {
            return this._excludedSize / Math.sqrt(Math.PI);
        }
    }

    private _elementSize (d, i): number {
        if (!this._existenceAccessor(d)) {
            return Math.pow(this._emptySize, 2);
        } else if (this._filtered[i]) {
            return Math.pow(this._symbolSize, 2);
        } else {
            return Math.pow(this._excludedSize, 2);
        }
    }

    private _locator (d): string {
        return `translate(${this.x()(this.keyAccessor()(d))},${
            this.y()(this.valueAccessor()(d))})`;
    }

    public filter ();
    public filter (filter): this;
    public filter (filter?) {
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
    public resetSvg () {
        if (!this._useCanvas) {
            return super.resetSvg();
        } else {
            super.resetSvg(); // Perform original svgReset inherited from baseMixin
            this.select('canvas').remove(); // remove old canvas

            const svgSel: Selection<SVGElement, any, any, any> = this.svg();
            const rootSel: Selection<Element, any, any, any> = this.root();

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

    public _resizeCanvas () {
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
    public useCanvas (): boolean;
    public useCanvas (useCanvas: boolean): this;
    public useCanvas (useCanvas?) {
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
    public canvas (): Selection<HTMLCanvasElement, any, any, any>;
    public canvas (canvasElement: Selection<HTMLCanvasElement, any, any, any>): this;
    public canvas (canvasElement?) {
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
    public context (): CanvasRenderingContext2D {
        return this._context;
    }

    /*eslint complexity: [2,11] */
    // Plots data on canvas element. If argument provided, assumes legend is
    // currently being highlighted and modifies opacity/size of symbols accordingly
    // @param {Object} [legendHighlightDatum] - Datum provided to legendHighlight method
    private _plotOnCanvas (legendHighlightDatum?) {
        this._resizeCanvas();
        const context = this.context();
        context.clearRect(0, 0, context.canvas.width + 2, context.canvas.height + 2);
        const data = this.data();

        // Draw the data on canvas
        data.forEach((d, i) => {
            const isFiltered = !this.filter() || this.filter().isFiltered([d.key[0], d.key[1]]);
            // Calculate opacity for current data point
            let cOpacity: number = 1;
            if (!this._existenceAccessor(d)) {
                cOpacity = this._emptyOpacity;
            } else if (isFiltered) {
                cOpacity = this._nonemptyOpacity;
            } else {
                cOpacity = this.excludedOpacity();
            }
            // Calculate color for current data point
            let cColor: string = null;
            if (this._emptyColor && !this._existenceAccessor(d)) {
                cColor = this._emptyColor;
            } else if (this.excludedColor() && !isFiltered) {
                cColor = this.excludedColor();
            } else {
                cColor = this.getColor(d);
            }

            let cSize: number = this._canvasElementSize(d, isFiltered);

            // Adjust params for data points if legend is highlighted
            if (legendHighlightDatum) {
                const isHighlighted = (cColor === legendHighlightDatum.color);
                // Calculate opacity for current data point
                const fadeOutOpacity = 0.1; // TODO: Make this programmatically settable
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

    private _plotOnSVG (): void {
        // TODO: come back after fixing the type for this.chartBodyG()
        let symbols = (this.chartBodyG() as Selection<SVGGElement, any, any, any>).selectAll<SVGPathElement, any>('path.symbol')
            .data<any>(this.data());

        transition(symbols.exit(), this._conf.transitionDuration, this._conf.transitionDelay)
            .attr('opacity', 0).remove();

        symbols = symbols
            .enter()
            .append('path')
            .attr('class', 'symbol')
            .attr('opacity', 0)
            .attr('fill', (d, i) => this.getColor(d, i))
            .attr('transform', d => this._locator(d))
            .merge(symbols);

        symbols.call(s => this._renderTitles(s, this.data()));

        symbols.each((d, i) => {
            this._filtered[i] = !this.filter() || this.filter().isFiltered([this.keyAccessor()(d), this.valueAccessor()(d)]);
        });

        transition(symbols, this._conf.transitionDuration, this._conf.transitionDelay)
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

    public plotData (): void {
        if (this._useCanvas) {
            this._plotOnCanvas();
        } else {
            this._plotOnSVG();
        }
    }

    private _renderTitles (_symbol: Selection<SVGPathElement, any, SVGGElement, any>, _d): void {
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
    public existenceAccessor (): BaseAccessor<any>;
    public existenceAccessor (accessor: BaseAccessor<any>): this;
    public existenceAccessor (accessor?) {
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
    public symbol (): SymbolTypeGenerator;
    public symbol (type: SymbolTypeGenerator): this;
    public symbol (type?) {
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
    public customSymbol (): Symbol<any, any>;
    public customSymbol (customSymbol: Symbol<any, any>): this;
    public customSymbol (customSymbol?) {
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
    public symbolSize (): number;
    public symbolSize (symbolSize: number): this;
    public symbolSize (symbolSize?) {
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
    public highlightedSize (): number;
    public highlightedSize (highlightedSize: number): this;
    public highlightedSize (highlightedSize?) {
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
    public excludedSize (): number;
    public excludedSize (excludedSize: number): this;
    public excludedSize (excludedSize?) {
        if (!arguments.length) {
            return this._excludedSize;
        }
        this._excludedSize = excludedSize;
        return this;
    }

    /**
     * Set or get color for symbols excluded from this chart's filter. If null, no
     * special color is applied for symbols based on their filter status.
     * @param {string} [excludedColor=null]
     * @returns {string|ScatterPlot}
     */
    public excludedColor (): string;
    public excludedColor (excludedColor: string): this;
    public excludedColor (excludedColor?) {
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
    public excludedOpacity (): number;
    public excludedOpacity (excludedOpacity: number): this;
    public excludedOpacity (excludedOpacity?) {
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
    public emptySize (): number;
    public emptySize (emptySize: number): this;
    public emptySize (emptySize?) {
        if (!arguments.length) {
            return this._emptySize;
        }
        this._emptySize = emptySize;
        return this;
    }

    public hiddenSize (): number;
    public hiddenSize (emptySize: number): this;
    public hiddenSize (emptySize?) {
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
    public emptyColor (): string;
    public emptyColor (emptyColor: string): this;
    public emptyColor (emptyColor?) {
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
    public emptyOpacity (): number;
    public emptyOpacity (emptyOpacity: number): this;
    public emptyOpacity (emptyOpacity?) {
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
    public nonemptyOpacity (): number;
    public nonemptyOpacity (nonemptyOpacity: number): this;
    public nonemptyOpacity (nonemptyOpacity?) {
        if (!arguments.length) {
            return this._emptyOpacity;
        }
        this._nonemptyOpacity = nonemptyOpacity;
        return this;
    }

    public legendables (): LegendItem[] {
        return [{chart: this, name: this._groupName, color: this.getColor()}];
    }

    public legendHighlight (d: LegendItem): void {
        if (this._useCanvas) {
            this._plotOnCanvas(d); // Supply legend datum to plotOnCanvas
        } else {
            this._resizeSymbolsWhere(s => s.attr('fill') === d.color, this._highlightedSize);
            this.chartBodyG().selectAll('.chart-body path.symbol').filter(function () {
                return select(this).attr('fill') !== d.color;
            }).classed('fadeout', true);
        }
    }

    public legendReset (d: LegendItem): void {
        if (this._useCanvas) {
            this._plotOnCanvas(d); // Supply legend datum to plotOnCanvas
        } else {
            this._resizeSymbolsWhere(s => s.attr('fill') === d.color, this._symbolSize);
            this.chartBodyG().selectAll('.chart-body path.symbol').filter(function () {
                return select(this).attr('fill') !== d.color;
            }).classed('fadeout', false);
        }
    }

    private _resizeSymbolsWhere (condition, size): void {
        const symbols = this.chartBodyG().selectAll('.chart-body path.symbol').filter(function () {
            return condition(select(this));
        });
        const oldSize = this._symbol.size();
        this._symbol.size(Math.pow(size, 2));
        transition(symbols, this._conf.transitionDuration, this._conf.transitionDelay).attr('d', this._symbol);
        this._symbol.size(oldSize);
    }

    public createBrushHandlePaths (): void {
        // no handle paths for poly-brushes
    }

    public extendBrush (brushSelection) {
        if (this.round()) {
            brushSelection[0] = brushSelection[0].map(this.round());
            brushSelection[1] = brushSelection[1].map(this.round());
        }
        return brushSelection;
    }

    public brushIsEmpty (brushSelection) {
        return !brushSelection || brushSelection[0][0] >= brushSelection[1][0] || brushSelection[0][1] >= brushSelection[1][1];
    }

    public _brushing () {
        // Avoids infinite recursion (mutual recursion between range and focus operations)
        // Source Event will be null when brush.move is called programmatically (see below as well).
        if (!event.sourceEvent) {
            return;
        }

        // Ignore event if recursive event - i.e. not directly generated by user action (like mouse/touch etc.)
        // In this case we are more worried about this handler causing brush move programmatically which will
        // cause this handler to be invoked again with a new d3.event (and current event set as sourceEvent)
        // This check avoids recursive calls
        if (event.sourceEvent.type && ['start', 'brush', 'end'].indexOf(event.sourceEvent.type) !== -1) {
            return;
        }

        let brushSelection = event.selection;

        // TODO: data type of brush selection changes after scale.invert, need to introduce one more variable

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

    public redrawBrush (brushSelection, doTransition) {
        // override default x axis brush from parent chart
        const brush1 = this.brush(); // TODO: figure out why the linter complained about shadowing with name `brush`
        const gBrush = this.gBrush();

        if (this.brushOn() && gBrush) {
            if (this.resizing()) {
                this.setBrushExtents(doTransition);
            }

            if (!brushSelection) {
                gBrush
                    .call(brush1.move, brushSelection);

            } else {
                brushSelection = brushSelection.map(point => point.map((coord, i) => {
                    const scale = i === 0 ? this.x() : this.y();
                    return scale(coord);
                }));

                const gBrushWithTransition =
                    optionalTransition(doTransition, this._conf.transitionDuration, this._conf.transitionDelay)(gBrush);

                gBrushWithTransition
                    .call(brush1.move, brushSelection);

            }
        }

        this.fadeDeselectedArea(brushSelection);
    }

    public setBrushY (gBrush): void {
        gBrush.call(this.brush().y(this.y()));
    }
}
