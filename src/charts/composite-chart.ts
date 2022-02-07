import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { Axis, axisRight } from 'd3-axis';

import { add, subtract } from '../core/utils';
import { CoordinateGridMixin } from '../base/coordinate-grid-mixin';
import {
    ChartGroupType,
    ChartParentType,
    Margins,
    MinimalXYScale,
    SVGGElementSelection,
} from '../core/types';
import { ICompositeChartConf } from './i-composite-chart-conf';

const SUB_CHART_CLASS = 'sub';
const DEFAULT_RIGHT_Y_AXIS_LABEL_PADDING = 12;

/**
 * Composite charts are a special kind of chart that render multiple charts on the same Coordinate
 * Grid. You can overlay (compose) different bar/line/area charts in a single composite chart to
 * achieve some quite flexible charting effects.
 */
export class CompositeChart extends CoordinateGridMixin {
    public _conf: ICompositeChartConf;

    private _children: CoordinateGridMixin[];
    private _childOptions; // TODO: it is conf for children, revisit after creating concept of conf
    private _alignYAxes: boolean;
    private _rightYAxis: Axis<any>;
    private _rightYAxisLabel: string;
    private _rightYAxisLabelPadding: number;
    private _rightY: MinimalXYScale;
    private _rightAxisGridLines: boolean;

