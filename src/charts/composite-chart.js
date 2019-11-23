import {min, max} from 'd3-array';
import {scaleLinear} from 'd3-scale';
import {axisRight} from 'd3-axis';

import {utils} from '../core/utils';
import {CoordinateGridMixin} from '../base/coordinate-grid-mixin';

const SUB_CHART_CLASS = 'sub';
const DEFAULT_RIGHT_Y_AXIS_LABEL_PADDING = 12;

/**
 * Composite charts are a special kind of chart that render multiple charts on the same Coordinate
 * Grid. You can overlay (compose) different bar/line/area charts in a single composite chart to
 * achieve some quite flexible charting effects.
 * @mixes CoordinateGridMixin
 */
export class CompositeChart extends CoordinateGridMixin {
    /**
     * Create a Composite Chart.
     * @example
     * // create a composite chart under #chart-container1 element using the default global chart group
     * var compositeChart1 = new CompositeChart('#chart-container1');
     * // create a composite chart under #chart-container2 element using chart group A
     * var compositeChart2 = new CompositeChart('#chart-container2', 'chartGroupA');
     * @param {String|node|d3.selection} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor (parent, chartGroup) {
        super();

        this._children = [];

        this._childOptions = {};

        this._shareColors = false;
        this._shareTitle = true;
        this._alignYAxes = false;

        this._rightYAxis = axisRight();
        this._rightYAxisLabel = 0;
        this._rightYAxisLabelPadding = DEFAULT_RIGHT_Y_AXIS_LABEL_PADDING;
        this._rightY = undefined;
        this._rightAxisGridLines = false;

        this._mandatoryAttributes([]);
        this.transitionDuration(500);
        this.transitionDelay(0);

        this.on('filtered.dcjs-composite-chart', chart => {
            // Propagate the filters onto the children
            // Notice that on children the call is .replaceFilter and not .filter
            //   the reason is that _chart.filter() returns the entire current set of filters not just the last added one
            for (let i = 0; i < this._children.length; ++i) {
                this._children[i].replaceFilter(this.filter());
            }
        });

        this.anchor(parent, chartGroup);
    }

    _generateG () {
        const g = super._generateG();

        for (let i = 0; i < this._children.length; ++i) {
            const child = this._children[i];

            this._generateChildG(child, i);

            if (!child.dimension()) {
                child.dimension(this.dimension());
            }
            if (!child.group()) {
                child.group(this.group());
            }

            child.chartGroup(this.chartGroup());
            child.svg(this.svg());
            child.xUnits(this.xUnits());
            child.transitionDuration(this.transitionDuration(), this.transitionDelay());
            child.parentBrushOn(this.brushOn());
            child.brushOn(false);
            child.renderTitle(this.renderTitle());
            child.elasticX(this.elasticX());
        }

        return g;
    }

    rescale () {
        super.rescale();

        this._children.forEach(child => {
            child.rescale();
        });

        return this;
    }

    resizing (resizing) {
        if (!arguments.length) {
            return super.resizing();
        }
        super.resizing(resizing);

        this._children.forEach(child => {
            child.resizing(resizing);
        });

        return this;
    }

    _prepareYAxis () {
        const left = (this._leftYAxisChildren().length !== 0);
        const right = (this._rightYAxisChildren().length !== 0);
        const ranges = this._calculateYAxisRanges(left, right);

        if (left) {
            this._prepareLeftYAxis(ranges);
        }
        if (right) {
            this._prepareRightYAxis(ranges);
        }

        if (this._leftYAxisChildren().length > 0 && !this._rightAxisGridLines) {
            this._renderHorizontalGridLinesForAxis(this.g(), this.y(), this.yAxis());
        } else if (this._rightYAxisChildren().length > 0) {
            this._renderHorizontalGridLinesForAxis(this.g(), this._rightY, this._rightYAxis);
        }
    }

    renderYAxis () {
        if (this._leftYAxisChildren().length !== 0) {
            this.renderYAxisAt('y', this.yAxis(), this.margins().left);
            this.renderYAxisLabel('y', this.yAxisLabel(), -90);
        }

        if (this._rightYAxisChildren().length !== 0) {
            this.renderYAxisAt('yr', this.rightYAxis(), this.width() - this.margins().right);
            this.renderYAxisLabel('yr', this.rightYAxisLabel(), 90, this.width() - this._rightYAxisLabelPadding);
        }
    }

    _calculateYAxisRanges (left, right) {
        let lyAxisMin, lyAxisMax, ryAxisMin, ryAxisMax;
        let ranges;

        if (left) {
            lyAxisMin = this._yAxisMin();
            lyAxisMax = this._yAxisMax();
        }

        if (right) {
            ryAxisMin = this._rightYAxisMin();
            ryAxisMax = this._rightYAxisMax();
        }

        if (this.alignYAxes() && left && right) {
            ranges = this._alignYAxisRanges(lyAxisMin, lyAxisMax, ryAxisMin, ryAxisMax);
        }

        return ranges || {
            lyAxisMin: lyAxisMin,
            lyAxisMax: lyAxisMax,
            ryAxisMin: ryAxisMin,
            ryAxisMax: ryAxisMax
        };
    }

    _alignYAxisRanges (lyAxisMin, lyAxisMax, ryAxisMin, ryAxisMax) {
        // since the two series will share a zero, each Y is just a multiple
        // of the other. and the ratio should be the ratio of the ranges of the
        // input data, so that they come out the same height. so we just min/max

        // note: both ranges already include zero due to the stack mixin (#667)
        // if #667 changes, we can reconsider whether we want data height or
        // height from zero to be equal. and it will be possible for the axes
        // to be aligned but not visible.
        const extentRatio = (ryAxisMax - ryAxisMin) / (lyAxisMax - lyAxisMin);

        return {
            lyAxisMin: Math.min(lyAxisMin, ryAxisMin / extentRatio),
            lyAxisMax: Math.max(lyAxisMax, ryAxisMax / extentRatio),
            ryAxisMin: Math.min(ryAxisMin, lyAxisMin * extentRatio),
            ryAxisMax: Math.max(ryAxisMax, lyAxisMax * extentRatio)
        };
    }

    _prepareRightYAxis (ranges) {
        const needDomain = this.rightY() === undefined || this.elasticY(),
            needRange = needDomain || this.resizing();
        if (this.rightY() === undefined) {
            this.rightY(scaleLinear());
        }
        if (needDomain) {
            this.rightY().domain([ranges.ryAxisMin, ranges.ryAxisMax]);
        }
        if (needRange) {
            this.rightY().rangeRound([this.yAxisHeight(), 0]);
        }

        this.rightY().range([this.yAxisHeight(), 0]);
        this.rightYAxis(this.rightYAxis().scale(this.rightY()));

        // In D3v4 create a RightAxis
        // _chart.rightYAxis().orient('right');
    }

    _prepareLeftYAxis (ranges) {
        const needDomain = this.y() === undefined || this.elasticY(),
            needRange = needDomain || this.resizing();
        if (this.y() === undefined) {
            this.y(scaleLinear());
        }
        if (needDomain) {
            this.y().domain([ranges.lyAxisMin, ranges.lyAxisMax]);
        }
        if (needRange) {
            this.y().rangeRound([this.yAxisHeight(), 0]);
        }

        this.y().range([this.yAxisHeight(), 0]);
        this.yAxis(this.yAxis().scale(this.y()));

        // In D3v4 create a LeftAxis
        // _chart.yAxis().orient('left');
    }

    _generateChildG (child, i) {
        child._generateG(this.g());
        child.g().attr('class', `${SUB_CHART_CLASS} _${i}`);
    }

    plotData () {
        for (let i = 0; i < this._children.length; ++i) {
            const child = this._children[i];

            if (!child.g()) {
                this._generateChildG(child, i);
            }

            if (this._shareColors) {
                child.colors(this.colors());
            }

            child.x(this.x());

            child.xAxis(this.xAxis());

            if (child.useRightYAxis()) {
                child.y(this.rightY());
                child.yAxis(this.rightYAxis());
            } else {
                child.y(this.y());
                child.yAxis(this.yAxis());
            }

            child.plotData();

            child._activateRenderlets();
        }
    }

    /**
     * Get or set whether to draw gridlines from the right y axis.  Drawing from the left y axis is the
     * default behavior. This option is only respected when subcharts with both left and right y-axes
     * are present.
     * @param {Boolean} [useRightAxisGridLines=false]
     * @returns {Boolean|CompositeChart}
     */
    useRightAxisGridLines (useRightAxisGridLines) {
        if (!arguments) {
            return this._rightAxisGridLines;
        }

        this._rightAxisGridLines = useRightAxisGridLines;
        return this;
    }

