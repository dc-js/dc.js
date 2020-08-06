import {ascending} from 'd3-array';
import {scaleBand} from 'd3-scale';

import {transition} from '../core/core';
import {logger} from '../core/logger';
import {filters} from '../core/filters';
import {events} from '../core/events';
import {ColorMixin} from '../base/color-mixin';
import {MarginMixin} from '../base/margin-mixin';
import {BaseAccessor, ChartGroupType, ChartParentType, CompareFn, MinimalXYScale} from '../core/types';
import {Selection} from 'd3-selection';

const DEFAULT_BORDER_RADIUS = 6.75;

type ClickHandler = (d: any) => void;

/**
 * A heat map is matrix that represents the values of two dimensions of data using colors.
 * @mixes ColorMixin
 * @mixes MarginMixin
 * @mixes BaseMixin
 */
export class HeatMap extends ColorMixin(MarginMixin) {
    private _chartBody: Selection<SVGGElement, any, SVGElement, any>;
    private _cols;
    private _rows;
    private _colOrdering: CompareFn;
    private _rowOrdering: CompareFn;
    private _colScale: MinimalXYScale;
    private _rowScale: MinimalXYScale;
    private _xBorderRadius: number;
    private _yBorderRadius: number;
    private _colsLabel: BaseAccessor<any>;
    private _rowsLabel: BaseAccessor<any>;
    private _xAxisOnClick: ClickHandler;
    private _yAxisOnClick: ClickHandler;
    private _boxOnClick: ClickHandler;

    /**
     * Create a Heat Map
     * @example
     * // create a heat map under #chart-container1 element using the default global chart group
     * var heatMap1 = new HeatMap('#chart-container1');
     * // create a heat map under #chart-container2 element using chart group A
     * var heatMap2 = new HeatMap('#chart-container2', 'chartGroupA');
     * @param {String|node|d3.selection} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super();

        this._chartBody = undefined;

        this._cols = undefined;
        this._rows = undefined;
        this._colOrdering = ascending;
        this._rowOrdering = ascending;
        this._colScale = scaleBand();
        this._rowScale = scaleBand();

        this._xBorderRadius = DEFAULT_BORDER_RADIUS;
        this._yBorderRadius = DEFAULT_BORDER_RADIUS;

        this._mandatoryAttributes(['group']);
        this.title(this.colorAccessor());

        this._colsLabel = d => d;
        this._rowsLabel = d => d;

        this._xAxisOnClick = d => {
            this._filterAxis(0, d);
        };
        this._yAxisOnClick = d => {
            this._filterAxis(1, d);
        };
        this._boxOnClick = d => {
            const filter = d.key;
            events.trigger(() => {
                this.filter(filters.TwoDimensionalFilter(filter));
                this.redrawGroup();
            });
        };

        this.anchor(parent, chartGroup);
    }

    /**
     * Set or get the column label function. The chart class uses this function to render
     * column labels on the X axis. It is passed the column name.
     * @example
     * // the default label function just returns the name
     * chart.colsLabel(function(d) { return d; });
     * @param  {Function} [labelFunction=function(d) { return d; }]
     * @returns {Function|HeatMap}
     */
    public colsLabel (): BaseAccessor<any>;
    public colsLabel (labelFunction: BaseAccessor<any>): this;
    public colsLabel (labelFunction?) {
        if (!arguments.length) {
            return this._colsLabel;
        }
        this._colsLabel = labelFunction;
        return this;
    }

    /**
     * Set or get the row label function. The chart class uses this function to render
     * row labels on the Y axis. It is passed the row name.
     * @example
     * // the default label function just returns the name
     * chart.rowsLabel(function(d) { return d; });
     * @param  {Function} [labelFunction=function(d) { return d; }]
     * @returns {Function|HeatMap}
     */
    public rowsLabel (): BaseAccessor<any>;
    public rowsLabel (labelFunction: BaseAccessor<any>): this;
    public rowsLabel (labelFunction?) {
        if (!arguments.length) {
            return this._rowsLabel;
        }
        this._rowsLabel = labelFunction;
        return this;
    }

    public _filterAxis (axis: number, value): void {
        const cellsOnAxis = this.selectAll<SVGElement, any>('.box-group').filter(d => d.key[axis] === value);

        const unfilteredCellsOnAxis = cellsOnAxis.filter(d => !this.hasFilter(d.key));

        events.trigger(() => {
            const selection = unfilteredCellsOnAxis.empty() ? cellsOnAxis : unfilteredCellsOnAxis;
            const filtersList = selection.data().map(kv => filters.TwoDimensionalFilter(kv.key));
            this.filter([filtersList]);
            this.redrawGroup();
        });
    }

