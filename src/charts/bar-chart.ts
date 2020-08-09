import {select, Selection} from 'd3-selection';

import {StackMixin} from '../base/stack-mixin';
import {transition} from '../core/core';
import {constants} from '../core/constants';
import {logger} from '../core/logger';
import {pluck2, printSingleValue, safeNumber} from '../core/utils';
import {ChartGroupType, ChartParentType, DCBrushSelection, SVGGElementSelection} from '../core/types';

const MIN_BAR_WIDTH = 1;
const DEFAULT_GAP_BETWEEN_BARS = 2;
const LABEL_PADDING = 3;

/**
 * Concrete bar chart/histogram implementation.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
 * - {@link http://dc-js.github.com/dc.js/crime/index.html Canadian City Crime Stats}
 * @mixes StackMixin
 */
export class BarChart extends StackMixin {
    private _gap: number;
    private _centerBar: boolean;
    private _alwaysUseRounding: boolean;
    private _barWidth: number;

    /**
     * Create a Bar Chart
     * @example
     * // create a bar chart under #chart-container1 element using the default global chart group
     * var chart1 = new BarChart('#chart-container1');
     * // create a bar chart under #chart-container2 element using chart group A
     * var chart2 = new BarChart('#chart-container2', 'chartGroupA');
     * // create a sub-chart under a composite parent chart
     * var chart3 = new BarChart(compositeChart);
     * @param {String|node|d3.selection|CompositeChart} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector}
     * specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar
     * chart is a sub-chart in a {@link CompositeChart Composite Chart} then pass in the parent
     * composite chart instance instead.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super();

        this._gap = DEFAULT_GAP_BETWEEN_BARS;
        this._centerBar = false;
        this._alwaysUseRounding = false;

        this._barWidth = undefined;

        this._conf.label = d => printSingleValue(d.y0 + d.y)
        this._conf.renderLabel = false;

        this.anchor(parent, chartGroup);
    }

    /**
     * Get or set the outer padding on an ordinal bar chart. This setting has no effect on non-ordinal charts.
     * Will pad the width by `padding * barWidth` on each side of the chart.
     * @param {Number} [padding=0.5]
     * @returns {Number|BarChart}
     */
    public outerPadding (): number;
    public outerPadding (padding: number): this;
    public outerPadding (padding?) {
        if (!arguments.length) {
            return this._outerRangeBandPadding();
        }
        return this._outerRangeBandPadding(padding);
    }

    public rescale (): this {
        super.rescale();
        this._barWidth = undefined;
        return this;
    }

    public render (): this {
        if (this._conf.round && this._centerBar && !this._alwaysUseRounding) {
            logger.warn('By default, brush rounding is disabled if bars are centered. ' +
                'See dc.js bar chart API documentation for details.');
        }

        return super.render();
    }

    public plotData (): void {
        let layers: SVGGElementSelection = this.chartBodyG().selectAll('g.stack')
            .data(this.data());

        this._calculateBarWidth();

        layers = layers
            .enter()
            .append('g')
            .attr('class', (d, i) => `stack _${i}`)
            .merge(layers);

        const last = layers.size() - 1;
        {
            const chart = this;
            layers.each(function (d, i) {
                const layer = select(this);

                chart._renderBars(layer, i, d);

                if (chart._conf.renderLabel && last === i) {
                    chart._renderLabels(layer, i, d);
                }
            });
        }
    }

    public _barHeight (d): number {
        return safeNumber(Math.abs(this.y()(d.y + d.y0) - this.y()(d.y0)));
    }

    public _labelXPos (d): number {
        let x = this.x()(d.x);
        if (!this._centerBar) {
            x += this._barWidth / 2;
        }
        if (this.isOrdinal() && this._gap !== undefined) {
            x += this._gap / 2;
        }
        return safeNumber(x);
    }

    public _labelYPos (d): number {
        let y = this.y()(d.y + d.y0);

        if (d.y < 0) {
            y -= this._barHeight(d);
        }

        return safeNumber(y - LABEL_PADDING);
    }

