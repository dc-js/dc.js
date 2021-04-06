import {scaleBand} from 'd3-scale';
import {select} from 'd3-selection';
import {min, max} from 'd3-array';

import {d3Box} from '../base/d3.box'
import {CoordinateGridMixin} from '../base/coordinate-grid-mixin';
import {transition} from '../core/core';
import {units} from '../core/units';
import {utils} from '../core/utils';
import {d3compat} from '../core/config';

// Returns a function to compute the interquartile range.
function defaultWhiskersIQR (k) {
    return d => {
        const q1 = d.quartiles[0];
        const q3 = d.quartiles[2];
        const iqr = (q3 - q1) * k;

        let i = -1;
        let j = d.length;

        do {
            ++i;
        } while (d[i] < q1 - iqr);

        do {
            --j;
        } while (d[j] > q3 + iqr);

        return [i, j];
    };
}

/**
 * A box plot is a chart that depicts numerical data via their quartile ranges.
 *
 * Examples:
 * - {@link http://dc-js.github.io/dc.js/examples/boxplot-basic.html Boxplot Basic example}
 * - {@link http://dc-js.github.io/dc.js/examples/boxplot-enhanced.html Boxplot Enhanced example}
 * - {@link http://dc-js.github.io/dc.js/examples/boxplot-render-data.html Boxplot Render Data example}
 * - {@link http://dc-js.github.io/dc.js/examples/boxplot-time.html Boxplot time example}
 * @mixes CoordinateGridMixin
 */
export class BoxPlot extends CoordinateGridMixin {
    /**
     * Create a Box Plot.
     *
     * @example
     * // create a box plot under #chart-container1 element using the default global chart group
     * var boxPlot1 = new BoxPlot('#chart-container1');
     * // create a box plot under #chart-container2 element using chart group A
     * var boxPlot2 = new BoxPlot('#chart-container2', 'chartGroupA');
     * @param {String|node|d3.selection} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor (parent, chartGroup) {
        super();

        this._whiskerIqrFactor = 1.5;
        this._whiskersIqr = defaultWhiskersIQR;
        this._whiskers = this._whiskersIqr(this._whiskerIqrFactor);

        this._box = d3Box();
        this._tickFormat = null;
        this._renderDataPoints = false;
        this._dataOpacity = 0.3;
        this._dataWidthPortion = 0.8;
        this._showOutliers = true;
        this._boldOutlier = false;

        // Used in yAxisMin and yAxisMax to add padding in pixel coordinates
        // so the min and max data points/whiskers are within the chart
        this._yRangePadding = 8;

        this._boxWidth = (innerChartWidth, xUnits) => {
            if (this.isOrdinal()) {
                return this.x().bandwidth();
            } else {
                return innerChartWidth / (1 + this.boxPadding()) / xUnits;
            }
        };

        // default to ordinal
        this.x(scaleBand());
        this.xUnits(units.ordinal);

        // valueAccessor should return an array of values that can be coerced into numbers
        // or if data is overloaded for a static array of arrays, it should be `Number`.
        // Empty arrays are not included.
        this.data(group => group.all().map(d => {
            d.map = accessor => accessor.call(d, d);
            return d;
        }).filter(d => {
            const values = this.valueAccessor()(d);
            return values.length !== 0;
        }));

        this.boxPadding(0.8);
        this.outerPadding(0.5);

        this.anchor(parent, chartGroup);
    }

    /**
     * Get or set the spacing between boxes as a fraction of box size. Valid values are within 0-1.
     * See the {@link https://github.com/d3/d3-scale/blob/master/README.md#scaleBand d3 docs}
     * for a visual description of how the padding is applied.
     * @see {@link https://github.com/d3/d3-scale/blob/master/README.md#scaleBand d3.scaleBand}
     * @param {Number} [padding=0.8]
     * @returns {Number|BoxPlot}
     */
    boxPadding (padding) {
        if (!arguments.length) {
            return this._rangeBandPadding();
        }
        return this._rangeBandPadding(padding);
    }

