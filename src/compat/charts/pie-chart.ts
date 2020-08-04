import {PieChart as PieChartNeo} from '../../charts/pie-chart';
import {BaseMixinExt} from '../base/base-mixin';
import {ColorMixinExt} from '../base/color-mixin';
import {CapMixinExt} from '../base/cap-mixin';
import {ChartGroupType, ChartParentType} from '../../core/types';

export class PieChart extends CapMixinExt(ColorMixinExt(BaseMixinExt(PieChartNeo))) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }

    /**
     * Title to use for the only slice when there is no data.
     * @param {String} [title]
     * @returns {String|PieChart}
     */
    public emptyTitle (): string;
    public emptyTitle (title: string): this;
    public emptyTitle (title?) {
        if (arguments.length === 0) {
            return this._conf.emptyTitle;
        }
        this._conf.emptyTitle = title;
        return this;
    }

    /**
     * Get or set the maximum number of slices the pie chart will generate. The top slices are determined by
     * value from high to low. Other slices exceeding the cap will be rolled up into one single *Others* slice.
     * @param {Number} [cap]
     * @returns {Number|PieChart}
     */
    public slicesCap (cap?: number): this|number {
        return this.cap(cap);
    }
}

export const pieChart = (parent: ChartParentType, chartGroup: ChartGroupType) => new PieChart(parent, chartGroup);
