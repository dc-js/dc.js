import {extent} from 'd3-array';
import {axisBottom} from 'd3-axis';
import {scaleLinear} from 'd3-scale';

import {CapMixin} from '../base/cap-mixin';
import {MarginMixin} from '../base/margin-mixin';
import {ColorMixin} from '../base/color-mixin';
import {transition} from '../core/core';
import {d3compat} from '../core/config';

/**
 * Concrete row chart implementation.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
 * @mixes CapMixin
 * @mixes MarginMixin
 * @mixes ColorMixin
 * @mixes BaseMixin
 */
export class RowChart extends CapMixin(ColorMixin(MarginMixin)) {
    /**
     * Create a Row Chart.
     * @example
     * // create a row chart under #chart-container1 element using the default global chart group
     * var chart1 = new RowChart('#chart-container1');
     * // create a row chart under #chart-container2 element using chart group A
     * var chart2 = new RowChart('#chart-container2', 'chartGroupA');
     * @param {String|node|d3.selection} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor (parent, chartGroup) {
        super();

        this._g = undefined;

        this._labelOffsetX = 10;
        this._labelOffsetY = 15;
        this._hasLabelOffsetY = false;
        this._dyOffset = '0.35em'; // this helps center labels https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#svg_text
        this._titleLabelOffsetX = 2;

        this._gap = 5;

        this._fixedBarHeight = false;
        this._rowCssClass = 'row';
        this._titleRowCssClass = 'titlerow';
        this._renderTitleLabel = false;

        this._x = undefined;

        this._elasticX = undefined;

        this._xAxis = axisBottom();

        this._rowData = undefined;

        this.rowsCap = this.cap;

        this.title(d => `${this.cappedKeyAccessor(d)}: ${this.cappedValueAccessor(d)}`);

        this.label(d => this.cappedKeyAccessor(d));

        this.anchor(parent, chartGroup);
    }

    _calculateAxisScale () {
        if (!this._x || this._elasticX) {
            const _extent = extent(this._rowData, d => this.cappedValueAccessor(d));
            if (_extent[0] > 0) {
                _extent[0] = 0;
            }
            if (_extent[1] < 0) {
                _extent[1] = 0;
            }
            this._x = scaleLinear().domain(_extent)
                .range([0, this.effectiveWidth()]);
        }
        this._xAxis.scale(this._x);
    }

    _drawAxis () {
        let axisG = this._g.select('g.axis');

        this._calculateAxisScale();

        if (axisG.empty()) {
            axisG = this._g.append('g').attr('class', 'axis');
        }
        axisG.attr('transform', `translate(0, ${this.effectiveHeight()})`);

        transition(axisG, this.transitionDuration(), this.transitionDelay())
            .call(this._xAxis);
    }

    _doRender () {
        this.resetSvg();

        this._g = this.svg()
            .append('g')
            .attr('transform', `translate(${this.margins().left},${this.margins().top})`);

        this._drawChart();

        return this;
    }

    /**
     * Gets or sets the x scale. The x scale can be any d3
     * {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale}.
     * @see {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale}
     * @param {d3.scale} [scale]
     * @returns {d3.scale|RowChart}
     */
    x (scale) {
        if (!arguments.length) {
            return this._x;
        }
        this._x = scale;
        return this;
    }

    _drawGridLines () {
        this._g.selectAll('g.tick')
            .select('line.grid-line')
            .remove();

        this._g.selectAll('g.tick')
            .append('line')
            .attr('class', 'grid-line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', () => -this.effectiveHeight());
    }

    _drawChart () {
        this._rowData = this.data();

        this._drawAxis();
        this._drawGridLines();

        let rows = this._g.selectAll(`g.${this._rowCssClass}`)
            .data(this._rowData);

        this._removeElements(rows);
        rows = this._createElements(rows)
            .merge(rows);
        this._updateElements(rows);
    }

