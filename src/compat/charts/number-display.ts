import {NumberDisplay as NumberDisplayNeo} from '../../charts/number-display';
import {BaseMixinExt} from '../base/base-mixin';
import {ChartGroupType, ChartParentType, NumberFormatFn} from '../../core/types';

export class NumberDisplay extends BaseMixinExt(NumberDisplayNeo) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }

    /**
     * Get or set a function to format the value for the display.
     * @see {@link https://github.com/d3/d3-format/blob/master/README.md#format d3.format}
     * @param {Function} [formatter=d3.format('.2s')]
     * @returns {Function|NumberDisplay}
     */
    public formatNumber (): NumberFormatFn;
    public formatNumber (formatter: NumberFormatFn): this;
    public formatNumber (formatter?) {
        if (!arguments.length) {
            return this._conf.formatNumber;
        }
        this.configure({formatNumber: formatter});
        return this;
    }
}

export const numberDisplay = (parent: ChartParentType, chartGroup: ChartGroupType) => new NumberDisplay(parent, chartGroup);
