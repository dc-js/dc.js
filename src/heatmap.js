import * as d3 from 'd3';
import colorMixin from './color-mixin';
import baseMixin from './base-mixin';
import marginMixin from './margin-mixin';
import trigger from './events';
import {override, transition} from './core';
import {TwoDimensionalFilter} from './filters';

/**
 * A heat map is matrix that represents the values of two dimensions of data using colors.
 * @class heatMap
 * @memberof dc
 * @mixes dc.colorMixin
 * @mixes dc.marginMixin
 * @mixes dc.baseMixin
 * @example
 * // create a heat map under #chart-container1 element using the default global chart group
 * let heatMap1 = dc.heatMap('#chart-container1');
 * // create a heat map under #chart-container2 element using chart group A
 * let heatMap2 = dc.heatMap('#chart-container2', 'chartGroupA');
 * @param {String|node|d3.selection} parent - Any valid
 * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Selections.md#selecting-elements d3 single selector} specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.heatMap}
 */
export default function heatMap (parent, chartGroup) {
    const DEFAULT_BORDER_RADIUS = 6.75;

    let _chartBody;

    let _cols;
    let _rows;
    let _colOrdering = d3.ascending;
    let _rowOrdering = d3.ascending;
    const _colScale = d3.scale.ordinal();
    const _rowScale = d3.scale.ordinal();

    let _xBorderRadius = DEFAULT_BORDER_RADIUS;
    let _yBorderRadius = DEFAULT_BORDER_RADIUS;

    const _chart = colorMixin(marginMixin(baseMixin({})));
    _chart._mandatoryAttributes(['group']);
    _chart.title(_chart.colorAccessor());

    let _colsLabel = d => d;
    let _rowsLabel = d => d;

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
    _chart.colsLabel = function (labelFunction) {
        if (!arguments.length) {
            return _colsLabel;
        }
        _colsLabel = labelFunction;
        return _chart;
    };

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
    _chart.rowsLabel = function (labelFunction) {
        if (!arguments.length) {
            return _rowsLabel;
        }
        _rowsLabel = labelFunction;
        return _chart;
    };

    let _xAxisOnClick = function (d) { filterAxis(0, d); };
    let _yAxisOnClick = function (d) { filterAxis(1, d); };
    let _boxOnClick = function (d) {
        const filter = d.key;
        trigger(() => {
            _chart.filter(filter);
            _chart.redrawGroup();
        });
    };

    function filterAxis (axis, value) {
        const cellsOnAxis = _chart.selectAll('.box-group').filter(d => d.key[axis] === value);
        const unfilteredCellsOnAxis = cellsOnAxis.filter(d => !_chart.hasFilter(d.key));
        trigger(() => {
            const selection = unfilteredCellsOnAxis.empty() ? cellsOnAxis : unfilteredCellsOnAxis;
            const filters = selection.data().map(kv => TwoDimensionalFilter(kv.key));
            _chart._filter([filters]);
            _chart.redrawGroup();
        });
    }

    override(_chart, 'filter', function (filter) {
        if (!arguments.length) {
            return _chart._filter();
        }

        return _chart._filter(TwoDimensionalFilter(filter));
    });

    /**
     * Gets or sets the values used to create the rows of the heatmap, as an array. By default, all
     * the values will be fetched from the data using the value accessor.
     * @method rows
     * @memberof dc.heatMap
     * @instance
     * @param  {Array<String|Number>} [rows]
     * @returns {Array<String|Number>|dc.heatMap}
     */

    _chart.rows = function (rows) {
        if (!arguments.length) {
            return _rows;
        }
        _rows = rows;
        return _chart;
    };

    /**
     #### .rowOrdering([orderFunction])
     Get or set an accessor to order the rows.  Default is d3.ascending.
     */
    _chart.rowOrdering = function (_) {
        if (!arguments.length) {
            return _rowOrdering;
        }
        _rowOrdering = _;
        return _chart;
    };

    /**
     * Gets or sets the keys used to create the columns of the heatmap, as an array. By default, all
     * the values will be fetched from the data using the key accessor.
     * @method cols
     * @memberof dc.heatMap
     * @instance
     * @param  {Array<String|Number>} [cols]
     * @returns {Array<String|Number>|dc.heatMap}
     */
    _chart.cols = function (cols) {
        if (!arguments.length) {
            return _cols;
        }
        _cols = cols;
        return _chart;
    };

    /**
     #### .colOrdering([orderFunction])
     Get or set an accessor to order the cols.  Default is ascending.
     */
    _chart.colOrdering = function (_) {
        if (!arguments.length) {
            return _colOrdering;
        }
        _colOrdering = _;
        return _chart;
    };

    _chart._doRender = function () {
        _chart.resetSvg();

        _chartBody = _chart.svg()
            .append('g')
            .attr('class', 'heatmap')
            .attr('transform', `translate(${_chart.margins().left}, ${_chart.margins().top})`);

        return _chart._doRedraw();
    };

    _chart._doRedraw = function () {
        const data = _chart.data();
        let rows = _chart.rows() || data.map(_chart.valueAccessor()),
            cols = _chart.cols() || data.map(_chart.keyAccessor());
        if (_rowOrdering) {
            rows = rows.sort(_rowOrdering);
        }
        if (_colOrdering) {
            cols = cols.sort(_colOrdering);
        }
        rows = _rowScale.domain(rows);
        cols = _colScale.domain(cols);

        const rowCount = rows.domain().length,
            colCount = cols.domain().length,
            boxWidth = Math.floor(_chart.effectiveWidth() / colCount),
            boxHeight = Math.floor(_chart.effectiveHeight() / rowCount);

        cols.rangeRoundBands([0, _chart.effectiveWidth()]);
        rows.rangeRoundBands([_chart.effectiveHeight(), 0]);

        const boxes = _chartBody.selectAll('g.box-group')
            .data(_chart.data(), (d, i) => `${_chart.keyAccessor()(d, i)}\0'${_chart.valueAccessor()(d, i)}`);
        const gEnter = boxes.enter().append('g')
            .attr('class', 'box-group');

        gEnter.append('rect')
            .attr('class', 'heat-box')
            .attr('fill', 'white')
            .on('click', _chart.boxOnClick());

        if (_chart.renderTitle()) {
            gEnter.append('title');
            boxes.select('title').text(_chart.title());
        }

        transition(boxes.select('rect'), _chart.transitionDuration(), _chart.transitionDelay())
            .attr('x', (d, i) => cols(_chart.keyAccessor()(d, i)))
            .attr('y', (d, i) => rows(_chart.valueAccessor()(d, i)))
            .attr('rx', _xBorderRadius)
            .attr('ry', _yBorderRadius)
            .attr('fill', _chart.getColor)
            .attr('width', boxWidth)
            .attr('height', boxHeight);

        boxes.exit().remove();

        let gCols = _chartBody.select('g.cols');
        if (gCols.empty()) {
            gCols = _chartBody.append('g').attr('class', 'cols axis');
        }
        const gColsText = gCols.selectAll('text').data(cols.domain());
        gColsText.enter().append('text')
            .attr('x', d => cols(d) + boxWidth / 2)
            .style('text-anchor', 'middle')
            .attr('y', _chart.effectiveHeight())
            .attr('dy', 12)
            .on('click', _chart.xAxisOnClick())
            .text(_chart.colsLabel());
        transition(gColsText, _chart.transitionDuration(), _chart.transitionDelay())
            .text(_chart.colsLabel())
            .attr('x', d => cols(d) + boxWidth / 2)
            .attr('y', _chart.effectiveHeight());
        gColsText.exit().remove();
        let gRows = _chartBody.select('g.rows');
        if (gRows.empty()) {
            gRows = _chartBody.append('g').attr('class', 'rows axis');
        }
        const gRowsText = gRows.selectAll('text').data(rows.domain());
        gRowsText.enter().append('text')
            .attr('dy', 6)
            .style('text-anchor', 'end')
            .attr('x', 0)
            .attr('dx', -2)
            .on('click', _chart.yAxisOnClick())
            .text(_chart.rowsLabel());
        transition(gRowsText, _chart.transitionDuration(), _chart.transitionDelay())
            .text(_chart.rowsLabel())
            .attr('y', d => rows(d) + boxHeight / 2);
        gRowsText.exit().remove();

        if (_chart.hasFilter()) {
            _chart.selectAll('g.box-group').each(function (d) {
                if (_chart.isSelectedNode(d)) {
                    _chart.highlightSelected(this);
                } else {
                    _chart.fadeDeselected(this);
                }
            });
        } else {
            _chart.selectAll('g.box-group').each(function () {
                _chart.resetHighlight(this);
            });
        }
        return _chart;
    };

    /**
     * Gets or sets the handler that fires when an individual cell is clicked in the heatmap.
     * By default, filtering of the cell will be toggled.
     * @method boxOnClick
     * @memberof dc.heatMap
     * @instance
     * @example
     * // default box on click handler
     * chart.boxOnClick(function (d) {
     *     let filter = d.key;
     *     dc.trigger(function () {
     *         _chart.filter(filter);
     *         _chart.redrawGroup();
     *     });
     * });
     * @param  {Function} [handler]
     * @returns {Function|dc.heatMap}
     */
    _chart.boxOnClick = function (handler) {
        if (!arguments.length) {
            return _boxOnClick;
        }
        _boxOnClick = handler;
        return _chart;
    };

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
    _chart.xAxisOnClick = function (handler) {
        if (!arguments.length) {
            return _xAxisOnClick;
        }
        _xAxisOnClick = handler;
        return _chart;
    };

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
    _chart.yAxisOnClick = function (handler) {
        if (!arguments.length) {
            return _yAxisOnClick;
        }
        _yAxisOnClick = handler;
        return _chart;
    };

    /**
     * Gets or sets the X border radius.  Set to 0 to get full rectangles.
     * @method xBorderRadius
     * @memberof dc.heatMap
     * @instance
     * @param  {Number} [xBorderRadius=6.75]
     * @returns {Number|dc.heatMap}
     */
    _chart.xBorderRadius = function (xBorderRadius) {
        if (!arguments.length) {
            return _xBorderRadius;
        }
        _xBorderRadius = xBorderRadius;
        return _chart;
    };

    /**
     * Gets or sets the Y border radius.  Set to 0 to get full rectangles.
     * @method yBorderRadius
     * @memberof dc.heatMap
     * @instance
     * @param  {Number} [yBorderRadius=6.75]
     * @returns {Number|dc.heatMap}
     */
    _chart.yBorderRadius = function (yBorderRadius) {
        if (!arguments.length) {
            return _yBorderRadius;
        }
        _yBorderRadius = yBorderRadius;
        return _chart;
    };

    _chart.isSelectedNode = function (d) {
        return _chart.hasFilter(d.key);
    };

    return _chart.anchor(parent, chartGroup);
}