    _createElements (rows) {
        const rowEnter = rows.enter()
            .append('g')
            .attr('class', (d, i) => `${this._rowCssClass} _${i}`);

        rowEnter.append('rect').attr('width', 0);

        this._createLabels(rowEnter);

        return rowEnter;
    }

    _removeElements (rows) {
        rows.exit().remove();
    }

    _rootValue () {
        const root = this._x(0);
        return (root === -Infinity || root !== root) ? this._x(1) : root;
    }

    _updateElements (rows) {
        const n = this._rowData.length;

        let height;
        if (!this._fixedBarHeight) {
            height = (this.effectiveHeight() - (n + 1) * this._gap) / n;
        } else {
            height = this._fixedBarHeight;
        }

        // vertically align label in center unless they override the value via property setter
        if (!this._hasLabelOffsetY) {
            this._labelOffsetY = height / 2;
        }

        const rect = rows.attr('transform', (d, i) => `translate(0,${(i + 1) * this._gap + i * height})`).select('rect')
            .attr('height', height)
            .attr('fill', this.getColor)
            .on('click', d3compat.eventHandler(d => this._onClick(d)))
            .classed('dc-tabbable', this._keyboardAccessible)
            .classed('deselected', d => (this.hasFilter()) ? !this._isSelectedRow(d) : false)
            .classed('selected', d => (this.hasFilter()) ? this._isSelectedRow(d) : false);

        if (this._keyboardAccessible) {
            this._makeKeyboardAccessible(d => this._onClick(d));
        }

        transition(rect, this.transitionDuration(), this.transitionDelay())
            .attr('width', d => Math.abs(this._rootValue() - this._x(this.cappedValueAccessor(d))))
            .attr('transform', d => this._translateX(d));

        this._createTitles(rows);
        this._updateLabels(rows);
    }

    _createTitles (rows) {
        if (this.renderTitle()) {
            rows.select('title').remove();
            rows.append('title').text(this.title());
        }
    }

    _createLabels (rowEnter) {
        if (this.renderLabel()) {
            rowEnter.append('text')
                .on('click', d3compat.eventHandler(d => this._onClick(d)));
        }
        if (this.renderTitleLabel()) {
            rowEnter.append('text')
                .attr('class', this._titleRowCssClass)
                .on('click', d3compat.eventHandler(d => this._onClick(d)));
        }
    }

    _updateLabels (rows) {
        if (this.renderLabel()) {
            const lab = rows.select('text')
                .attr('x', this._labelOffsetX)
                .attr('y', this._labelOffsetY)
                .attr('dy', this._dyOffset)
                .on('click', d3compat.eventHandler(d => this._onClick(d)))
                .attr('class', (d, i) => `${this._rowCssClass} _${i}`)
                .text(d => this.label()(d));
            transition(lab, this.transitionDuration(), this.transitionDelay())
                .attr('transform', d => this._translateX(d));
        }
        if (this.renderTitleLabel()) {
            const titlelab = rows.select(`.${this._titleRowCssClass}`)
                .attr('x', this.effectiveWidth() - this._titleLabelOffsetX)
                .attr('y', this._labelOffsetY)
                .attr('dy', this._dyOffset)
                .attr('text-anchor', 'end')
                .on('click', d3compat.eventHandler(d => this._onClick(d)))
                .attr('class', (d, i) => `${this._titleRowCssClass} _${i}`)
                .text(d => this.title()(d));
            transition(titlelab, this.transitionDuration(), this.transitionDelay())
                .attr('transform', d => this._translateX(d));
        }
    }

    /**
     * Turn on/off Title label rendering (values) using SVG style of text-anchor 'end'.
     * @param {Boolean} [renderTitleLabel=false]
     * @returns {Boolean|RowChart}
     */
    renderTitleLabel (renderTitleLabel) {
        if (!arguments.length) {
            return this._renderTitleLabel;
        }
        this._renderTitleLabel = renderTitleLabel;
        return this;
    }

    _onClick (d) {
        this.onClick(d);
    }

