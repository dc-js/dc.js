import { PieChart as PieChartNeo } from '../../charts/pie-chart';
import { BaseMixinExt } from '../base/base-mixin';
import { ColorMixinExt } from '../base/color-mixin';
import { CapMixinExt } from '../base/cap-mixin';
import { ChartGroupType, ChartParentType } from '../../core/types';

export class PieChart extends CapMixinExt(ColorMixinExt(BaseMixinExt(PieChartNeo))) {
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
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
     * Get or set the maximum number of slices the pie chart will generate. The top slices are determined by
     * value from high to low. Other slices exceeding the cap will be rolled up into one single *Others* slice.
     */
    public slicesCap(cap?: number): this | number {
        return this.cap(cap);
    }

    /**
     * Get or set the external radius padding of the pie chart. This will force the radius of the
     * pie chart to become smaller or larger depending on the value.
     * @param [externalRadiusPadding=0]
     */
    public externalRadiusPadding(): number;
    public externalRadiusPadding(externalRadiusPadding: number): this;
    public externalRadiusPadding(externalRadiusPadding?) {
        if (!arguments.length) {
            return this._conf.externalRadiusPadding;
        }
        this.configure({ externalRadiusPadding: externalRadiusPadding });
        return this;
    }

    /**
     * Get or set the inner radius of the pie chart. If the inner radius is greater than 0px then the
     * pie chart will be rendered as a doughnut chart.
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
     * Position slice labels offset from the outer edge of the chart.
     *
     * The argument specifies the extra radius to be added for slice labels.
     */
    public externalLabels(): number;
    public externalLabels(externalLabels: number): this;
    public externalLabels(externalLabels?) {
        if (arguments.length === 0) {
            return this._conf.externalLabels;
        } else if (externalLabels) {
            // TODO: figure out why there is special handling, do we need it?
            this.configure({ externalLabels: externalLabels });
        } else {
            this.configure({ externalLabels: undefined });
        }

        return this;
    }

    /**
     * Get or set whether to draw lines from pie slices to their labels.
     *
     */
    public drawPaths(): boolean;
    public drawPaths(drawPaths: boolean): this;
    public drawPaths(drawPaths?) {
        if (arguments.length === 0) {
            return this._conf.drawPaths;
        }
        this.configure({ drawPaths: drawPaths });
        return this;
    }
}

export const pieChart = (parent: ChartParentType, chartGroup: ChartGroupType) =>
    new PieChart(parent, chartGroup);