    /**
     * Get or set chart-specific options for all child charts. This is equivalent to calling
     * {@link BaseMixin#options .options} on each child chart.
     * @param {Object} [childOptions]
     * @returns {Object|CompositeChart}
     */
    childOptions (childOptions) {
        if (!arguments.length) {
            return this._childOptions;
        }
        this._childOptions = childOptions;
        this._children.forEach(child => {
            child.options(this._childOptions);
        });
        return this;
    }

    fadeDeselectedArea (brushSelection) {
        if (this.brushOn()) {
            for (let i = 0; i < this._children.length; ++i) {
                const child = this._children[i];
                child.fadeDeselectedArea(brushSelection);
            }
        }
    }

    /**
     * Set or get the right y axis label.
     * @param {String} [rightYAxisLabel]
     * @param {Number} [padding]
     * @returns {String|CompositeChart}
     */
    rightYAxisLabel (rightYAxisLabel, padding) {
        if (!arguments.length) {
            return this._rightYAxisLabel;
        }
        this._rightYAxisLabel = rightYAxisLabel;
        this.margins().right -= this._rightYAxisLabelPadding;
        this._rightYAxisLabelPadding = (padding === undefined) ? DEFAULT_RIGHT_Y_AXIS_LABEL_PADDING : padding;
        this.margins().right += this._rightYAxisLabelPadding;
        return this;
    }