    _translateX (d) {
        const x = this._x(this.cappedValueAccessor(d)),
            x0 = this._rootValue(),
            s = x > x0 ? x0 : x;
        return `translate(${s},0)`;
    }

    _doRedraw () {
        this._drawChart();
        return this;
    }

    /**
     * Get or sets the x axis for the row chart instance.
     * See the {@link https://github.com/d3/d3-axis/blob/master/README.md d3.axis}
     * documention for more information.
     * @param {d3.axis} [xAxis]
     * @example
     * // customize x axis tick format
     * chart.xAxis().tickFormat(function (v) {return v + '%';});
     * // customize x axis tick values
     * chart.xAxis().tickValues([0, 100, 200, 300]);
     * // use a top-oriented axis. Note: position of the axis and grid lines will need to
     * // be set manually, see https://dc-js.github.io/dc.js/examples/row-top-axis.html
     * chart.xAxis(d3.axisTop())
     * @returns {d3.axis|RowChart}
     */
    xAxis (xAxis) {
        if (!arguments.length) {
            return this._xAxis;
        }
        this._xAxis = xAxis;
        return this;
    }

    /**
     * Get or set the fixed bar height. Default is [false] which will auto-scale bars.
     * For example, if you want to fix the height for a specific number of bars (useful in TopN charts)
     * you could fix height as follows (where count = total number of bars in your TopN and gap is
     * your vertical gap space).
     * @example
     * chart.fixedBarHeight( chartheight - (count + 1) * gap / count);
     * @param {Boolean|Number} [fixedBarHeight=false]
     * @returns {Boolean|Number|RowChart}
     */
    fixedBarHeight (fixedBarHeight) {
        if (!arguments.length) {
            return this._fixedBarHeight;
        }
        this._fixedBarHeight = fixedBarHeight;
        return this;
    }

    /**
     * Get or set the vertical gap space between rows on a particular row chart instance.
     * @param {Number} [gap=5]
     * @returns {Number|RowChart}
     */
    gap (gap) {
        if (!arguments.length) {
            return this._gap;
        }
        this._gap = gap;
        return this;
    }

    /**
     * Get or set the elasticity on x axis. If this attribute is set to true, then the x axis will rescale to auto-fit the
     * data range when filtered.
     * @param {Boolean} [elasticX]
     * @returns {Boolean|RowChart}
     */
    elasticX (elasticX) {
        if (!arguments.length) {
            return this._elasticX;
        }
        this._elasticX = elasticX;
        return this;
    }

    /**
     * Get or set the x offset (horizontal space to the top left corner of a row) for labels on a particular row chart.
     * @param {Number} [labelOffsetX=10]
     * @returns {Number|RowChart}
     */
    labelOffsetX (labelOffsetX) {
        if (!arguments.length) {
            return this._labelOffsetX;
        }
        this._labelOffsetX = labelOffsetX;
        return this;
    }

    /**
     * Get or set the y offset (vertical space to the top left corner of a row) for labels on a particular row chart.
     * @param {Number} [labelOffsety=15]
     * @returns {Number|RowChart}
     */
    labelOffsetY (labelOffsety) {
        if (!arguments.length) {
            return this._labelOffsetY;
        }
        this._labelOffsetY = labelOffsety;
        this._hasLabelOffsetY = true;
        return this;
    }

    /**
     * Get of set the x offset (horizontal space between right edge of row and right edge or text.
     * @param {Number} [titleLabelOffsetX=2]
     * @returns {Number|RowChart}
     */
    titleLabelOffsetX (titleLabelOffsetX) {
        if (!arguments.length) {
            return this._titleLabelOffsetX;
        }
        this._titleLabelOffsetX = titleLabelOffsetX;
        return this;
    }

    _isSelectedRow (d) {
        return this.hasFilter(this.cappedKeyAccessor(d));
    }
}

export const rowChart = (parent, chartGroup) => new RowChart(parent, chartGroup);
