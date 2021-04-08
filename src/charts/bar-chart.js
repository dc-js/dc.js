import {select} from 'd3-selection';

import {StackMixin} from '../base/stack-mixin';
import {transition} from '../core/core';
import {constants} from '../core/constants';
import {logger} from '../core/logger';
import {pluck, utils} from '../core/utils';
import {d3compat} from '../core/config';

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
    constructor (parent, chartGroup) {
        super();

        this._gap = DEFAULT_GAP_BETWEEN_BARS;
        this._centerBar = false;
        this._alwaysUseRounding = false;

        this._barWidth = undefined;

        this.label(d => utils.printSingleValue(d.y0 + d.y), false);

        this.anchor(parent, chartGroup);
    }

    /**
     * Get or set the outer padding on an ordinal bar chart. This setting has no effect on non-ordinal charts.
     * Will pad the width by `padding * barWidth` on each side of the chart.
     * @param {Number} [padding=0.5]
     * @returns {Number|BarChart}
     */
    outerPadding (padding) {
        if (!arguments.length) {
            return this._outerRangeBandPadding();
        }
        return this._outerRangeBandPadding(padding);
    }

    rescale () {
        super.rescale();
        this._barWidth = undefined;
        return this;
    }

    render () {
        if (this.round() && this._centerBar && !this._alwaysUseRounding) {
            logger.warn('By default, brush rounding is disabled if bars are centered. ' +
                'See dc.js bar chart API documentation for details.');
        }

        return super.render();
    }

    plotData () {
        let layers = this.chartBodyG().selectAll('g.stack')
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

                if (chart.renderLabel() && last === i) {
                    chart._renderLabels(layer, i, d);
                }
            });
        }
    }

    _barHeight (d) {
        return utils.safeNumber(Math.abs(this.y()(d.y + d.y0) - this.y()(d.y0)));
    }

    _labelXPos (d) {
        let x = this.x()(d.x);
        if (!this._centerBar) {
            x += this._barWidth / 2;
        }
        if (this.isOrdinal() && this._gap !== undefined) {
            x += this._gap / 2;
        }
        return utils.safeNumber(x);
    }

    _labelYPos (d) {
        let y = this.y()(d.y + d.y0);

        if (d.y < 0) {
            y -= this._barHeight(d);
        }

        return utils.safeNumber(y - LABEL_PADDING);
    }

    _renderLabels (layer, layerIndex, data) {
        const labels = layer.selectAll('text.barLabel')
            .data(data.values, pluck('x'));

        const labelsEnterUpdate = labels
            .enter()
            .append('text')
            .attr('class', 'barLabel')
            .attr('text-anchor', 'middle')
            .attr('x', d => this._labelXPos(d))
            .attr('y', d => this._labelYPos(d))
            .merge(labels);

        if (this.isOrdinal()) {
            labelsEnterUpdate.on('click', d3compat.eventHandler(d => this.onClick(d)));
            labelsEnterUpdate.attr('cursor', 'pointer');
        }

        transition(labelsEnterUpdate, this.transitionDuration(), this.transitionDelay())
            .attr('x', d => this._labelXPos(d))
            .attr('y', d => this._labelYPos(d))
            .text(d => this.label()(d));

        transition(labels.exit(), this.transitionDuration(), this.transitionDelay())
            .attr('height', 0)
            .remove();
    }

    _barXPos (d) {
        let x = this.x()(d.x);
        if (this._centerBar) {
            x -= this._barWidth / 2;
        }
        if (this.isOrdinal() && this._gap !== undefined) {
            x += this._gap / 2;
        }
        return utils.safeNumber(x);
    }

    _renderBars (layer, layerIndex, data) {
        const bars = layer.selectAll('rect.bar')
            .data(data.values, pluck('x'));

        const enter = bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .classed('dc-tabbable', this._keyboardAccessible)
            .attr('fill', pluck('data', this.getColor))
            .attr('x', d => this._barXPos(d))
            .attr('y', this.yAxisHeight())
            .attr('height', 0);

        const barsEnterUpdate = enter.merge(bars);

        if (this.renderTitle()) {
            enter.append('title').text(pluck('data', this.title(data.name)));
        }

        if (this.isOrdinal()) {
            barsEnterUpdate.on('click', d3compat.eventHandler(d => this.onClick(d)));
        }

        if (this._keyboardAccessible) {
            this._makeKeyboardAccessible(this.onClick);
        }

        transition(barsEnterUpdate, this.transitionDuration(), this.transitionDelay())
            .attr('x', d => this._barXPos(d))
            .attr('y', d => {
                let y = this.y()(d.y + d.y0);

                if (d.y < 0) {
                    y -= this._barHeight(d);
                }

                return utils.safeNumber(y);
            })
            .attr('width', this._barWidth)
            .attr('height', d => this._barHeight(d))
            .attr('fill', pluck('data', this.getColor))
            .select('title').text(pluck('data', this.title(data.name)));

        transition(bars.exit(), this.transitionDuration(), this.transitionDelay())
            .attr('x', d => this.x()(d.x))
            .attr('width', this._barWidth * 0.9)
            .remove();
    }

    _calculateBarWidth () {
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

    fadeDeselectedArea (brushSelection) {
        const bars = this.chartBodyG().selectAll('rect.bar');

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
    centerBar (centerBar) {
        if (!arguments.length) {
            return this._centerBar;
        }
        this._centerBar = centerBar;
        return this;
    }

    onClick (d) {
        super.onClick(d.data);
    }

    /**
     * Get or set the spacing between bars as a fraction of bar size. Valid values are between 0-1.
     * Setting this value will also remove any previously set {@link BarChart#gap gap}. See the
     * {@link https://github.com/d3/d3-scale/blob/master/README.md#scaleBand d3 docs}
     * for a visual description of how the padding is applied.
     * @param {Number} [barPadding=0]
     * @returns {Number|BarChart}
     */
    barPadding (barPadding) {
        if (!arguments.length) {
            return this._rangeBandPadding();
        }
        this._rangeBandPadding(barPadding);
        this._gap = undefined;
        return this;
    }

    _useOuterPadding () {
        return this._gap === undefined;
    }

    /**
     * Manually set fixed gap (in px) between bars instead of relying on the default auto-generated
     * gap.  By default the bar chart implementation will calculate and set the gap automatically
     * based on the number of data points and the length of the x axis.
     * @param {Number} [gap=2]
     * @returns {Number|BarChart}
     */
    gap (gap) {
        if (!arguments.length) {
            return this._gap;
        }
        this._gap = gap;
        return this;
    }

    extendBrush (brushSelection) {
        if (brushSelection && this.round() && (!this._centerBar || this._alwaysUseRounding)) {
            brushSelection[0] = this.round()(brushSelection[0]);
            brushSelection[1] = this.round()(brushSelection[1]);
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
    alwaysUseRounding (alwaysUseRounding) {
        if (!arguments.length) {
            return this._alwaysUseRounding;
        }
        this._alwaysUseRounding = alwaysUseRounding;
        return this;
    }

    legendHighlight (d) {
        const colorFilter = (color, inv) => function () {
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

    legendReset () {
        this.g().selectAll('rect.bar')
            .classed('highlight', false)
            .classed('fadeout', false);
    }

    xAxisMax () {
        let max = super.xAxisMax();
        if ('resolution' in this.xUnits()) {
            const res = this.xUnits().resolution;
            max += res;
        }
        return max;
    }
}

export const barChart = (parent, chartGroup) => new BarChart(parent, chartGroup);
