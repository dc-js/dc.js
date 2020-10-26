import { symbol, Symbol, SymbolType } from 'd3-shape';
import { select, Selection } from 'd3-selection';
import { brush } from 'd3-brush';

import { CoordinateGridMixin } from '../base/coordinate-grid-mixin';
import { optionalTransition, transition } from '../core/core';
import { RangedTwoDimensionalFilter } from '../core/filters';
import { constants } from '../core/constants';
import { events } from '../core/events';
import { ChartGroupType, ChartParentType, LegendItem } from '../core/types';
import { IScatterPlotConf } from './i-scatter-plot-conf';

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
    public _conf: IScatterPlotConf;

    private _symbol: Symbol<any, any>;
    private _filtered;
    private _canvas: Selection<HTMLCanvasElement, any, any, any>;
    private _context: CanvasRenderingContext2D;

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
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super();

        const originalKeyAccessor = this._conf.keyAccessor;

        this.configure({
            keyAccessor: d => originalKeyAccessor(d)[0],
            colorAccessor: () => this._conf.groupName,
            existenceAccessor: d => d.value,
            // see https://github.com/dc-js/dc.js/issues/702
            title: d =>
                `${this._conf.keyAccessor(d)},${d._value}: ${this._conf.existenceAccessor(d)}`,
            highlightedSize: 7,
            symbolSize: 5,
            excludedSize: 3,
            excludedColor: null,
            excludedOpacity: 1.0,
            emptySize: 0,
            emptyOpacity: 0,
            nonemptyOpacity: 1,
            emptyColor: null,
            useCanvas: false,
        });

        this.dataProvider().configure({
            valueAccessor: d => originalKeyAccessor(d)[1],
        });

        this._symbol = symbol();

        this._filtered = [];
        this._canvas = null;
        this._context = null;

        // Use a 2 dimensional brush
        this.brush(brush());

        this._symbol.size((d, i) => this._elementSize(d, i));

        this.anchor(parent, chartGroup);
    }

    public configure(conf: IScatterPlotConf): this {
        super.configure(conf);
        return this;
    }

    public conf(): IScatterPlotConf {
        return this._conf;
    }

    // Calculates element radius for canvas plot to be comparable to D3 area based symbol sizes
    private _canvasElementSize(d, isFiltered): number {
        if (!this._conf.existenceAccessor(d)) {
            return this._conf.emptySize / Math.sqrt(Math.PI);
        } else if (isFiltered) {
            return this._conf.symbolSize / Math.sqrt(Math.PI);
        } else {
            return this._conf.excludedSize / Math.sqrt(Math.PI);
        }
    }

    private _elementSize(d, i): number {
        if (!this._conf.existenceAccessor(d)) {
            return Math.pow(this._conf.emptySize, 2);
        } else if (this._filtered[i]) {
            return Math.pow(this._conf.symbolSize, 2);
        } else {
            return Math.pow(this._conf.excludedSize, 2);
        }
    }

    private _locator(d): string {
        return `translate(${this.x()(this._conf.keyAccessor(d))},${this.y()(d._value)})`;
    }

    public filter();
    public filter(filter): this;
    public filter(filter?) {
        if (!arguments.length) {
            return super.filter();
        }

        if (filter === null) {
            return super.filter(null);
        }
        return super.filter(new RangedTwoDimensionalFilter(filter));
    }

    /**
     * Method that replaces original resetSvg and appropriately inserts canvas
     * element along with svg element and sets their CSS properties appropriately
     * so they are overlapped on top of each other.
     * Remove the chart's SVGElements from the dom and recreate the container SVGElement.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/SVGElement SVGElement}
     * @returns {SVGElement}
     */
    public resetSvg() {
        if (!this._conf.useCanvas) {
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
            const svgLeft = isNaN(parseInt(svgSel.style('left'), 10))
                ? 0
                : parseInt(svgSel.style('left'), 10);
            const svgTop = isNaN(parseInt(svgSel.style('top'), 10))
                ? 0
                : parseInt(svgSel.style('top'), 10);
            const width = this.effectiveWidth();
            const height = this.effectiveHeight();
            const margins = this.margins(); // {top: 10, right: 130, bottom: 42, left: 42}

            // Add the canvas element such that it perfectly overlaps the plot area of the scatter plot SVG
            const devicePixelRatio = window.devicePixelRatio || 1;
            this._canvas = this.root()
                .append('canvas')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', width * devicePixelRatio)
                .attr('height', height * devicePixelRatio)
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

    public _resizeCanvas() {
        const width = this.effectiveWidth();
        const height = this.effectiveHeight();

        const devicePixelRatio = window.devicePixelRatio || 1;
        this._canvas
            .attr('width', width * devicePixelRatio)
            .attr('height', height * devicePixelRatio)
            .style('width', `${width}px`)
            .style('height', `${height}px`);
        this._context.scale(devicePixelRatio, devicePixelRatio);
    }

    /**
     * Set or get canvas element. You should usually only ever use the get method as
     * dc.js will handle canvas element generation.  Provides valid canvas only when
     * {@link ScatterPlot#useCanvas useCanvas} is set to `true`
     * @param {CanvasElement|d3.selection} [canvasElement]
     * @return {CanvasElement|d3.selection}
     */
    public canvas(): Selection<HTMLCanvasElement, any, any, any>;
    public canvas(canvasElement: Selection<HTMLCanvasElement, any, any, any>): this;
    public canvas(canvasElement?) {
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
    public context(): CanvasRenderingContext2D {
        return this._context;
    }

    /*eslint complexity: [2,11] */
    // Plots data on canvas element. If argument provided, assumes legend is
    // currently being highlighted and modifies opacity/size of symbols accordingly
    // @param {Object} [legendHighlightDatum] - Datum provided to legendHighlight method
    private _plotOnCanvas(legendHighlightDatum?) {
        this._resizeCanvas();
        const context = this.context();
        context.clearRect(0, 0, context.canvas.width + 2, context.canvas.height + 2);
        const data = this.data();

        // Draw the data on canvas
        data.forEach((d, i) => {
            const isFiltered = !this.filter() || this.filter().isFiltered([d.key[0], d.key[1]]);
            // Calculate opacity for current data point
            let cOpacity: number = 1;
            if (!this._conf.existenceAccessor(d)) {
                cOpacity = this._conf.emptyOpacity;
            } else if (isFiltered) {
                cOpacity = this._conf.nonemptyOpacity;
            } else {
                cOpacity = this._conf.excludedOpacity;
            }
            // Calculate color for current data point
            let cColor: string = null;
            if (this._conf.emptyColor && !this._conf.existenceAccessor(d)) {
                cColor = this._conf.emptyColor;
            } else if (this._conf.excludedColor && !isFiltered) {
                cColor = this._conf.excludedColor;
            } else {
                cColor = this.getColor(d);
            }

            let cSize: number = this._canvasElementSize(d, isFiltered);

            // Adjust params for data points if legend is highlighted
            if (legendHighlightDatum) {
                const isHighlighted = cColor === legendHighlightDatum.color;
                // Calculate opacity for current data point
                const fadeOutOpacity = 0.1; // TODO: Make this programmatically settable
                if (!isHighlighted) {
                    // Fade out non-highlighted colors + highlighted colors outside filter
                    cOpacity = fadeOutOpacity;
                }
                if (isHighlighted) {
                    // Set size for highlighted color data points
                    cSize = this._conf.highlightedSize / Math.sqrt(Math.PI);
                }
            }

            // Draw point on canvas
            context.save();
            context.globalAlpha = cOpacity;
            context.beginPath();
            context.arc(
                this.x()(this._conf.keyAccessor(d)),
                this.y()(d._value),
                cSize,
                0,
                2 * Math.PI,
                true
            );
            context.fillStyle = cColor;
            context.fill();
            // context.lineWidth = 0.5; // Commented out code to add stroke around scatter points if desired
            // context.strokeStyle = '#333';
            // context.stroke();
            context.restore();
        });
    }

    private _plotOnSVG(): void {
        // TODO: come back after fixing the type for this.chartBodyG()
        let symbols = (this.chartBodyG() as Selection<SVGGElement, any, any, any>)
            .selectAll<SVGPathElement, any>('path.symbol')
            .data<any>(this.data());

        transition(symbols.exit(), this._conf.transitionDuration, this._conf.transitionDelay)
            .attr('opacity', 0)
            .remove();

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
            this._filtered[i] =
                !this.filter() || this.filter().isFiltered([this._conf.keyAccessor(d), d._value]);
        });

        transition(symbols, this._conf.transitionDuration, this._conf.transitionDelay)
            .attr('opacity', (d, i) => {
                if (!this._conf.existenceAccessor(d)) {
                    return this._conf.emptyOpacity;
                } else if (this._filtered[i]) {
                    return this._conf.nonemptyOpacity;
                } else {
                    return this._conf.excludedOpacity;
                }
            })
            .attr('fill', (d, i) => {
                if (this._conf.emptyColor && !this._conf.existenceAccessor(d)) {
                    return this._conf.emptyColor;
                } else if (this._conf.excludedColor && !this._filtered[i]) {
                    return this._conf.excludedColor;
                } else {
                    return this.getColor(d);
                }
            })
            .attr('transform', d => this._locator(d))
            .attr('d', this._symbol);
    }

    public plotData(): void {
        if (this._conf.useCanvas) {
            this._plotOnCanvas();
        } else {
            this._plotOnSVG();
        }
    }

    private _renderTitles(_symbol: Selection<SVGPathElement, any, SVGGElement, any>, _d): void {
        if (this._conf.renderTitle) {
            _symbol.selectAll('title').remove();
            _symbol.append('title').text(d => this._conf.title(d));
        }
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
    public symbol(): SymbolTypeGenerator;
    public symbol(type: SymbolTypeGenerator): this;
    public symbol(type?) {
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
    public customSymbol(): Symbol<any, any>;
    public customSymbol(customSymbol: Symbol<any, any>): this;
    public customSymbol(customSymbol?) {
        if (!arguments.length) {
            return this._symbol;
        }
        this._symbol = customSymbol;
        this._symbol.size((d, i) => this._elementSize(d, i));
        return this;
    }

    public legendables(): LegendItem[] {
        // Argument to getColor is ignored by the default color accessor for this chart
        return [
            { chart: this, name: this._conf.groupName, color: this.getColor(this._conf.groupName) },
        ];
    }

    public legendHighlight(d: LegendItem): void {
        if (this._conf.useCanvas) {
            this._plotOnCanvas(d); // Supply legend datum to plotOnCanvas
        } else {
            this._resizeSymbolsWhere(s => s.attr('fill') === d.color, this._conf.highlightedSize);
            this.chartBodyG()
                .selectAll('.chart-body path.symbol')
                .filter(function () {
                    return select(this).attr('fill') !== d.color;
                })
                .classed('fadeout', true);
        }
    }

    public legendReset(d: LegendItem): void {
        if (this._conf.useCanvas) {
            this._plotOnCanvas(d); // Supply legend datum to plotOnCanvas
        } else {
            this._resizeSymbolsWhere(s => s.attr('fill') === d.color, this._conf.symbolSize);
            this.chartBodyG()
                .selectAll('.chart-body path.symbol')
                .filter(function () {
                    return select(this).attr('fill') !== d.color;
                })
                .classed('fadeout', false);
        }
    }

    private _resizeSymbolsWhere(condition, size): void {
        const symbols = this.chartBodyG()
            .selectAll('.chart-body path.symbol')
            .filter(function () {
                return condition(select(this));
            });
        const oldSize = this._symbol.size();
        this._symbol.size(Math.pow(size, 2));
        transition(symbols, this._conf.transitionDuration, this._conf.transitionDelay).attr(
            'd',
            this._symbol
        );
        this._symbol.size(oldSize);
    }

    public createBrushHandlePaths(): void {
        // no handle paths for poly-brushes
    }

    public extendBrush(brushSelection) {
        if (this._conf.round) {
            brushSelection[0] = brushSelection[0].map(this._conf.round);
            brushSelection[1] = brushSelection[1].map(this._conf.round);
        }
        return brushSelection;
    }

    public brushIsEmpty(brushSelection) {
        return (
            !brushSelection ||
            brushSelection[0][0] >= brushSelection[1][0] ||
            brushSelection[0][1] >= brushSelection[1][1]
        );
    }

    public _brushing(evt) {
        if (this._ignoreBrushEvents) {
            return;
        }

        let brushSelection = evt.selection;

        // TODO: data type of brush selection changes after scale.invert, need to introduce one more variable

        // Testing with pixels is more reliable
        let brushIsEmpty = this.brushIsEmpty(brushSelection);

        if (brushSelection) {
            brushSelection = brushSelection.map(point =>
                point.map((coord, i) => {
                    const scale = i === 0 ? this.x() : this.y();
                    return scale.invert(coord);
                })
            );

            brushSelection = this.extendBrush(brushSelection);

            // The rounding process might have made brushSelection empty, so we need to recheck
            brushIsEmpty = brushIsEmpty && this.brushIsEmpty(brushSelection);
        }

        this.redrawBrush(brushSelection, false);

        const ranged2DFilter = brushIsEmpty
            ? null
            : new RangedTwoDimensionalFilter(brushSelection);

        events.trigger(() => {
            this.replaceFilter(ranged2DFilter);
            this.redrawGroup();
        }, constants.EVENT_DELAY);
    }

    public redrawBrush(brushSelection, doTransition) {
        // override default x axis brush from parent chart
        const gBrush = this.gBrush();

        if (this.brushOn() && gBrush) {
            if (this.resizing()) {
                this.setBrushExtents(doTransition);
            }

            if (!brushSelection) {
                this._withoutBrushEvents(() => {
                    gBrush.call(this.brush().move, brushSelection);
                });
            } else {
                brushSelection = brushSelection.map(point =>
                    point.map((coord, i) => {
                        const scale = i === 0 ? this.x() : this.y();
                        return scale(coord);
                    })
                );

                const gBrushWithTransition = optionalTransition(
                    doTransition,
                    this._conf.transitionDuration,
                    this._conf.transitionDelay
                )(gBrush);

                this._withoutBrushEvents(() => {
                    gBrushWithTransition.call(this.brush().move, brushSelection);
                });
            }
        }

        this.fadeDeselectedArea(brushSelection);
    }
}