    /**
     * Create a Composite Chart.
     *
     * TODO update example
     * @example
     * ```
     * // create a composite chart under #chart-container1 element using the default global chart group
     * var compositeChart1 = new CompositeChart('#chart-container1');
     * // create a composite chart under #chart-container2 element using chart group A
     * var compositeChart2 = new CompositeChart('#chart-container2', 'chartGroupA');
     * ```
     */
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);

        this.configure({
            transitionDuration: 500,
            transitionDelay: 0,
            shareColors: false,
            shareTitle: true,
        });

        this._children = [];

        this._childOptions = {};

        this._alignYAxes = false; // TODO: the setter calls rescale, check in detail later

        this._rightYAxis = axisRight(undefined);
        this._rightYAxisLabel = undefined;
        this._rightYAxisLabelPadding = DEFAULT_RIGHT_Y_AXIS_LABEL_PADDING;
        this._rightY = undefined;
        this._rightAxisGridLines = false;

        this._mandatoryAttributes([]);

        this.on('filtered.dcjs-composite-chart', chart => {
            // Propagate the filters onto the children
            // Notice that on children the call is .replaceFilter and not .filter
            //   the reason is that _chart.filter() returns the entire current set of filters not just the last added one
            this._children.forEach(child => {
                // Go defensive - the shareFilter option may have already set the correct filters
                if (child.filter() !== this.filter()) {
                    child.replaceFilter(this.filter());
                }
            });
        });
    }

    public configure(conf: ICompositeChartConf): this {
        super.configure(conf);
        return this;
    }

    public conf(): ICompositeChartConf {
        return this._conf;
    }

    public _generateG(): SVGGElementSelection {
        const g = super._generateG();

        for (let i = 0; i < this._children.length; ++i) {
            const child: CoordinateGridMixin = this._children[i];

            this._generateChildG(child, i);

            if (!child.dataProvider().conf().dimension) {
                child.dataProvider().configure({ dimension: this.dataProvider().conf().dimension });
            }
            if (!child.dataProvider().conf().group) {
                child.dataProvider().configure({ group: this.dataProvider().conf().group });
            }
            child
                .dataProvider()
                .configure({ shareFilters: this.dataProvider().conf().shareFilters });

            child.configure({
                xUnits: this._conf.xUnits,
                transitionDuration: this._conf.transitionDuration,
                transitionDelay: this._conf.transitionDelay,
                renderTitle: this._conf.renderTitle,
                elasticX: this._conf.elasticX,
            });

            child.chartGroup(this.chartGroup());
            child.svg(this.svg());
            child.configure({
                parentBrushOn: this._conf.brushOn,
                brushOn: false,
            });
        }

        return g;
    }

    public rescale() {
        super.rescale();

        this._children.forEach(child => {
            child.rescale();
        });

        return this;
    }

    public resizing(): boolean;
    public resizing(resizing: boolean): this;
    public resizing(resizing?) {
        if (!arguments.length) {
            return super.resizing();
        }
        super.resizing(resizing);

        this._children.forEach(child => {
            child.resizing(resizing);
        });

        return this;
    }

    protected _prepareYAxis(): void {
        const left = this._leftYAxisChildren().length !== 0;
        const right = this._rightYAxisChildren().length !== 0;
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

    public _renderYAxis() {
        if (this._leftYAxisChildren().length !== 0) {
            this._renderYAxisAt('y', this.yAxis(), this.margins().left);
            this._renderYAxisLabel('y', this.yAxisLabel(), -90);
        }

        if (this._rightYAxisChildren().length !== 0) {
            this._renderYAxisAt('yr', this.rightYAxis(), this.width() - this.margins().right);
            this._renderYAxisLabel(
                'yr',
                this.rightYAxisLabel(),
                90,
                this.width() - this._rightYAxisLabelPadding
            );
        }
    }

    public _calculateYAxisRanges(left: boolean, right: boolean) {
        let lyAxisMin;
        let lyAxisMax;
        let ryAxisMin;
        let ryAxisMax;
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

        return ranges || { lyAxisMin, lyAxisMax, ryAxisMin, ryAxisMax };
    }

    public _alignYAxisRanges(lyAxisMin, lyAxisMax, ryAxisMin, ryAxisMax) {
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
            ryAxisMax: Math.max(ryAxisMax, lyAxisMax * extentRatio),
        };
    }

    public _prepareRightYAxis(ranges) {
        const needDomain = this.rightY() === undefined || this._conf.elasticY;
        const needRange = needDomain || this.resizing();

        if (this.rightY() === undefined) {
            this.rightY(scaleLinear());
        }
        if (needDomain) {
            this.rightY().domain([ranges.ryAxisMin, ranges.ryAxisMax]);
        }
        if (needRange) {
            this.rightY().rangeRound([this._yAxisHeight(), 0]);
        }

        this.rightY().range([this._yAxisHeight(), 0]);
        this.rightYAxis(this.rightYAxis().scale(this.rightY()));

        // In D3v4 create a RightAxis
        // _chart.rightYAxis().orient('right');
    }

    public _prepareLeftYAxis(ranges) {
        const needDomain = this.y() === undefined || this._conf.elasticY;
        const needRange = needDomain || this.resizing();

        if (this.y() === undefined) {
            this.y(scaleLinear());
        }
        if (needDomain) {
            this.y().domain([ranges.lyAxisMin, ranges.lyAxisMax]);
        }
        if (needRange) {
            this.y().rangeRound([this._yAxisHeight(), 0]);
        }

        this.y().range([this._yAxisHeight(), 0]);
        this.yAxis(this.yAxis().scale(this.y()));

        // In D3v4 create a LeftAxis
        // _chart.yAxis().orient('left');
    }

    public _generateChildG(child, i) {
        child._generateG(this.g());
        child.g().attr('class', `${SUB_CHART_CLASS} _${i}`);
    }

    public plotData() {
        for (let i = 0; i < this._children.length; ++i) {
            const child = this._children[i];

            if (!child.g()) {
                this._generateChildG(child, i);
            }

            if (this._conf.shareColors) {
                child.colorHelper(this.colorHelper().share(child.conf().colorAccessor));
            }

            child.x(this.x());

            child.xAxis(this.xAxis());

            if (child.conf().useRightYAxis) {
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
     */
    public useRightAxisGridLines();
    public useRightAxisGridLines(useRightAxisGridLines): this;
    public useRightAxisGridLines(useRightAxisGridLines?) {
        if (!arguments) {
            return this._rightAxisGridLines;
        }

        this._rightAxisGridLines = useRightAxisGridLines;
        return this;
    }

    /**
     * Get or set chart-specific options for all child charts. This is equivalent to calling
     * {@link BaseMixin.options | .options} on each child chart.
     */
    public childOptions();
    public childOptions(childOptions): this;
    public childOptions(childOptions?) {
        if (!arguments.length) {
            return this._childOptions;
        }
        this._childOptions = childOptions;
        this._children.forEach(child => {
            child.options(this._childOptions);
        });
        return this;
    }

    public fadeDeselectedArea(brushSelection) {
        if (this._conf.brushOn) {
            for (let i = 0; i < this._children.length; ++i) {
                const child = this._children[i];
                child.fadeDeselectedArea(brushSelection);
            }
        }
    }

    /**
     * Set or get the right y axis label.
     */
    public rightYAxisLabel(): string;
    public rightYAxisLabel(rightYAxisLabel: string, padding?: number): this;
    public rightYAxisLabel(rightYAxisLabel?, padding?) {
        if (!arguments.length) {
            return this._rightYAxisLabel;
        }
        this._rightYAxisLabel = rightYAxisLabel;
        this.margins().right -= this._rightYAxisLabelPadding;
        this._rightYAxisLabelPadding =
            padding === undefined ? DEFAULT_RIGHT_Y_AXIS_LABEL_PADDING : padding;
        this.margins().right += this._rightYAxisLabelPadding;
        return this;
    }

    /**
     * Combine the given charts into one single composite coordinate grid chart.
     *
     * TODO update example
     *
     * @example
     * ```
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
     * ```
     */
    public compose(subChartArray: CoordinateGridMixin[]) {
        this._children = subChartArray;
        this._children.forEach(child => {
            child.height = () => this.height();
            child.width = () => this.width();
            // @ts-ignore
            child.margins = () => this.margins();

            if (this._conf.shareTitle) {
                child.configure({
                    title: this._conf.title,
                });
            }

            child.options(this._childOptions);
        });
        this.rescale();
        return this;
    }

    public withoutTransitions(callback) {
        const oldVals = this._children.map(child => child.conf().transitionDuration);
        this._children.forEach(child => child.configure({ transitionDuration: 0 }));
        super.withoutTransitions(callback);
        this._children.forEach((child, i) => child.configure({ transitionDuration: oldVals[i] }));
    }

    /**
     * Returns the child charts which are composed into the composite chart.
     */
    public children(): CoordinateGridMixin[] {
        return this._children;
    }

    /**
     * Get or set the y scale for the right axis. The right y scale is typically automatically
     * generated by the chart implementation.
     * @see {@link https://github.com/d3/d3-scale/blob/master/README.md | d3.scale}
     */
    public rightY(): MinimalXYScale;
    public rightY(yScale: MinimalXYScale): this;
    public rightY(yScale?) {
        if (!arguments.length) {
            return this._rightY;
        }
        this._rightY = yScale;
        this.rescale();
        return this;
    }

    /**
     * Get or set alignment between left and right y axes. A line connecting '0' on both y axis
     * will be parallel to x axis. This only has effect when {@link ICoordinateGridMixinConf.elasticY | elasticY} is true.
     */
    public alignYAxes(): boolean;
    public alignYAxes(alignYAxes: boolean): this;
    public alignYAxes(alignYAxes?) {
        if (!arguments.length) {
            return this._alignYAxes;
        }
        this._alignYAxes = alignYAxes;
        this.rescale();
        return this;
    }

    public _leftYAxisChildren() {
        return this._children.filter(child => !child.conf().useRightYAxis);
    }

    public _rightYAxisChildren() {
        return this._children.filter(child => child.conf().useRightYAxis);
    }

    // TODO: revisit all min/max functions after making charts to use Generics

    public _getYAxisMin(charts) {
        return charts.map(c => c.yAxisMin());
    }

    public _yAxisMin() {
        return min(this._getYAxisMin(this._leftYAxisChildren()));
    }

    public _rightYAxisMin() {
        return min(this._getYAxisMin(this._rightYAxisChildren()));
    }

    public _getYAxisMax(charts) {
        return charts.map(c => c.yAxisMax());
    }

    public _yAxisMax() {
        return add(max(this._getYAxisMax(this._leftYAxisChildren())), this._conf.yAxisPadding);
    }

    public _rightYAxisMax() {
        return add(max(this._getYAxisMax(this._rightYAxisChildren())), this._conf.yAxisPadding);
    }

    public _getAllXAxisMinFromChildCharts() {
        return this._children.map(c => c.xAxisMin());
    }

    public xAxisMin() {
        return subtract(
            min(this._getAllXAxisMinFromChildCharts()),
            this._conf.xAxisPadding,
            this._conf.xAxisPaddingUnit
        );
    }

    public _getAllXAxisMaxFromChildCharts() {
        return this._children.map(c => c.xAxisMax());
    }

    public xAxisMax() {
        return add(
            max(this._getAllXAxisMaxFromChildCharts()),
            this._conf.xAxisPadding,
            this._conf.xAxisPaddingUnit
        );
    }

    public legendables() {
        return this._children.reduce((items, child) => {
            if (this._conf.shareColors) {
                child.colorHelper(this.colorHelper().share(child.conf().colorAccessor));
            }
            items.push.apply(items, child.legendables());
            return items;
        }, []);
    }

    public legendHighlight(d): void {
        for (let j = 0; j < this._children.length; ++j) {
            const child = this._children[j];
            child.legendHighlight(d);
        }
    }

    public legendReset(d): void {
        for (let j = 0; j < this._children.length; ++j) {
            const child = this._children[j];
            child.legendReset(d);
        }
    }

    public legendToggle(): void {
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
     *
     * @example
     * ```
     * // customize y axis tick format
     * chart.rightYAxis().tickFormat(function (v) {return v + '%';});
     * // customize y axis tick values
     * chart.rightYAxis().tickValues([0, 100, 200, 300]);
     * ```
     */
    public rightYAxis(): Axis<any>;
    public rightYAxis(rightYAxis: Axis<any>): this;
    public rightYAxis(rightYAxis?) {
        if (!arguments.length) {
            return this._rightYAxis;
        }
        this._rightYAxis = rightYAxis;
        return this;
    }

    public yAxisMin(): number {
        throw new Error('Not supported for this chart type');
    }

    public yAxisMax(): number {
        throw new Error('Not supported for this chart type');
    }
}
