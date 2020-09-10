import { extent } from 'd3-array';
import { Axis, axisBottom } from 'd3-axis';
import { scaleLinear } from 'd3-scale';

import { CapMixin } from '../base/cap-mixin';
import { MarginMixin } from '../base/margin-mixin';
import { ColorMixin } from '../base/color-mixin';
import { transition } from '../core/core';
import { Selection } from 'd3-selection';
import {
    ChartGroupType,
    ChartParentType,
    MinimalXYScale,
    SVGGElementSelection,
} from '../core/types';
import { IRowChartConf } from './i-row-chart-conf';
import { adaptHandler } from '../core/d3compat';

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
    public _conf: IRowChartConf;

    private _g: Selection<SVGGElement, any, any, any>;
    private _labelOffsetY: number;
    private _dyOffset: string;
    private _rowCssClass: string;
    private _titleRowCssClass: string;
    private _x: MinimalXYScale;
    private _xAxis: Axis<any>;
    private _rowData; // This is chart data
    public rowsCap; // Alias for this.cap

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
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super();

        this.configure({
            label: d => this._conf.keyAccessor(d),
            renderLabel: true,
            labelOffsetX: 10,
            labelOffsetY: undefined,
            titleLabelOffsetX: 2,
            gap: 5,
            fixedBarHeight: undefined,
            renderTitleLabel: false,
            elasticX: undefined,
        });

        this._g = undefined;

        this._dyOffset = '0.35em'; // this helps center labels https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Shapes.md#svg_text
        this._rowCssClass = 'row';
        this._titleRowCssClass = 'titlerow';

        this._x = undefined;

        this._xAxis = axisBottom(undefined);

        this._rowData = undefined;

        this.title(d => `${this._conf.keyAccessor(d)}: ${d._value}`);

        this.anchor(parent, chartGroup);
    }

    public configure(conf: IRowChartConf): this {
        super.configure(conf);
        return this;
    }

    public conf(): IRowChartConf {
        return this._conf;
    }

    private _calculateAxisScale(): void {
        if (!this._x || this._conf.elasticX) {
            const _extent = extent<any, number>(this._rowData, d => d._value);
            if (_extent[0] > 0) {
                _extent[0] = 0;
            }
            if (_extent[1] < 0) {
                _extent[1] = 0;
            }
            this._x = scaleLinear().domain(_extent).range([0, this.effectiveWidth()]);
        }
        this._xAxis.scale(this._x);
    }

    private _drawAxis(): void {
        let axisG = this._g.select<SVGGElement>('g.axis');

        this._calculateAxisScale();

        if (axisG.empty()) {
            axisG = this._g.append('g').attr('class', 'axis');
        }
        axisG.attr('transform', `translate(0, ${this.effectiveHeight()})`);

        transition(axisG, this._conf.transitionDuration, this._conf.transitionDelay).call(
            this._xAxis
        );
    }

    public _doRender(): this {
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
    public x(): MinimalXYScale;
    public x(scale: MinimalXYScale): this;
    public x(scale?) {
        if (!arguments.length) {
            return this._x;
        }
        this._x = scale;
        return this;
    }

    private _drawGridLines() {
        this._g
            .selectAll<SVGGElement, any>('g.tick')
            .select<SVGLineElement>('line.grid-line')
            .remove();

        this._g
            .selectAll<SVGGElement, any>('g.tick')
            .append('line')
            .attr('class', 'grid-line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', () => -this.effectiveHeight());
    }

    private _drawChart() {
        this._rowData = this.data();

        this._drawAxis();
        this._drawGridLines();

        let rows: SVGGElementSelection = this._g
            .selectAll<SVGGElement, any>(`g.${this._rowCssClass}`)
            .data<any>(this._rowData);

        this._removeElements(rows);
        rows = this._createElements(rows).merge(rows);
        this._updateElements(rows);
    }

    private _createElements(rows: SVGGElementSelection): SVGGElementSelection {
        const rowEnter: SVGGElementSelection = rows
            .enter()
            .append('g')
            .attr('class', (d, i) => `${this._rowCssClass} _${i}`);

        rowEnter.append('rect').attr('width', 0);

        this._createLabels(rowEnter);

        return rowEnter;
    }

    private _removeElements(rows: SVGGElementSelection): void {
        rows.exit().remove();
    }

    private _rootValue(): number {
        const root = this._x(0);
        return root === -Infinity || root !== root ? this._x(1) : root;
    }

    private _updateElements(rows: SVGGElementSelection): void {
        const n = this._rowData.length;

        let height: number;
        height = this._conf.fixedBarHeight
            ? this._conf.fixedBarHeight
            : (this.effectiveHeight() - (n + 1) * this._conf.gap) / n;

        // vertically align label in center unless they override the value via property setter
        this._labelOffsetY =
            this._conf.labelOffsetY === undefined ? height / 2 : this._conf.labelOffsetY;

        const rect = rows
            .attr('transform', (d, i) => `translate(0,${(i + 1) * this._conf.gap + i * height})`)
            .select('rect')
            .attr('height', height)
            .attr('fill', (d, i) => this.getColor(d, i))
            .on(
                'click',
                adaptHandler(d => this._onClick(d))
            )
            .classed('deselected', d => (this.hasFilter() ? !this._isSelectedRow(d) : false))
            .classed('selected', d => (this.hasFilter() ? this._isSelectedRow(d) : false));

        transition(rect, this._conf.transitionDuration, this._conf.transitionDelay)
            .attr('width', d => Math.abs(this._rootValue() - this._x(d._value)))
            .attr('transform', d => this._translateX(d));

        this._createTitles(rows);
        this._updateLabels(rows);
    }

    private _createTitles(rows: SVGGElementSelection): void {
        if (this._conf.renderTitle) {
            rows.select('title').remove();
            rows.append('title').text(this.title());
        }
    }

    private _createLabels(rowEnter: SVGGElementSelection): void {
        if (this._conf.renderLabel) {
            rowEnter.append('text').on(
                'click',
                adaptHandler(d => this._onClick(d))
            );
        }
        if (this._conf.renderTitleLabel) {
            rowEnter
                .append('text')
                .attr('class', this._titleRowCssClass)
                .on(
                    'click',
                    adaptHandler(d => this._onClick(d))
                );
        }
    }

    private _updateLabels(rows: SVGGElementSelection): void {
        if (this._conf.renderLabel) {
            const lab = rows
                .select('text')
                .attr('x', this._conf.labelOffsetX)
                .attr('y', this._labelOffsetY)
                .attr('dy', this._dyOffset)
                .on(
                    'click',
                    adaptHandler(d => this._onClick(d))
                )
                .attr('class', (d, i) => `${this._rowCssClass} _${i}`)
                .text(d => this._conf.label(d));

            transition(
                lab,
                this._conf.transitionDuration,
                this._conf.transitionDelay
            ).attr('transform', d => this._translateX(d));
        }

        if (this._conf.renderTitleLabel) {
            const titlelab = rows
                .select<SVGTextElement>(`.${this._titleRowCssClass}`)
                .attr('x', this.effectiveWidth() - this._conf.titleLabelOffsetX)
                .attr('y', this._labelOffsetY)
                .attr('dy', this._dyOffset)
                .attr('text-anchor', 'end')
                .on('click', d => adaptHandler(this._onClick(d)))
                .attr('class', (d, i) => `${this._titleRowCssClass} _${i}`)
                .text(d => this.title()(d));

            transition(
                titlelab,
                this._conf.transitionDuration,
                this._conf.transitionDelay
            ).attr('transform', d => this._translateX(d));
        }
    }

    private _onClick(d, i?: number) {
        this.onClick(d, i);
    }

    private _translateX(d): string {
        const x = this._x(d._value);
        const x0 = this._rootValue();
        const s = x > x0 ? x0 : x;

        return `translate(${s},0)`;
    }

    public _doRedraw() {
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
    public xAxis(): Axis<any>;
    public xAxis(xAxis: Axis<any>): this;
    public xAxis(xAxis?) {
        if (!arguments.length) {
            return this._xAxis;
        }
        this._xAxis = xAxis;
        return this;
    }

    private _isSelectedRow(d): boolean {
        return this.hasFilter(this._conf.keyAccessor(d));
    }
}
