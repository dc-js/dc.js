import { SunburstChart as SunburstChartNeo } from '../../charts/sunburst-chart';
import { BaseMixinExt } from '../base/base-mixin';
import { ColorMixinExt } from '../base/color-mixin';
import { ChartGroupType, ChartParentType } from '../../core/types';
import { RingSizeSpecs } from '../../charts/i-sunburst-chart-conf';

export class SunburstChart extends ColorMixinExt(BaseMixinExt(SunburstChartNeo)) {
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }

    /**
     * Get or set the inner radius of the sunburst chart. If the inner radius is greater than 0px then the
     * sunburst chart will be rendered as a doughnut chart. Default inner radius is 0px.
     * @param [innerRadius=0]
     */
    public innerRadius(): number;
    public innerRadius(innerRadius: number): this;
    public innerRadius(innerRadius?) {
        if (!arguments.length) {
            return this._conf.innerRadius;
        }
        this.configure({ innerRadius: innerRadius });
        return this;
    }

    /**
     * Get or set the outer radius. If the radius is not set, it will be half of the minimum of the
     * chart width and height.
     */
    public radius(): number;
    public radius(radius: number): this;
    public radius(radius?) {
        if (!arguments.length) {
            return this._conf.radius;
        }
        this.configure({ radius: radius });
        return this;
    }

    /**
     * Get or set the minimal slice angle for label rendering. Any slice with a smaller angle will not
     * display a slice label.
     * @param [minAngleForLabel=0.5]
     */
    public minAngleForLabel(): number;
    public minAngleForLabel(minAngleForLabel: number): this;
    public minAngleForLabel(minAngleForLabel?) {
        if (!arguments.length) {
            return this._conf.minAngleForLabel;
        }
        this.configure({ minAngleForLabel: minAngleForLabel });
        return this;
    }

    /**
     * Title to use for the only slice when there is no data.
     */
    public emptyTitle(): string;
    public emptyTitle(title: string): this;
    public emptyTitle(title?) {
        if (arguments.length === 0) {
            return this._conf.emptyTitle;
        }
        this.configure({ emptyTitle: title });
        return this;
    }

    /**
     * Position slice labels offset from the outer edge of the chart.
     *
     * The argument specifies the extra radius to be added for slice labels.
     */
    public externalLabels(): number;
    public externalLabels(externalLabelRadius: number): this;
    public externalLabels(externalLabelRadius?) {
        if (arguments.length === 0) {
            return this._conf.externalLabelRadius;
        } else if (externalLabelRadius) {
            this.configure({ externalLabelRadius: externalLabelRadius });
        } else {
            this.configure({ externalLabelRadius: undefined });
        }

        return this;
    }

    /**
     * Get or set the strategy to use for sizing the charts rings.
     *
     * There are three strategies available
     * * {@link SunburstChart.defaultRingSizes `defaultRingSizes`}: the rings get narrower farther away from the center
     * * {@link SunburstChart.relativeRingSizes `relativeRingSizes`}: set the ring sizes as portions of 1
     * * {@link SunburstChart.equalRingSizes `equalRingSizes`}: the rings are equally wide
     *
     * You can modify the returned strategy, or create your own, for custom ring sizing.
     *
     * RingSizes is a duck-typed interface that must support the following methods:
     * * `partitionDy()`: used for
     *   {@link https://github.com/d3/d3-hierarchy/blob/v1.1.9/README.md#partition_size `d3.partition.size`}
     * * `scaleInnerRadius(d)`: takes datum and returns radius for
     *    {@link https://github.com/d3/d3-shape/blob/v1.3.7/README.md#arc_innerRadius `d3.arc.innerRadius`}
     * * `scaleOuterRadius(d)`: takes datum and returns radius for
     *    {@link https://github.com/d3/d3-shape/blob/v1.3.7/README.md#arc_outerRadius `d3.arc.outerRadius`}
     * * `relativeRingSizesFunction(ringCount)`: takes ring count and returns an array of portions that
     *   must add up to 1
     *
     * @example
     * // make rings equally wide
     * chart.ringSizes(chart.equalRingSizes())
     * // reset to default behavior
     * chart.ringSizes(chart.defaultRingSizes()))
     */
    public ringSizes(): RingSizeSpecs;
    public ringSizes(ringSizes: RingSizeSpecs): this;
    public ringSizes(ringSizes?) {
        if (!arguments.length) {
            return this._conf.ringSizes;
        }
        this.configure({ ringSizes: ringSizes });
        return this;
    }
}

export const sunburstChart = (parent: ChartParentType, chartGroup: ChartGroupType) =>
    new SunburstChart(parent, chartGroup);
