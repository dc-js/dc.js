import {DataCount as DataCountNeo} from '../../charts/data-count';
import {logger} from '../../core/logger';
import {BaseMixinExt} from '../base/base-mixin';
import {DataCountHTMLOptions, NumberFormatFn} from '../../core/types';

export class DataCount extends BaseMixinExt(DataCountNeo) {
    public dimension ();
    public dimension (cf): this;
    public dimension (cf?) {
        logger.warnOnce('consider using dataCount.crossfilter instead of dataCount.dimension for clarity');
        if (!arguments.length) {
            return this.crossfilter();
        }
        return this.crossfilter(cf);
    }

    public group ();
    public group (groupAll): this;
    public group (groupAll?) {
        logger.warnOnce('consider using dataCount.groupAll instead of dataCount.group for clarity');
        if (!arguments.length) {
            return this.groupAll();
        }
        return this.groupAll(groupAll);
    }

    /**
     * Gets or sets an optional object specifying HTML templates to use depending how many items are
     * selected. The text `%total-count` will replaced with the total number of records, and the text
     * `%filter-count` will be replaced with the number of selected records.
     * - all: HTML template to use if all items are selected
     * - some: HTML template to use if not all items are selected
     * @example
     * counter.html({
     *      some: '%filter-count out of %total-count records selected',
     *      all: 'All records selected. Click on charts to apply filters'
     * })
     * @param {{some:String, all: String}} [options]
     * @returns {{some:String, all: String}|DataCount}
     */
    public html (): DataCountHTMLOptions;
    public html (options: DataCountHTMLOptions): this;
    public html (options?) {
        if (!arguments.length) {
            return this._conf.html;
        }
        if (options.all) {
            this._conf.html.all = options.all;
        }
        if (options.some) {
            this._conf.html.some = options.some;
        }
        return this;
    }

    /**
     * Gets or sets an optional function to format the filter count and total count.
     * @see {@link https://github.com/d3/d3-format/blob/master/README.md#format d3.format}
     * @example
     * counter.formatNumber(d3.format('.2g'))
     * @param {Function} [formatter=d3.format('.2g')]
     * @returns {Function|DataCount}
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

export const dataCount = (parent, chartGroup) => new DataCount(parent, chartGroup);