    /**
     * Get or set the outer padding on an ordinal box chart. This setting has no effect on non-ordinal charts
     * or on charts with a custom {@link BoxPlot#boxWidth .boxWidth}. Will pad the width by
     * `padding * barWidth` on each side of the chart.
     * @param {Number} [padding=0.5]
     * @returns {Number|BoxPlot}
     */
    outerPadding (padding) {
        if (!arguments.length) {
            return this._outerRangeBandPadding();
        }
        return this._outerRangeBandPadding(padding);
    }

    /**
     * Get or set the numerical width of the boxplot box. The width may also be a function taking as
     * parameters the chart width excluding the right and left margins, as well as the number of x
     * units.
     * @example
     * // Using numerical parameter
     * chart.boxWidth(10);
     * // Using function
     * chart.boxWidth((innerChartWidth, xUnits) { ... });
     * @param {Number|Function} [boxWidth=0.5]
     * @returns {Number|Function|BoxPlot}
     */
    boxWidth (boxWidth) {
        if (!arguments.length) {
            return this._boxWidth;
        }
        this._boxWidth = typeof boxWidth === 'function' ? boxWidth : utils.constant(boxWidth);
        return this;
    }

    _boxTransform (d, i) {
        const xOffset = this.x()(this.keyAccessor()(d, i));
        return `translate(${xOffset}, 0)`;
    }

    _preprocessData () {
        if (this.elasticX()) {
            this.x().domain([]);
        }
    }

    plotData () {
        this._calculatedBoxWidth = this._boxWidth(this.effectiveWidth(), this.xUnitCount());

        this._box.whiskers(this._whiskers)
            .width(this._calculatedBoxWidth)
            .height(this.effectiveHeight())
            .value(this.valueAccessor())
            .domain(this.y().domain())
            .duration(this.transitionDuration())
            .tickFormat(this._tickFormat)
            .renderDataPoints(this._renderDataPoints)
            .dataOpacity(this._dataOpacity)
            .dataWidthPortion(this._dataWidthPortion)
            .renderTitle(this.renderTitle())
            .showOutliers(this._showOutliers)
            .boldOutlier(this._boldOutlier);

        const boxesG = this.chartBodyG().selectAll('g.box').data(this.data(), this.keyAccessor());

        const boxesGEnterUpdate = this._renderBoxes(boxesG);
        this._updateBoxes(boxesGEnterUpdate);
        this._removeBoxes(boxesG);

        this.fadeDeselectedArea(this.filter());
    }

    _renderBoxes (boxesG) {
        const boxesGEnter = boxesG.enter().append('g');

        boxesGEnter
            .attr('class', 'box')
            .classed('dc-tabbable', this._keyboardAccessible)
            .attr('transform', (d, i) => this._boxTransform(d, i))
            .call(this._box)
            .on('click', d3compat.eventHandler(d => {
                this.filter(this.keyAccessor()(d));
                this.redrawGroup();
            }))
            .selectAll('circle')
            .classed('dc-tabbable', this._keyboardAccessible);

        if (this._keyboardAccessible) {
            this._makeKeyboardAccessible(this.onClick);
        }

        return boxesGEnter.merge(boxesG);
    }

    _updateBoxes (boxesG) {
        const chart = this;
        transition(boxesG, this.transitionDuration(), this.transitionDelay())
            .attr('transform', (d, i) => this._boxTransform(d, i))
            .call(this._box)
            .each(function (d) {
                const color = chart.getColor(d, 0);
                select(this).select('rect.box').attr('fill', color);
                select(this).selectAll('circle.data').attr('fill', color);
            });
    }

    _removeBoxes (boxesG) {
        boxesG.exit().remove().call(this._box);
    }

    _minDataValue () {
        return min(this.data(), e => min(this.valueAccessor()(e)));
    }

    _maxDataValue () {
        return max(this.data(), e => max(this.valueAccessor()(e)));
    }

    _yAxisRangeRatio () {
        return ((this._maxDataValue() - this._minDataValue()) / this.effectiveHeight());
    }

    onClick (d) {
        this.filter(this.keyAccessor()(d));
        this.redrawGroup();
    }