    public _renderLabels (layer: SVGGElementSelection, layerIndex: number, data): void {
        const labels: Selection<SVGTextElement, unknown, SVGGElement, any> = layer.selectAll<SVGTextElement, any>('text.barLabel')
            .data(data.values, d => d.x);

        const labelsEnterUpdate: Selection<SVGTextElement, unknown, SVGGElement, any> = labels
            .enter()
            .append('text')
            .attr('class', 'barLabel')
            .attr('text-anchor', 'middle')
            .attr('x', d => this._labelXPos(d))
            .attr('y', d => this._labelYPos(d))
            .merge(labels);

        if (this.isOrdinal()) {
            labelsEnterUpdate.on('click', d => this.onClick(d));
            labelsEnterUpdate.attr('cursor', 'pointer');
        }

        transition(labelsEnterUpdate, this._conf.transitionDuration, this._conf.transitionDelay)
            .attr('x', d => this._labelXPos(d))
            .attr('y', d => this._labelYPos(d))
            .text(d => this._conf.label(d));

        transition(labels.exit(), this._conf.transitionDuration, this._conf.transitionDelay)
            .attr('height', 0)
            .remove();
    }

    public _barXPos (d): number {
        let x: number = this.x()(d.x);
        if (this._centerBar) {
            x -= this._barWidth / 2;
        }
        if (this.isOrdinal() && this._gap !== undefined) {
            x += this._gap / 2;
        }
        return safeNumber(x);
    }

    public _renderBars (layer: SVGGElementSelection, layerIndex: number, data): void {
        const bars: Selection<SVGRectElement, any, SVGGElement, any> = layer.selectAll<SVGRectElement, any>('rect.bar')
            .data<any>(data.values, d => d.x);

        const enter: Selection<SVGRectElement, any, SVGGElement, any> = bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', (d, i) => this.getColor(d, i))
            .attr('x', d => this._barXPos(d))
            .attr('y', this.yAxisHeight())
            .attr('height', 0);

        const barsEnterUpdate: Selection<SVGRectElement, unknown, SVGGElement, any> = enter.merge(bars);

        if (this._conf.renderTitle) {
            enter.append('title').text(pluck2('data', this.title(data.name)));
        }

        if (this.isOrdinal()) {
            barsEnterUpdate.on('click', d => this.onClick(d));
        }

        transition(barsEnterUpdate, this._conf.transitionDuration, this._conf.transitionDelay)
            .attr('x', d => this._barXPos(d))
            .attr('y', d => {
                let y = this.y()(d.y + d.y0);

                if (d.y < 0) {
                    y -= this._barHeight(d);
                }

                return safeNumber(y);
            })
            .attr('width', this._barWidth)
            .attr('height', d => this._barHeight(d))
            .attr('fill', (d, i) => this.getColor(d, i))
            .select('title').text(pluck2('data', this.title(data.name)));

        transition(bars.exit(), this._conf.transitionDuration, this._conf.transitionDelay)
            .attr('x', d => this.x()(d.x))
            .attr('width', this._barWidth * 0.9)
            .remove();
    }

    public _calculateBarWidth (): void {
        if (this._barWidth === undefined) {
            const numberOfBars = this.xUnitCount();

            // please can't we always use rangeBands for bar charts?
            if (this.isOrdinal() && this._gap === undefined) {
                this._barWidth = Math.floor(this.x().bandwidth());
            } else if (this._gap) {
                this._barWidth = Math.floor((this.xAxisLength() - (numberOfBars - 1) * this._gap) / numberOfBars);
            } else {
                this._barWidth = Math.floor(this.xAxisLength() / (1 + this.barPadding()) / numberOfBars);
            }

            if (this._barWidth === Infinity || isNaN(this._barWidth) || this._barWidth < MIN_BAR_WIDTH) {
                this._barWidth = MIN_BAR_WIDTH;
            }
        }
    }

    public fadeDeselectedArea (brushSelection: DCBrushSelection): void {
        const bars: Selection<SVGRectElement, any, SVGGElement, any> = this.chartBodyG().selectAll('rect.bar');

        if (this.isOrdinal()) {
            if (this.hasFilter()) {
                bars.classed(constants.SELECTED_CLASS, d => this.hasFilter(d.x));
                bars.classed(constants.DESELECTED_CLASS, d => !this.hasFilter(d.x));
            } else {
                bars.classed(constants.SELECTED_CLASS, false);
                bars.classed(constants.DESELECTED_CLASS, false);
            }
        } else if (this.brushOn() || this.parentBrushOn()) {
            if (!this.brushIsEmpty(brushSelection)) {
                const start = brushSelection[0];
                const end = brushSelection[1];

                bars.classed(constants.DESELECTED_CLASS, d => d.x < start || d.x >= end);
            } else {
                bars.classed(constants.DESELECTED_CLASS, false);
            }
        }
    }