    public filter ();
    public filter (filter): this;
    public filter (filter?) {
        const nonstandardFilter = f => {
            logger.warnOnce('heatmap.filter taking a coordinate is deprecated - please pass dc.filters.TwoDimensionalFilter instead');
            return this.filter(filters.TwoDimensionalFilter(f));
        };

        if (!arguments.length) {
            return super.filter();
        }
        if (filter !== null && filter.filterType !== 'TwoDimensionalFilter' &&
            !(Array.isArray(filter) && Array.isArray(filter[0]) && filter[0][0].filterType === 'TwoDimensionalFilter')) {
            return nonstandardFilter(filter);
        }
        return super.filter(filter);
    }

    /**
     * Gets or sets the values used to create the rows of the heatmap, as an array. By default, all
     * the values will be fetched from the data using the value accessor.
     * @param  {Array<String|Number>} [rows]
     * @returns {Array<String|Number>|HeatMap}
     */

    public rows ();
    public rows (rows): this;
    public rows (rows?) {
        if (!arguments.length) {
            return this._rows;
        }
        this._rows = rows;
        return this;
    }

    /**
     * Get or set a comparator to order the rows.
     * Default is {@link https://github.com/d3/d3-array#ascending d3.ascending}.
     * @param  {Function} [rowOrdering]
     * @returns {Function|HeatMap}
     */
    public rowOrdering (): CompareFn;
    public rowOrdering (rowOrdering: CompareFn): this;
    public rowOrdering (rowOrdering?) {
        if (!arguments.length) {
            return this._rowOrdering;
        }
        this._rowOrdering = rowOrdering;
        return this;
    }

    /**
     * Gets or sets the keys used to create the columns of the heatmap, as an array. By default, all
     * the values will be fetched from the data using the key accessor.
     * @param  {Array<String|Number>} [cols]
     * @returns {Array<String|Number>|HeatMap}
     */
    public cols ();
    public cols (cols): this;
    public cols (cols?) {
        if (!arguments.length) {
            return this._cols;
        }
        this._cols = cols;
        return this;
    }

    /**
     * Get or set a comparator to order the columns.
     * Default is  {@link https://github.com/d3/d3-array#ascending d3.ascending}.
     * @param  {Function} [colOrdering]
     * @returns {Function|HeatMap}
     */
    public colOrdering (): CompareFn;
    public colOrdering (colOrdering: CompareFn): this;
    public colOrdering (colOrdering?) {
        if (!arguments.length) {
            return this._colOrdering;
        }
        this._colOrdering = colOrdering;
        return this;
    }

    public _doRender (): this {
        this.resetSvg();

        this._chartBody = this.svg()
            .append('g')
            .attr('class', 'heatmap')
            .attr('transform', `translate(${this.margins().left},${this.margins().top})`);

        return this._doRedraw();
    }

    public _doRedraw () {
        const data = this.data();
        let rows = this.rows() || data.map(this._conf.valueAccessor);
        let cols = this.cols() || data.map(this._conf.keyAccessor);

        if (this._rowOrdering) {
            rows = rows.sort(this._rowOrdering);
        }
        if (this._colOrdering) {
            cols = cols.sort(this._colOrdering);
        }
        rows = this._rowScale.domain(rows);
        cols = this._colScale.domain(cols);

        const rowCount = rows.domain().length;
        const colCount = cols.domain().length;
        const boxWidth = Math.floor(this.effectiveWidth() / colCount);
        const boxHeight = Math.floor(this.effectiveHeight() / rowCount);

        cols.rangeRound([0, this.effectiveWidth()]);
        rows.rangeRound([this.effectiveHeight(), 0]);

        let boxes: Selection<SVGGElement, unknown, SVGGElement, any> = this._chartBody
            .selectAll<SVGGElement, any>('g.box-group')
            .data(this.data(), (d, i) => `${this._conf.keyAccessor(d, i)}\0${this._conf.valueAccessor(d, i)}`);

        boxes.exit().remove();

        const gEnter = boxes.enter().append('g')
            .attr('class', 'box-group');

        gEnter.append('rect')
            .attr('class', 'heat-box')
            .attr('fill', 'white')
            .attr('x', (d, i) => cols(this._conf.keyAccessor(d, i)))
            .attr('y', (d, i) => rows(this._conf.valueAccessor(d, i)))
            .on('click', this.boxOnClick());

        boxes = gEnter.merge(boxes);

        if (this._conf.renderTitle) {
            gEnter.append('title');
            boxes.select('title').text(this.title());
        }

        transition(boxes.select('rect'), this._conf.transitionDuration, this._conf.transitionDelay)
            .attr('x', (d, i) => cols(this._conf.keyAccessor(d, i)))
            .attr('y', (d, i) => rows(this._conf.valueAccessor(d, i)))
            .attr('rx', this._xBorderRadius)
            .attr('ry', this._yBorderRadius)
            .attr('fill', (d, i) => this.getColor(d, i))
            .attr('width', boxWidth)
            .attr('height', boxHeight);

        let gCols = this._chartBody.select<SVGGElement>('g.cols');
        if (gCols.empty()) {
            gCols = this._chartBody.append('g').attr('class', 'cols axis');
        }
        let gColsText = gCols.selectAll<SVGTextElement, any>('text').data(cols.domain());

        gColsText.exit().remove();

        gColsText = gColsText
            .enter()
            .append('text')
            .attr('x', d => cols(d) + boxWidth / 2)
            .style('text-anchor', 'middle')
            .attr('y', this.effectiveHeight())
            .attr('dy', 12)
            .on('click', this.xAxisOnClick())
            .text(this.colsLabel())
            .merge(gColsText);

        transition(gColsText, this._conf.transitionDuration, this._conf.transitionDelay)
            .text(this.colsLabel())
            .attr('x', d => cols(d) + boxWidth / 2)
            .attr('y', this.effectiveHeight());

        let gRows = this._chartBody.select<SVGGElement>('g.rows');
        if (gRows.empty()) {
            gRows = this._chartBody.append('g').attr('class', 'rows axis');
        }

        let gRowsText = gRows.selectAll<SVGTextElement, any>('text').data(rows.domain());

        gRowsText.exit().remove();

        gRowsText = gRowsText
            .enter()
            .append('text')
            .style('text-anchor', 'end')
            .attr('x', 0)
            .attr('dx', -2)
            .attr('y', d => rows(d) + boxHeight / 2)
            .attr('dy', 6)
            .on('click', this.yAxisOnClick())
            .text(this.rowsLabel())
            .merge(gRowsText);

        transition(gRowsText, this._conf.transitionDuration, this._conf.transitionDelay)
            .text(this.rowsLabel())
            .attr('y', d => rows(d) + boxHeight / 2);

        if (this.hasFilter()) {
            const chart = this;
            this.selectAll('g.box-group').each(function (d) {
                if (chart.isSelectedNode(d)) {
                    chart.highlightSelected(this);
                } else {
                    chart.fadeDeselected(this);
                }
            });
        } else {
            const chart = this;
            this.selectAll('g.box-group').each(function () {
                chart.resetHighlight(this);
            });
        }
        return this;
    }