    fadeDeselectedArea (brushSelection) {
        const chart = this;
        if (this.hasFilter()) {
            if (this.isOrdinal()) {
                this.g().selectAll('g.box').each(function (d) {
                    if (chart.isSelectedNode(d)) {
                        chart.highlightSelected(this);
                    } else {
                        chart.fadeDeselected(this);
                    }
                });
            } else {
                if (!(this.brushOn() || this.parentBrushOn())) {
                    return;
                }
                const start = brushSelection[0];
                const end = brushSelection[1];
                this.g().selectAll('g.box').each(function (d) {
                    const key = chart.keyAccessor()(d);
                    if (key < start || key >= end) {
                        chart.fadeDeselected(this);
                    } else {
                        chart.highlightSelected(this);
                    }
                });
            }
        } else {
            this.g().selectAll('g.box').each(function () {
                chart.resetHighlight(this);
            });
        }
    }

    isSelectedNode (d) {
        return this.hasFilter(this.keyAccessor()(d));
    }

    yAxisMin () {
        const padding = this._yRangePadding * this._yAxisRangeRatio();
        return utils.subtract(this._minDataValue() - padding, this.yAxisPadding());
    }

    yAxisMax () {
        const padding = this._yRangePadding * this._yAxisRangeRatio();
        return utils.add(this._maxDataValue() + padding, this.yAxisPadding());
    }

    /**
     * Get or set the numerical format of the boxplot median, whiskers and quartile labels. Defaults
     * to integer formatting.
     * @example
     * // format ticks to 2 decimal places
     * chart.tickFormat(d3.format('.2f'));
     * @param {Function} [tickFormat]
     * @returns {Number|Function|BoxPlot}
     */
    tickFormat (tickFormat) {
        if (!arguments.length) {
            return this._tickFormat;
        }
        this._tickFormat = tickFormat;
        return this;
    }

    /**
     * Get or set the amount of padding to add, in pixel coordinates, to the top and
     * bottom of the chart to accommodate box/whisker labels.
     * @example
     * // allow more space for a bigger whisker font
     * chart.yRangePadding(12);
     * @param {Function} [yRangePadding = 8]
     * @returns {Number|Function|BoxPlot}
     */
    yRangePadding (yRangePadding) {
        if (!arguments.length) {
            return this._yRangePadding;
        }
        this._yRangePadding = yRangePadding;
        return this;
    }

    /**
     * Get or set whether individual data points will be rendered.
     * @example
     * // Enable rendering of individual data points
     * chart.renderDataPoints(true);
     * @param {Boolean} [show=false]
     * @returns {Boolean|BoxPlot}
     */
    renderDataPoints (show) {
        if (!arguments.length) {
            return this._renderDataPoints;
        }
        this._renderDataPoints = show;
        return this;
    }

    /**
     * Get or set the opacity when rendering data.
     * @example
     * // If individual data points are rendered increase the opacity.
     * chart.dataOpacity(0.7);
     * @param {Number} [opacity=0.3]
     * @returns {Number|BoxPlot}
     */
    dataOpacity (opacity) {
        if (!arguments.length) {
            return this._dataOpacity;
        }
        this._dataOpacity = opacity;
        return this;
    }

    /**
     * Get or set the portion of the width of the box to show data points.
     * @example
     * // If individual data points are rendered increase the data box.
     * chart.dataWidthPortion(0.9);
     * @param {Number} [percentage=0.8]
     * @returns {Number|BoxPlot}
     */
    dataWidthPortion (percentage) {
        if (!arguments.length) {
            return this._dataWidthPortion;
        }
        this._dataWidthPortion = percentage;
        return this;
    }

    /**
     * Get or set whether outliers will be rendered.
     * @example
     * // Disable rendering of outliers
     * chart.showOutliers(false);
     * @param {Boolean} [show=true]
     * @returns {Boolean|BoxPlot}
     */
    showOutliers (show) {
        if (!arguments.length) {
            return this._showOutliers;
        }
        this._showOutliers = show;
        return this;
    }

    /**
     * Get or set whether outliers will be drawn bold.
     * @example
     * // If outliers are rendered display as bold
     * chart.boldOutlier(true);
     * @param {Boolean} [show=false]
     * @returns {Boolean|BoxPlot}
     */
    boldOutlier (show) {
        if (!arguments.length) {
            return this._boldOutlier;
        }
        this._boldOutlier = show;
        return this;
    }
}

export const boxPlot = (parent, chartGroup) => new BoxPlot(parent, chartGroup);