    /**
     * Whether the bar chart will render each bar centered around the data position on the x-axis.
     * @param {Boolean} [centerBar=false]
     * @returns {Boolean|BarChart}
     */
    public centerBar (): boolean;
    public centerBar (centerBar: boolean): this;
    public centerBar (centerBar?) {
        if (!arguments.length) {
            return this._centerBar;
        }
        this._centerBar = centerBar;
        return this;
    }

    public onClick (d, i?): void {
        super.onClick(d.data, i);
    }

    /**
     * Get or set the spacing between bars as a fraction of bar size. Valid values are between 0-1.
     * Setting this value will also remove any previously set {@link BarChart#gap gap}. See the
     * {@link https://github.com/d3/d3-scale/blob/master/README.md#scaleBand d3 docs}
     * for a visual description of how the padding is applied.
     * @param {Number} [barPadding=0]
     * @returns {Number|BarChart}
     */
    public barPadding (): number;
    public barPadding (barPadding: number): this;
    public barPadding (barPadding?) {
        if (!arguments.length) {
            return this._rangeBandPadding();
        }
        this._rangeBandPadding(barPadding);
        this._gap = undefined;
        return this;
    }

    public _useOuterPadding (): boolean {
        return this._gap === undefined;
    }

    /**
     * Manually set fixed gap (in px) between bars instead of relying on the default auto-generated
     * gap.  By default the bar chart implementation will calculate and set the gap automatically
     * based on the number of data points and the length of the x axis.
     * @param {Number} [gap=2]
     * @returns {Number|BarChart}
     */
    public gap (): number;
    public gap (gap: number): this;
    public gap (gap?) {
        if (!arguments.length) {
            return this._gap;
        }
        this._gap = gap;
        return this;
    }

    public extendBrush (brushSelection) {
        if (brushSelection && this._conf.round && (!this._centerBar || this._alwaysUseRounding)) {
            brushSelection[0] = this._conf.round(brushSelection[0]);
            brushSelection[1] = this._conf.round(brushSelection[1]);
        }
        return brushSelection;
    }

    /**
     * Set or get whether rounding is enabled when bars are centered. If false, using
     * rounding with centered bars will result in a warning and rounding will be ignored.  This flag
     * has no effect if bars are not {@link BarChart#centerBar centered}.
     * When using standard d3.js rounding methods, the brush often doesn't align correctly with
     * centered bars since the bars are offset.  The rounding function must add an offset to
     * compensate, such as in the following example.
     * @example
     * chart.round(function(n) { return Math.floor(n) + 0.5; });
     * @param {Boolean} [alwaysUseRounding=false]
     * @returns {Boolean|BarChart}
     */
    public alwaysUseRounding (): boolean;
    public alwaysUseRounding (alwaysUseRounding: boolean): this;
    public alwaysUseRounding (alwaysUseRounding?) {
        if (!arguments.length) {
            return this._alwaysUseRounding;
        }
        this._alwaysUseRounding = alwaysUseRounding;
        return this;
    }

    public legendHighlight (d): void {
        const colorFilter = (color, inv?) => function () {
            const item = select(this);
            const match = item.attr('fill') === color;
            return inv ? !match : match;
        };

        if (!this.isLegendableHidden(d)) {
            this.g().selectAll('rect.bar')
                .classed('highlight', colorFilter(d.color))
                .classed('fadeout', colorFilter(d.color, true));
        }
    }

    public legendReset (): void {
        this.g().selectAll('rect.bar')
            .classed('highlight', false)
            .classed('fadeout', false);
    }

    public xAxisMax (): Date | number {
        let max = super.xAxisMax();
        if ('resolution' in this._conf.xUnits) {
            const res = this._conf.xUnits.resolution;
            max = (max as number) + res; // max can be date as well, this case refers when xUnits is floating point
        }
        return max;
    }
}