    /**
     * Gets or sets the handler that fires when an individual cell is clicked in the heatmap.
     * By default, filtering of the cell will be toggled.
     * @example
     * // default box on click handler
     * chart.boxOnClick(function (d) {
     *     var filter = d.key;
     *     events.trigger(function () {
     *         _chart.filter(filter);
     *         _chart.redrawGroup();
     *     });
     * });
     * @param  {Function} [handler]
     * @returns {Function|HeatMap}
     */
    public boxOnClick (): ClickHandler;
    public boxOnClick (handler: ClickHandler): this;
    public boxOnClick (handler?) {
        if (!arguments.length) {
            return this._boxOnClick;
        }
        this._boxOnClick = handler;
        return this;
    }

    /**
     * Gets or sets the handler that fires when a column tick is clicked in the x axis.
     * By default, if any cells in the column are unselected, the whole column will be selected,
     * otherwise the whole column will be unselected.
     * @param  {Function} [handler]
     * @returns {Function|HeatMap}
     */
    public xAxisOnClick (): ClickHandler;
    public xAxisOnClick (handler: ClickHandler): this;
    public xAxisOnClick (handler?) {
        if (!arguments.length) {
            return this._xAxisOnClick;
        }
        this._xAxisOnClick = handler;
        return this;
    }

    /**
     * Gets or sets the handler that fires when a row tick is clicked in the y axis.
     * By default, if any cells in the row are unselected, the whole row will be selected,
     * otherwise the whole row will be unselected.
     * @param  {Function} [handler]
     * @returns {Function|HeatMap}
     */
    public yAxisOnClick (): ClickHandler;
    public yAxisOnClick (handler: ClickHandler): this;
    public yAxisOnClick (handler?) {
        if (!arguments.length) {
            return this._yAxisOnClick;
        }
        this._yAxisOnClick = handler;
        return this;
    }

    /**
     * Gets or sets the X border radius.  Set to 0 to get full rectangles.
     * @param  {Number} [xBorderRadius=6.75]
     * @returns {Number|HeatMap}
     */
    public xBorderRadius (): number;
    public xBorderRadius (xBorderRadius: number): this;
    public xBorderRadius (xBorderRadius?) {
        if (!arguments.length) {
            return this._xBorderRadius;
        }
        this._xBorderRadius = xBorderRadius;
        return this;
    }

    /**
     * Gets or sets the Y border radius.  Set to 0 to get full rectangles.
     * @param  {Number} [yBorderRadius=6.75]
     * @returns {Number|HeatMap}
     */
    public yBorderRadius (): number;
    public yBorderRadius (yBorderRadius: number): this;
    public yBorderRadius (yBorderRadius?) {
        if (!arguments.length) {
            return this._yBorderRadius;
        }
        this._yBorderRadius = yBorderRadius;
        return this;
    }

    public isSelectedNode (d): boolean {
        return this.hasFilter(d.key);
    }
}