    /**
     * Combine the given charts into one single composite coordinate grid chart.
     * @example
     * moveChart.compose([
     *     // when creating sub-chart you need to pass in the parent chart
     *     new LineChart(moveChart)
     *         .group(indexAvgByMonthGroup) // if group is missing then parent's group will be used
     *         .valueAccessor(function (d){return d.value.avg;})
     *         // most of the normal functions will continue to work in a composed chart
     *         .renderArea(true)
     *         .stack(monthlyMoveGroup, function (d){return d.value;})
     *         .title(function (d){
     *             var value = d.value.avg?d.value.avg:d.value;
     *             if(isNaN(value)) value = 0;
     *             return dateFormat(d.key) + '\n' + numberFormat(value);
     *         }),
     *     new BarChart(moveChart)
     *         .group(volumeByMonthGroup)
     *         .centerBar(true)
     * ]);
     * @param {Array<Chart>} [subChartArray]
     * @returns {CompositeChart}
     */
    compose (subChartArray) {
        this._children = subChartArray;
        this._children.forEach(child => {
            child.height(this.height());
            child.width(this.width());
            child.margins(this.margins());

            if (this._shareTitle) {
                child.title(this.title());
            }

            child.options(this._childOptions);
        });
        this.rescale();
        return this;
    }

    _setChildrenProperty (prop, value) {
        this._children.forEach(child => {
            child[prop](value);
        });
    }

    // properties passed through in compose()
    height (height) {
        if(!arguments.length) {
            return super.height();
        }
        super.height(height);
        this._setChildrenProperty('height', height);
        return this;
    }

    width (width) {
        if(!arguments.length) {
            return super.width();
        }
        super.width(width);
        this._setChildrenProperty('width', width);
        return this;
    }

    margins (margins) {
        if(!arguments.length) {
            return super.margins();
        }
        super.margins(margins);
        this._setChildrenProperty('margins', margins);
        return this;
    }

    /**
     * Returns the child charts which are composed into the composite chart.
     * @returns {Array<BaseMixin>}
     */
    children () {
        return this._children;
    }

    /**
     * Get or set color sharing for the chart. If set, the {@link ColorMixin#colors .colors()} value from this chart
     * will be shared with composed children. Additionally if the child chart implements
     * Stackable and has not set a custom .colorAccessor, then it will generate a color
     * specific to its order in the composition.
     * @param {Boolean} [shareColors=false]
     * @returns {Boolean|CompositeChart}
     */
    shareColors (shareColors) {
        if (!arguments.length) {
            return this._shareColors;
        }
        this._shareColors = shareColors;
        return this;
    }

    /**
     * Get or set title sharing for the chart. If set, the {@link BaseMixin#title .title()} value from
     * this chart will be shared with composed children.
     *
     * Note: currently you must call this before `compose` or the child will still get the parent's
     * `title` function!
     * @param {Boolean} [shareTitle=true]
     * @returns {Boolean|CompositeChart}
     */
    shareTitle (shareTitle) {
        if (!arguments.length) {
            return this._shareTitle;
        }
        this._shareTitle = shareTitle;
        return this;
    }

