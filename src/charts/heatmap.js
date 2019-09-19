import * as d3 from 'd3';

import {transition} from '../core/core';
import {logger} from '../core/logger';
import {filters} from '../core/filters';
import {events} from '../core/events';
import {ColorMixin} from '../base/color-mixin';
import {MarginMixin} from '../base/margin-mixin';
import {BaseMixin} from '../base/base-mixin';

const DEFAULT_BORDER_RADIUS = 6.75;

/**
 * A heat map is matrix that represents the values of two dimensions of data using colors.
 * @class heatMap
 * @memberof dc
 * @mixes dc.colorMixin
 * @mixes dc.marginMixin
 * @mixes dc.baseMixin
 * @example
 * // create a heat map under #chart-container1 element using the default global chart group
 * var heatMap1 = dc.heatMap('#chart-container1');
 * // create a heat map under #chart-container2 element using chart group A
 * var heatMap2 = dc.heatMap('#chart-container2', 'chartGroupA');
 * @param {String|node|d3.selection} parent - Any valid
 * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.heatMap}
 */
export class HeatMap extends ColorMixin(MarginMixin(BaseMixin)) {
    constructor (parent, chartGroup) {
        super();

        this._chartBody = undefined;

        this._cols = undefined;
        this._rows = undefined;
        this._colOrdering = d3.ascending;
        this._rowOrdering = d3.ascending;
        this._colScale = d3.scaleBand();
        this._rowScale = d3.scaleBand();

        this._xBorderRadius = DEFAULT_BORDER_RADIUS;
        this._yBorderRadius = DEFAULT_BORDER_RADIUS;

        this._mandatoryAttributes(['group']);
        this.title(this.colorAccessor());

        this._colsLabel = d => d;
        this._rowsLabel = d => d;

        // ES6: revisit after converting mixins
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
     * @method colsLabel
     * @memberof dc.heatMap
     * @instance
     * @example
     * // the default label function just returns the name
     * chart.colsLabel(function(d) { return d; });
     * @param  {Function} [labelFunction=function(d) { return d; }]
     * @returns {Function|dc.heatMap}
     */
    colsLabel (labelFunction) {
        if (!arguments.length) {
            return this._colsLabel;
        }
        this._colsLabel = labelFunction;
        return this;
    }

    /**
     * Set or get the row label function. The chart class uses this function to render
     * row labels on the Y axis. It is passed the row name.
     * @method rowsLabel
     * @memberof dc.heatMap
     * @instance
     * @example
     * // the default label function just returns the name
     * chart.rowsLabel(function(d) { return d; });
     * @param  {Function} [labelFunction=function(d) { return d; }]
     * @returns {Function|dc.heatMap}
     */
    rowsLabel (labelFunction) {
        if (!arguments.length) {
            return this._rowsLabel;
        }
        this._rowsLabel = labelFunction;
        return this;
    }

    _filterAxis (axis, value) {
        const cellsOnAxis = this.selectAll('.box-group').filter(d => d.key[axis] === value);
        const unfilteredCellsOnAxis = cellsOnAxis.filter(d => !this.hasFilter(d.key));
        events.trigger(() => {
            const selection = unfilteredCellsOnAxis.empty() ? cellsOnAxis : unfilteredCellsOnAxis;
            const filtersList = selection.data().map(kv => filters.TwoDimensionalFilter(kv.key));
            this.filter([filtersList]);
            this.redrawGroup();
        });
    }

    filter (filter) {
        const nonstandardFilter = logger.deprecate(
            filter => this._filter(filters.TwoDimensionalFilter(filter)),
            'heatmap.filter taking a coordinate is deprecated - please pass dc.filters.TwoDimensionalFilter instead');

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
     * @method rows
     * @memberof dc.heatMap
     * @instance
     * @param  {Array<String|Number>} [rows]
     * @returns {Array<String|Number>|dc.heatMap}
     */

    rows (rows) {
        if (!arguments.length) {
            return this._rows;
        }
        this._rows = rows;
        return this;
    }

    /**
     * Get or set a comparator to order the rows.
     * Default is {@link https://github.com/d3/d3-array#ascending d3.ascending}.
     * @method rowOrdering
     * @memberof dc.heatMap
     * @instance
     * @param  {Function} [rowOrdering]
     * @returns {Function|dc.heatMap}
     */
    rowOrdering (rowOrdering) {
        if (!arguments.length) {
            return this._rowOrdering;
        }
        this._rowOrdering = rowOrdering;
        return this;
    }

    /**
     * Gets or sets the keys used to create the columns of the heatmap, as an array. By default, all
     * the values will be fetched from the data using the key accessor.
     * @method cols
     * @memberof dc.heatMap
     * @instance
     * @param  {Array<String|Number>} [cols]
     * @returns {Array<String|Number>|dc.heatMap}
     */
    cols (cols) {
        if (!arguments.length) {
            return this._cols;
        }
        this._cols = cols;
        return this;
    }

    /**
     * Get or set a comparator to order the columns.
     * Default is  {@link https://github.com/d3/d3-array#ascending d3.ascending}.
     * @method colOrdering
     * @memberof dc.heatMap
     * @instance
     * @param  {Function} [colOrdering]
     * @returns {Function|dc.heatMap}
     */
    colOrdering (colOrdering) {
        if (!arguments.length) {
            return this._colOrdering;
        }
        this._colOrdering = colOrdering;
        return this;
    }

    _doRender () {
        this.resetSvg();

        this._chartBody = this.svg()
            .append('g')
            .attr('class', 'heatmap')
            .attr('transform', 'translate(' + this.margins().left + ',' + this.margins().top + ')');

        return this._doRedraw();
    }

    _doRedraw () {
        const data = this.data();
        let rows = this.rows() || data.map(this.valueAccessor()),
            cols = this.cols() || data.map(this.keyAccessor());
        if (this._rowOrdering) {
            rows = rows.sort(this._rowOrdering);
        }
        if (this._colOrdering) {
            cols = cols.sort(this._colOrdering);
        }
        rows = this._rowScale.domain(rows);
        cols = this._colScale.domain(cols);

        const rowCount = rows.domain().length,
            colCount = cols.domain().length,
            boxWidth = Math.floor(this.effectiveWidth() / colCount),
            boxHeight = Math.floor(this.effectiveHeight() / rowCount);

        cols.rangeRound([0, this.effectiveWidth()]);
        rows.rangeRound([this.effectiveHeight(), 0]);

        let boxes = this._chartBody.selectAll('g.box-group').data(this.data(),
                                                                  (d, i) => this.keyAccessor()(d, i) + '\0' + this.valueAccessor()(d, i));

        boxes.exit().remove();

        const gEnter = boxes.enter().append('g')
            .attr('class', 'box-group');

        gEnter.append('rect')
            .attr('class', 'heat-box')
            .attr('fill', 'white')
            .attr('x', (d, i) => cols(this.keyAccessor()(d, i)))
            .attr('y', (d, i) => rows(this.valueAccessor()(d, i)))
            .on('click', this.boxOnClick());

        boxes = gEnter.merge(boxes);

        if (this.renderTitle()) {
            gEnter.append('title');
            boxes.select('title').text(this.title());
        }

        transition(boxes.select('rect'), this.transitionDuration(), this.transitionDelay())
            .attr('x', (d, i) => cols(this.keyAccessor()(d, i)))
            .attr('y', (d, i) => rows(this.valueAccessor()(d, i)))
            .attr('rx', this._xBorderRadius)
            .attr('ry', this._yBorderRadius)
            .attr('fill', this.getColor)
            .attr('width', boxWidth)
            .attr('height', boxHeight);

        let gCols = this._chartBody.select('g.cols');
        if (gCols.empty()) {
            gCols = this._chartBody.append('g').attr('class', 'cols axis');
        }
        let gColsText = gCols.selectAll('text').data(cols.domain());

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

        transition(gColsText, this.transitionDuration(), this.transitionDelay())
            .text(this.colsLabel())
            .attr('x', d => cols(d) + boxWidth / 2)
            .attr('y', this.effectiveHeight());

        let gRows = this._chartBody.select('g.rows');
        if (gRows.empty()) {
            gRows = this._chartBody.append('g').attr('class', 'rows axis');
        }

        let gRowsText = gRows.selectAll('text').data(rows.domain());

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

        transition(gRowsText, this.transitionDuration(), this.transitionDelay())
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
     * @method boxOnClick
     * @memberof dc.heatMap
     * @instance
     * @example
     * // default box on click handler
     * chart.boxOnClick(function (d) {
     *     var filter = d.key;
     *     dc.events.trigger(function () {
     *         _chart.filter(filter);
     *         _chart.redrawGroup();
     *     });
     * });
     * @param  {Function} [handler]
     * @returns {Function|dc.heatMap}
     */
    boxOnClick (handler) {
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
     * @method xAxisOnClick
     * @memberof dc.heatMap
     * @instance
     * @param  {Function} [handler]
     * @returns {Function|dc.heatMap}
     */
    xAxisOnClick (handler) {
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
     * @method yAxisOnClick
     * @memberof dc.heatMap
     * @instance
     * @param  {Function} [handler]
     * @returns {Function|dc.heatMap}
     */
    yAxisOnClick (handler) {
        if (!arguments.length) {
            return this._yAxisOnClick;
        }
        this._yAxisOnClick = handler;
        return this;
    }

    /**
     * Gets or sets the X border radius.  Set to 0 to get full rectangles.
     * @method xBorderRadius
     * @memberof dc.heatMap
     * @instance
     * @param  {Number} [xBorderRadius=6.75]
     * @returns {Number|dc.heatMap}
     */
    xBorderRadius (xBorderRadius) {
        if (!arguments.length) {
            return this._xBorderRadius;
        }
        this._xBorderRadius = xBorderRadius;
        return this;
    }

    /**
     * Gets or sets the Y border radius.  Set to 0 to get full rectangles.
     * @method yBorderRadius
     * @memberof dc.heatMap
     * @instance
     * @param  {Number} [yBorderRadius=6.75]
     * @returns {Number|dc.heatMap}
     */
    yBorderRadius (yBorderRadius) {
        if (!arguments.length) {
            return this._yBorderRadius;
        }
        this._yBorderRadius = yBorderRadius;
        return this;
    }

    isSelectedNode (d) {
        return this.hasFilter(d.key);
    }
}

export const heatMap = (parent, chartGroup) => new HeatMap(parent, chartGroup);
