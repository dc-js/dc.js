import { scaleBand } from 'd3-scale';
import { select } from 'd3-selection';
import { max, min } from 'd3-array';

import { d3Box } from '../base/d3.box';
import { CoordinateGridMixin } from '../base/coordinate-grid-mixin';
import { transition } from '../core/core';
import { units } from '../core/units';
import { add, subtract } from '../core/utils';
import {
    BoxWidthFn,
    ChartGroupType,
    ChartParentType,
    DCBrushSelection,
    SVGGElementSelection,
} from '../core/types';
import { IBoxPlotConf } from './i-box-plot-conf';
import { adaptHandler } from '../core/d3compat';

// Returns a function to compute the interquartile range.
function defaultWhiskersIQR(k: number): (d) => [number, number] {
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
    protected _conf: IBoxPlotConf;

    private readonly _whiskers: (d) => [number, number];
    private readonly _box;
    private _boxWidth: BoxWidthFn;

    /**
     * Create a BoxP lot.
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
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super();

        const whiskerIqrFactor = 1.5;
        this._whiskers = defaultWhiskersIQR(whiskerIqrFactor);

        this._box = d3Box();
        this.configure({
            xUnits: units.ordinal,
            tickFormat: null,
            renderDataPoints: false,
            dataOpacity: 0.3,
            dataWidthPortion: 0.8,
            showOutliers: true,
            boldOutlier: false,

            // Used in yAxisMin and yAxisMax to add padding in pixel coordinates
            // so the min and max data points/whiskers are within the chart
            yRangePadding: 8,
        });

        this._boxWidth = (innerChartWidth, xUnits) => {
            if (this.isOrdinal()) {
                return this.x().bandwidth();
            } else {
                return innerChartWidth / (1 + this.boxPadding()) / xUnits;
            }
        };

        // default to ordinal
        this.x(scaleBand());

        // valueAccessor should return an array of values that can be coerced into numbers
        // or if data is overloaded for a static array of arrays, it should be `Number`.
        // Empty arrays are not included.
        this.data(group =>
            group
                .all()
                .map(d => {
                    d.map = accessor => accessor.call(d, d);
                    return d;
                })
                .filter(d => {
                    const values = this._conf.valueAccessor(d);
                    return values.length !== 0;
                })
        );

        this.boxPadding(0.8);
        this.outerPadding(0.5);

        this.anchor(parent, chartGroup);
    }

    public configure(conf: IBoxPlotConf): this {
        super.configure(conf);
        return this;
    }

    public conf(): IBoxPlotConf {
        return this._conf;
    }

    /**
     * Get or set the spacing between boxes as a fraction of box size. Valid values are within 0-1.
     * See the {@link https://github.com/d3/d3-scale/blob/master/README.md#scaleBand d3 docs}
     * for a visual description of how the padding is applied.
     * @see {@link https://github.com/d3/d3-scale/blob/master/README.md#scaleBand d3.scaleBand}
     * @param {Number} [padding=0.8]
     * @returns {Number|BoxPlot}
     */
    public boxPadding(): number;
    public boxPadding(padding: number): this;
    public boxPadding(padding?) {
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
    public outerPadding(): number;
    public outerPadding(padding: number): this;
    public outerPadding(padding?) {
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
    public boxWidth(): BoxWidthFn;
    public boxWidth(boxWidth: BoxWidthFn): this;
    public boxWidth(boxWidth?) {
        if (!arguments.length) {
            return this._boxWidth;
        }
        this._boxWidth = typeof boxWidth === 'function' ? boxWidth : () => boxWidth;
        return this;
    }

    public _boxTransform(d, i: number): string {
        const xOffset = this.x()(this._conf.keyAccessor(d, i));
        return `translate(${xOffset}, 0)`;
    }

    public _preprocessData(): void {
        if (this._conf.elasticX) {
            this.x().domain([]);
        }
    }

    public plotData(): void {
        const calculatedBoxWidth: number = this._boxWidth(this.effectiveWidth(), this.xUnitCount());

        this._box
            .whiskers(this._whiskers)
            .width(calculatedBoxWidth)
            .height(this.effectiveHeight())
            .value(this._conf.valueAccessor)
            .domain(this.y().domain())
            .duration(this._conf.transitionDuration)
            .tickFormat(this._conf.tickFormat)
            .renderDataPoints(this._conf.renderDataPoints)
            .dataOpacity(this._conf.dataOpacity)
            .dataWidthPortion(this._conf.dataWidthPortion)
            .renderTitle(this._conf.renderTitle)
            .showOutliers(this._conf.showOutliers)
            .boldOutlier(this._conf.boldOutlier);

        const boxesG: SVGGElementSelection = this.chartBodyG()
            .selectAll('g.box')
            .data(this.data(), this._conf.keyAccessor);

        const boxesGEnterUpdate: SVGGElementSelection = this._renderBoxes(boxesG);
        this._updateBoxes(boxesGEnterUpdate);
        this._removeBoxes(boxesG);

        this.fadeDeselectedArea(this.filter());
    }

    public _renderBoxes(boxesG: SVGGElementSelection) {
        const boxesGEnter: SVGGElementSelection = boxesG.enter().append('g');

        boxesGEnter
            .attr('class', 'box')
            .attr('transform', (d, i) => this._boxTransform(d, i))
            .call(this._box)
            .on(
                'click',
                adaptHandler(d => {
                    this.filter(this._conf.keyAccessor(d));
                    this.redrawGroup();
                })
            );
        return boxesGEnter.merge(boxesG);
    }

    public _updateBoxes(boxesG: SVGGElementSelection) {
        const chart = this;
        transition(boxesG, this._conf.transitionDuration, this._conf.transitionDelay)
            .attr('transform', (d, i) => this._boxTransform(d, i))
            .call(this._box)
            .each(function (d) {
                const color = chart.getColor(d, 0);
                select(this).select('rect.box').attr('fill', color);
                select(this).selectAll('circle.data').attr('fill', color);
            });
    }

    public _removeBoxes(boxesG: SVGGElementSelection): void {
        boxesG.exit().remove().call(this._box);
    }

    public _minDataValue(): number {
        return min(this.data(), e => min<number>(this._conf.valueAccessor(e)));
    }

    public _maxDataValue(): number {
        return max(this.data(), e => max<number>(this._conf.valueAccessor(e)));
    }

    public _yAxisRangeRatio(): number {
        return (this._maxDataValue() - this._minDataValue()) / this.effectiveHeight();
    }

    public fadeDeselectedArea(brushSelection: DCBrushSelection): void {
        const chart = this;
        if (this.hasFilter()) {
            if (this.isOrdinal()) {
                this.g()
                    .selectAll('g.box')
                    .each(function (d) {
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
                this.g()
                    .selectAll('g.box')
                    .each(function (d) {
                        const key = chart._conf.keyAccessor(d);
                        if (key < start || key >= end) {
                            chart.fadeDeselected(this);
                        } else {
                            chart.highlightSelected(this);
                        }
                    });
            }
        } else {
            this.g()
                .selectAll('g.box')
                .each(function () {
                    chart.resetHighlight(this);
                });
        }
    }

    public isSelectedNode(d): boolean {
        return this.hasFilter(this._conf.keyAccessor(d));
    }

    public yAxisMin(): number {
        const padding = this._conf.yRangePadding * this._yAxisRangeRatio();
        return subtract(this._minDataValue() - padding, this._conf.yAxisPadding) as number;
    }

    public yAxisMax(): number {
        const padding = this._conf.yRangePadding * this._yAxisRangeRatio();
        return add(this._maxDataValue() + padding, this._conf.yAxisPadding) as number;
    }
}