    /**
     * Get or set the y scale for the right axis. The right y scale is typically automatically
     * generated by the chart implementation.
     * @see {@link https://github.com/d3/d3-scale/blob/master/README.md d3.scale}
     * @param {d3.scale} [yScale]
     * @returns {d3.scale|CompositeChart}
     */
    rightY (yScale) {
        if (!arguments.length) {
            return this._rightY;
        }
        this._rightY = yScale;
        this.rescale();
        return this;
    }

    /**
     * Get or set alignment between left and right y axes. A line connecting '0' on both y axis
     * will be parallel to x axis. This only has effect when {@link CoordinateGridMixin#elasticY elasticY} is true.
     * @param {Boolean} [alignYAxes=false]
     * @returns {Chart}
     */
    alignYAxes (alignYAxes) {
        if (!arguments.length) {
            return this._alignYAxes;
        }
        this._alignYAxes = alignYAxes;
        this.rescale();
        return this;
    }

    _leftYAxisChildren () {
        return this._children.filter(child => !child.useRightYAxis());
    }

    _rightYAxisChildren () {
        return this._children.filter(child => child.useRightYAxis());
    }

    _getYAxisMin (charts) {
        return charts.map(c => c.yAxisMin());
    }

    _yAxisMin () {
        return min(this._getYAxisMin(this._leftYAxisChildren()));
    }

    _rightYAxisMin () {
        return min(this._getYAxisMin(this._rightYAxisChildren()));
    }

    _getYAxisMax (charts) {
        return charts.map(c => c.yAxisMax());
    }

    _yAxisMax () {
        return utils.add(max(this._getYAxisMax(this._leftYAxisChildren())), this.yAxisPadding());
    }

    _rightYAxisMax () {
        return utils.add(max(this._getYAxisMax(this._rightYAxisChildren())), this.yAxisPadding());
    }

    _getAllXAxisMinFromChildCharts () {
        return this._children.map(c => c.xAxisMin());
    }

    xAxisMin () {
        return utils.subtract(min(this._getAllXAxisMinFromChildCharts()), this.xAxisPadding(), this.xAxisPaddingUnit());
    }

    _getAllXAxisMaxFromChildCharts () {
        return this._children.map(c => c.xAxisMax());
    }

    xAxisMax () {
        return utils.add(max(this._getAllXAxisMaxFromChildCharts()), this.xAxisPadding(), this.xAxisPaddingUnit());
    }

    legendables () {
        return this._children.reduce((items, child) => {
            if (this._shareColors) {
                child.colors(this.colors());
            }
            items.push.apply(items, child.legendables());
            return items;
        }, []);
    }

    legendHighlight (d) {
        for (let j = 0; j < this._children.length; ++j) {
            const child = this._children[j];
            child.legendHighlight(d);
        }
    }

    legendReset (d) {
        for (let j = 0; j < this._children.length; ++j) {
            const child = this._children[j];
            child.legendReset(d);
        }
    }

    legendToggle () {
        console.log('composite should not be getting legendToggle itself');
    }

    /**
     * Set or get the right y axis used by the composite chart. This function is most useful when y
     * axis customization is required. The y axis in dc.js is an instance of a
     * [d3.axisRight](https://github.com/d3/d3-axis/blob/master/README.md#axisRight) therefore it supports any valid
     * d3 axis manipulation.
     *
     * **Caution**: The right y axis is usually generated internally by dc; resetting it may cause
     * unexpected results.  Note also that when used as a getter, this function is not chainable: it
     * returns the axis, not the chart,
     * {@link https://github.com/dc-js/dc.js/wiki/FAQ#why-does-everything-break-after-a-call-to-xaxis-or-yaxis
     * so attempting to call chart functions after calling `.yAxis()` will fail}.
     * @see {@link https://github.com/d3/d3-axis/blob/master/README.md#axisRight}
     * @example
     * // customize y axis tick format
     * chart.rightYAxis().tickFormat(function (v) {return v + '%';});
     * // customize y axis tick values
     * chart.rightYAxis().tickValues([0, 100, 200, 300]);
     * @param {d3.axisRight} [rightYAxis]
     * @returns {d3.axisRight|CompositeChart}
     */
    rightYAxis (rightYAxis) {
        if (!arguments.length) {
            return this._rightYAxis;
        }
        this._rightYAxis = rightYAxis;
        return this;
    }

    yAxisMin () {
        throw new Error('Not supported for this chart type');
    }

    yAxisMax () {
        throw new Error('Not supported for this chart type');
    }
}

export const compositeChart = (parent, chartGroup) => new CompositeChart(parent, chartGroup);
