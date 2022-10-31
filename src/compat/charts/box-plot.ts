import { BoxPlot as BoxPlotNeo } from '../../charts/box-plot.js';
import { BaseMixinExt } from '../base/base-mixin.js';
import { ColorMixinExt } from '../base/color-mixin.js';
import { ChartGroupType, ChartParentType, NumberFormatFn } from '../../core/types.js';
import { MarginMixinExt } from '../base/margin-mixin.js';
import { CoordinateGridMixinExt } from '../base/coordinate-grid-mixin.js';

export class BoxPlot extends CoordinateGridMixinExt(
    ColorMixinExt(MarginMixinExt(BaseMixinExt(BoxPlotNeo)))
) {
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }

    /**
     * Get or set the numerical format of the boxplot median, whiskers and quartile labels. Defaults
     * to integer formatting.
     * @example
     * // format ticks to 2 decimal places
     * chart.tickFormat(d3.format('.2f'));
     */
    public tickFormat(): NumberFormatFn;
    public tickFormat(tickFormat: NumberFormatFn): this;
    public tickFormat(tickFormat?) {
        if (!arguments.length) {
            return this._conf.tickFormat;
        }
        this.configure({ tickFormat: tickFormat });
        return this;
    }

    /**
     * Get or set whether individual data points will be rendered.
     * @example
     * // Enable rendering of individual data points
     * chart.renderDataPoints(true);
     * @param [show=false]
     */
    public renderDataPoints(): boolean;
    public renderDataPoints(show: boolean): this;
    public renderDataPoints(show?) {
        if (!arguments.length) {
            return this._conf.renderDataPoints;
        }
        this.configure({ renderDataPoints: show });
        return this;
    }

    /**
     * Get or set the opacity when rendering data.
     * @example
     * // If individual data points are rendered increase the opacity.
     * chart.dataOpacity(0.7);
     * @param [opacity=0.3]
     */
    public dataOpacity(): number;
    public dataOpacity(opacity: number): this;
    public dataOpacity(opacity?) {
        if (!arguments.length) {
            return this._conf.dataOpacity;
        }
        this.configure({ dataOpacity: opacity });
        return this;
    }

    /**
     * Get or set the amount of padding to add, in pixel coordinates, to the top and
     * bottom of the chart to accommodate box/whisker labels.
     * @example
     * // allow more space for a bigger whisker font
     * chart.yRangePadding(12);
     * @param [yRangePadding = 8]
     */
    public yRangePadding(): number;
    public yRangePadding(yRangePadding: number): this;
    public yRangePadding(yRangePadding?) {
        if (!arguments.length) {
            return this._conf.yRangePadding;
        }
        this.configure({ yRangePadding: yRangePadding });
        return this;
    }

    /**
     * Get or set the portion of the width of the box to show data points.
     * @example
     * // If individual data points are rendered increase the data box.
     * chart.dataWidthPortion(0.9);
     * @param [percentage=0.8]
     */
    public dataWidthPortion(): number;
    public dataWidthPortion(percentage: number): this;
    public dataWidthPortion(percentage?) {
        if (!arguments.length) {
            return this._conf.dataWidthPortion;
        }
        this.configure({ dataWidthPortion: percentage });
        return this;
    }

    /**
     * Get or set whether outliers will be rendered.
     * @example
     * // Disable rendering of outliers
     * chart.showOutliers(false);
     * @param [show=true]
     */
    public showOutliers(): boolean;
    public showOutliers(show: boolean): this;
    public showOutliers(show?) {
        if (!arguments.length) {
            return this._conf.showOutliers;
        }
        this.configure({ showOutliers: show });
        return this;
    }

    /**
     * Get or set whether outliers will be drawn bold.
     * @example
     * // If outliers are rendered display as bold
     * chart.boldOutlier(true);
     * @param [show=false]
     */
    public boldOutlier(): boolean;
    public boldOutlier(show: boolean): this;
    public boldOutlier(show?) {
        if (!arguments.length) {
            return this._conf.boldOutlier;
        }
        this.configure({ boldOutlier: show });
        return this;
    }
}

export const boxPlot = (parent, chartGroup) => new BoxPlot(parent, chartGroup);
